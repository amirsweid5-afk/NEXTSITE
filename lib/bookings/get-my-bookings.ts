import 'server-only'

import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import {
	type ClientBooking,
} from '@/lib/bookings/client-booking-types'
import { listOfflineBookingsForEmail } from '@/lib/bookings/offline-bookings'
import { parseStoredPhone } from '@/lib/phone/parse-phone'
import { SERVICE_CATALOG } from '@/lib/bookings/service-catalog'
import { createClient } from '@/lib/supabase/server'

/**
 * Loads bookings for the signed-in client.
 */
export async function getMyBookings (): Promise<ClientBooking[]> {
	const profile = await getCurrentProfile()
	if (!profile) return []

	const [offline, remote] = await Promise.all([
		listOfflineBookingsForEmail(profile.email),
		loadRemoteBookings(profile.email),
	])

	const seen = new Set(offline.map((booking) => booking.bookingId))
	const merged: ClientBooking[] = [
		...offline.map((booking) => {
			const parsedPhone = parseStoredPhone(booking.phone)
			const service = SERVICE_CATALOG.find((item) => {
				return item.serviceId === booking.serviceId
					|| item.name === booking.serviceName
			})
			return {
				bookingId: booking.bookingId,
				fullName: booking.fullName,
				email: booking.email,
				phone: booking.phone ?? '',
				countryCode: booking.countryCode ?? parsedPhone.countryCode,
				localPhone: booking.localPhone ?? parsedPhone.phone,
				serviceId: booking.serviceId
					?? service?.serviceId
					?? '',
				serviceName: booking.serviceName,
				websiteDescription: booking.websiteDescription,
				budget: booking.budget ?? '',
				deadline: booking.deadline ?? '',
				status: booking.status,
				createdAt: booking.createdAt,
			}
		}),
		...remote.filter((booking) => !seen.has(booking.bookingId)),
	]

	return merged.sort((left, right) => {
		return right.createdAt.localeCompare(left.createdAt)
	})
}

async function loadRemoteBookings (
	email: string,
): Promise<ClientBooking[]> {
	try {
		const supabase = await createClient()
		const query = supabase
			.from('bookings')
			.select(`
				booking_id,
				description,
				status,
				created_at,
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
			.order('created_at', { ascending: false })
		const pending = Promise.resolve(query)
		void pending.catch(() => undefined)
		let timer: ReturnType<typeof setTimeout> | undefined
		const timeout = new Promise<never>((_, reject) => {
			timer = setTimeout(() => reject(new Error('timeout')), 800)
		})
		const { data, error } = await Promise.race([pending, timeout])
		if (timer) clearTimeout(timer)
		if (error || !data) return []

		const normalized = email.trim().toLowerCase()
		return data.flatMap((row) => {
			const user = Array.isArray(row.users) ? row.users[0] : row.users
			const service = Array.isArray(row.services)
				? row.services[0]
				: row.services
			if (!user || !service) return []
			if (user.email.toLowerCase() !== normalized) return []

			const details = splitDescription(row.description ?? '')
			const parsedPhone = parseStoredPhone(user.phone)

			return [{
				bookingId: row.booking_id,
				fullName: user.name,
				email: user.email,
				phone: user.phone ?? '',
				countryCode: parsedPhone.countryCode,
				localPhone: parsedPhone.phone,
				serviceId: row.service_id,
				serviceName: service.name,
				websiteDescription: details.websiteDescription,
				budget: details.budget,
				deadline: details.deadline,
				status: row.status,
				createdAt: row.created_at,
			}]
		})
	} catch {
		return []
	}
}

function splitDescription (value: string) {
	const budgetMatch = value.match(
		/\n\nBudget: (\$\d+(?:\.\d{1,2})?)\s*$/,
	)
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
	} else if (budgetMatch) {
		budget = budgetMatch[1]
	}

	return {
		websiteDescription: rest.trim(),
		budget,
		deadline,
	}
}
