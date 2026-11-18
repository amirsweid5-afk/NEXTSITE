'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import { updateOfflineBookingStatus } from '@/lib/bookings/offline-bookings'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { type BookingStatus } from '@/lib/supabase/database'

export interface AdminMutationResult {
	ok: boolean
	error?: string
}

const statusSchema = z.object({
	bookingId: z.uuid(),
	status: z.enum([
		'pending',
		'confirmed',
		'cancelled',
		'completed',
	]),
})

/**
 * Updates a booking status. Admin only.
 */
export async function updateBookingStatus (
	input: unknown,
): Promise<AdminMutationResult> {
	const parsed = statusSchema.safeParse(input)

	if (!parsed.success) {
		return { ok: false, error: 'Invalid booking status.' }
	}

	const profile = await getCurrentProfile()

	if (!profile?.isAdmin) {
		return {
			ok: false,
			error: 'Only admins can update booking status.',
		}
	}

	const status = parsed.data.status as BookingStatus
	let remoteOk = false
	let remoteError: string | null = null

	try {
		const supabase = await createClient()
		const { error } = await supabase
			.from('bookings')
			.update({ status })
			.eq('booking_id', parsed.data.bookingId)

		if (error) {
			remoteError = error.message
		} else {
			remoteOk = true
		}
	} catch (err) {
		remoteError = err instanceof Error
			? err.message
			: 'Could not reach the database.'
	}

	let offlineOk = await updateOfflineBookingStatus({
		bookingId: parsed.data.bookingId,
		status,
	})

	if (!offlineOk) {
		const seed = await loadStatusSeed(parsed.data.bookingId)
		if (seed) {
			offlineOk = await updateOfflineBookingStatus({
				bookingId: parsed.data.bookingId,
				status,
				seed,
			})
		}
	}

	if (!remoteOk && !offlineOk) {
		return {
			ok: false,
			error: remoteError ?? 'Could not update booking status.',
		}
	}

	revalidatePath('/admin')
	revalidatePath('/admin/bookings')
	revalidatePath('/admin/client-managing')
	revalidatePath('/dashboard')
	revalidatePath('/booking')

	return { ok: true }
}

async function loadStatusSeed (bookingId: string) {
	try {
		const supabase = createAdminClient()
		const { data, error } = await supabase
			.from('bookings')
			.select(`
				description,
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

		return {
			fullName: user.name,
			email: user.email,
			phone: user.phone,
			serviceId: data.service_id,
			serviceName: service.name,
			websiteDescription: data.description ?? '',
			priceUsd: data.price_usd === null
				? 0
				: Number(data.price_usd),
			createdAt: data.created_at,
			ownerEmail: user.email,
		}
	} catch {
		return null
	}
}
