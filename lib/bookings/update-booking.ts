'use server'

import { revalidatePath } from 'next/cache'
import {
	bookingInputSchema,
	toStoredPhone,
} from '@/lib/bookings/booking-schema'
import { isAllowedBookingDeadline } from '@/lib/bookings/deadline'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import {
	updateOfflineBooking,
} from '@/lib/bookings/offline-bookings'
import { SERVICE_CATALOG } from '@/lib/bookings/service-catalog'
import {
	isOfflineClientError,
	isUnreachableError,
	isUnreachableMessage,
} from '@/lib/bookings/service-catalog'
import { createAdminClient } from '@/lib/supabase/admin'

export interface UpdateBookingResult {
	ok: boolean
	error?: string
}

/**
 * Updates a booking owned by the signed-in client.
 * Always persists offline (upsert) so edits save even when remote is missing,
 * and notifies admin when details change.
 */
export async function updateBooking (
	bookingId: string,
	input: unknown,
): Promise<UpdateBookingResult> {
	const parsed = bookingInputSchema.safeParse(input)
	if (!parsed.success) {
		return {
			ok: false,
			error: 'Please check the form and try again.',
		}
	}

	if (!isAllowedBookingDeadline(parsed.data.deadline)) {
		return {
			ok: false,
			error:
				'Choose a deadline at least 7 days from today.',
		}
	}

	const profile = await getCurrentProfile()
	if (!profile) {
		return {
			ok: false,
			error: 'Sign in before editing a booking.',
		}
	}

	const phone = toStoredPhone(parsed.data)
	const catalog = SERVICE_CATALOG.find((item) => {
		return item.serviceId === parsed.data.serviceId
	})
	const email = profile.email.trim().toLowerCase()

	const offlineUpdated = await updateOfflineBooking({
		bookingId,
		email,
		ownerUserId: profile.userId,
		fullName: parsed.data.fullName,
		phone,
		countryCode: parsed.data.countryCode,
		localPhone: parsed.data.phone,
		serviceId: parsed.data.serviceId,
		serviceName: catalog?.name,
		websiteDescription: parsed.data.websiteDescription,
		budget: parsed.data.budget,
		deadline: parsed.data.deadline,
		priceUsd: catalog?.price,
		notify: true,
	})

	if (!offlineUpdated) {
		return {
			ok: false,
			error: 'This booking could not be found.',
		}
	}

	try {
		const supabase = createAdminClient()
		const { data: booking, error } = await supabase
			.from('bookings')
			.select(`
				booking_id,
				users (
					email
				)
			`)
			.eq('booking_id', bookingId)
			.maybeSingle()

		if (error) {
			if (isOfflineClientError(error)) {
				throw new Error(error.message)
			}
		} else {
			const user = Array.isArray(booking?.users)
				? booking.users[0]
				: booking?.users
			const ownsBooking = Boolean(
				booking
				&& user
				&& user.email.toLowerCase() === email,
			)

			if (ownsBooking) {
				const description = buildDescription(parsed.data)
				const { error: updateError } = await supabase
					.from('bookings')
					.update({
						service_id: parsed.data.serviceId,
						description,
					})
					.eq('booking_id', bookingId)

				if (updateError && isOfflineClientError(updateError)) {
					throw new Error(updateError.message)
				}

				await supabase
					.from('users')
					.update({
						name: parsed.data.fullName,
						phone,
					})
					.eq('email', email)
			}
		}
	} catch (err) {
		if (
			isUnreachableError(err)
			|| (
				err instanceof Error
				&& isUnreachableMessage(err.message)
			)
		) {
			revalidateBookingPaths()
			return { ok: true }
		}
	}

	revalidateBookingPaths()
	return { ok: true }
}

function revalidateBookingPaths () {
	revalidatePath('/booking')
	revalidatePath('/dashboard')
	revalidatePath('/admin', 'layout')
	revalidatePath('/admin')
	revalidatePath('/admin/bookings')
	revalidatePath('/admin/client-managing')
	revalidatePath('/admin/notifications')
}

function buildDescription (input: {
	websiteDescription: string
	budget: string
	deadline: string
}) {
	const lines = [input.websiteDescription]
	if (input.budget !== '') {
		lines.push('Budget: ' + input.budget)
	}
	if (input.deadline !== '') {
		lines.push('Preferred deadline: ' + input.deadline)
	}
	return lines.join('\n\n')
}
