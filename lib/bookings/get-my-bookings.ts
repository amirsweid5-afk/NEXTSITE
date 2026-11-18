import 'server-only'

import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import {
	type ClientBooking,
} from '@/lib/bookings/client-booking-types'
import {
	listOfflineBookingsForClient,
} from '@/lib/bookings/offline-bookings'
import {
	getPaymentStatus,
	getRemainingBalance,
	roundUsd,
} from '@/lib/bookings/revenue-math'
import { parseStoredPhone } from '@/lib/phone/parse-phone'
import { SERVICE_CATALOG } from '@/lib/bookings/service-catalog'
import { createAdminClient } from '@/lib/supabase/admin'
import { type WebsiteProgress } from '@/lib/bookings/website-progress'

/**
 * Loads bookings for the signed-in client.
 */
export async function getMyBookings (): Promise<ClientBooking[]> {
	const profile = await getCurrentProfile()
	if (!profile) return []

	const [offline, remote] = await Promise.all([
		listOfflineBookingsForClient({
			userId: profile.userId,
			email: profile.email,
		}),
		loadRemoteBookings(profile.email),
	])

	const offlineById = new Map(offline.map((booking) => {
		return [booking.bookingId, booking] as const
	}))

	const merged = new Map<string, ClientBooking>()

	for (const booking of offline) {
		const parsedPhone = parseStoredPhone(booking.phone)
		const service = SERVICE_CATALOG.find((item) => {
			return item.serviceId === booking.serviceId
				|| item.name === booking.serviceName
		})
		const amountPaid = roundUsd(
			(booking.payments ?? []).reduce((sum, payment) => {
				return sum + payment.amountUsd
			}, 0),
		)
		const priceUsd = booking.priceUsd ?? service?.price ?? null

		merged.set(booking.bookingId, {
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
			priceUsd,
			amountPaid,
			remainingBalance: getRemainingBalance(priceUsd, amountPaid),
			paymentStatus: getPaymentStatus(priceUsd, amountPaid),
			editCount: booking.editCount ?? 0,
			wasEdited: booking.wasEdited === true,
			lastEditedAt: booking.lastEditedAt ?? null,
			websiteProgress: booking.websiteProgress ?? 'not_started',
			progressSetByAdmin: booking.progressSetByAdmin === true,
			progressUpdatedAt: booking.progressUpdatedAt ?? null,
			statusUpdatedAt: booking.statusUpdatedAt ?? null,
		})
	}

	for (const booking of remote) {
		const local = offlineById.get(booking.bookingId)
		if (!local) {
			merged.set(booking.bookingId, booking)
			continue
		}

		merged.set(booking.bookingId, {
			...booking,
			status: local.statusUpdatedAt
				? local.status
				: booking.status,
			statusUpdatedAt: local.statusUpdatedAt ?? null,
			progressSetByAdmin: local.progressSetByAdmin === true,
			progressUpdatedAt: local.progressUpdatedAt ?? null,
			editCount: local.editCount ?? booking.editCount,
			wasEdited: local.wasEdited === true || booking.wasEdited,
			lastEditedAt: local.lastEditedAt ?? booking.lastEditedAt,
			websiteProgress: (local.websiteProgress
				?? booking.websiteProgress) as WebsiteProgress,
			websiteDescription: local.websiteDescription
				|| booking.websiteDescription,
			budget: local.budget || booking.budget,
			deadline: local.deadline || booking.deadline,
			fullName: local.fullName || booking.fullName,
			serviceId: local.serviceId || booking.serviceId,
			serviceName: local.serviceName || booking.serviceName,
		})
	}

	return [...merged.values()].sort((left, right) => {
		return right.createdAt.localeCompare(left.createdAt)
	})
}

async function loadRemoteBookings (
	email: string,
): Promise<ClientBooking[]> {
	try {
		const supabase = createAdminClient()
		const query = supabase
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
				),
				booking_payments (
					amount_usd
				)
			`)
			.order('created_at', { ascending: false })
		const pending = Promise.resolve(query)
		void pending.catch(() => undefined)
		let timer: ReturnType<typeof setTimeout> | undefined
		const timeout = new Promise<never>((_, reject) => {
			timer = setTimeout(() => reject(new Error('timeout')), 4000)
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
			const payments = Array.isArray(row.booking_payments)
				? row.booking_payments
				: []
			const amountPaid = roundUsd(payments.reduce((sum, payment) => {
				return sum + Number(payment.amount_usd)
			}, 0))
			const priceUsd = row.price_usd === null
				? null
				: Number(row.price_usd)

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
				priceUsd,
				amountPaid,
				remainingBalance: getRemainingBalance(priceUsd, amountPaid),
				paymentStatus: getPaymentStatus(priceUsd, amountPaid),
				editCount: 0,
				wasEdited: false,
				lastEditedAt: null,
				websiteProgress: 'not_started' as const,
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
