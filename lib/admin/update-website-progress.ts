'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import { updateOfflineWebsiteProgress } from '@/lib/bookings/offline-bookings'
import { type WebsiteProgress } from '@/lib/bookings/website-progress'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
	bookingId: z.string().min(1),
	websiteProgress: z.enum([
		'not_started',
		'pending',
		'finished',
	]),
})

/**
 * Admin sets website progress shown on the client dashboard.
 */
export async function updateWebsiteProgress (input: {
	bookingId: string
	websiteProgress: WebsiteProgress
}) {
	const profile = await getCurrentProfile()
	if (!profile?.isAdmin) {
		return {
			ok: false as const,
			error: 'Only admins can update website progress.',
		}
	}

	const parsed = schema.safeParse(input)
	if (!parsed.success) {
		return { ok: false as const, error: 'Invalid progress value.' }
	}

	let updated = await updateOfflineWebsiteProgress(parsed.data)

	if (!updated) {
		const seed = await loadRemoteBookingSeed(parsed.data.bookingId)
		if (seed) {
			updated = await updateOfflineWebsiteProgress({
				...parsed.data,
				seed,
			})
		}
	}

	if (!updated) {
		return {
			ok: false as const,
			error: 'Booking not found in client records.',
		}
	}

	revalidatePath('/admin/client-managing')
	revalidatePath('/admin/clients')
	revalidatePath('/admin/bookings')
	revalidatePath('/dashboard')
	revalidatePath('/booking')
	return { ok: true as const }
}

async function loadRemoteBookingSeed (bookingId: string) {
	try {
		const supabase = createAdminClient()
		const { data, error } = await supabase
			.from('bookings')
			.select(`
				booking_id,
				description,
				status,
				created_at,
				price_usd,
				service_id,
				users (
					name,
					email,
					phone
				),
				services (
					name
				)
			`)
			.eq('booking_id', bookingId)
			.maybeSingle()

		if (error || !data) return null

		const user = Array.isArray(data.users) ? data.users[0] : data.users
		const service = Array.isArray(data.services)
			? data.services[0]
			: data.services
		if (!user || !service) return null

		const details = splitDescription(data.description ?? '')

		return {
			fullName: user.name,
			email: user.email,
			phone: user.phone,
			serviceId: data.service_id,
			serviceName: service.name,
			websiteDescription: details.websiteDescription,
			budget: details.budget,
			deadline: details.deadline,
			priceUsd: data.price_usd === null
				? 0
				: Number(data.price_usd),
			status: data.status,
			createdAt: data.created_at,
		}
	} catch {
		return null
	}
}

function splitDescription (value: string) {
	const deadlineMatch = value.match(
		/\n\nPreferred deadline: (\d{4}-\d{2}-\d{2})\s*$/,
	)
	let rest = value
	let budget = ''
	let deadline = ''

	if (deadlineMatch) {
		deadline = deadlineMatch[1]
		rest = rest.slice(0, deadlineMatch.index)
	}
	const budgetAgain = rest.match(
		/\n\nBudget: (\$\d+(?:\.\d{1,2})?)\s*$/,
	)
	if (budgetAgain) {
		budget = budgetAgain[1]
		rest = rest.slice(0, budgetAgain.index)
	}

	return {
		websiteDescription: rest.trim(),
		budget,
		deadline,
	}
}
