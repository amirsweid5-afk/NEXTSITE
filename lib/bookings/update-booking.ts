'use server'

import {
	bookingInputSchema,
	toStoredPhone,
} from '@/lib/bookings/booking-schema'
import { isAllowedBookingDeadline } from '@/lib/bookings/deadline'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import { updateOfflineBooking } from '@/lib/bookings/offline-bookings'
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
	const offlineUpdated = await updateOfflineBooking({
		bookingId,
		email: profile.email,
		fullName: parsed.data.fullName,
		phone,
		countryCode: parsed.data.countryCode,
		localPhone: parsed.data.phone,
		serviceId: parsed.data.serviceId,
		websiteDescription: parsed.data.websiteDescription,
		budget: parsed.data.budget,
		deadline: parsed.data.deadline,
	})

	if (offlineUpdated) {
		return { ok: true }
	}

	const controller = new AbortController()
	const timer = setTimeout(() => controller.abort(), 4000)

	try {
		const supabase = createAdminClient(controller.signal)
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
			return { ok: false, error: error.message }
		}

		const user = Array.isArray(booking?.users)
			? booking.users[0]
			: booking?.users
		if (
			!booking
			|| !user
			|| user.email.toLowerCase() !== profile.email.toLowerCase()
		) {
			return {
				ok: false,
				error: 'This booking could not be found.',
			}
		}

		const description = buildDescription(parsed.data)
		const { error: updateError } = await supabase
			.from('bookings')
			.update({
				service_id: parsed.data.serviceId,
				description,
			})
			.eq('booking_id', bookingId)

		if (updateError) {
			if (isOfflineClientError(updateError)) {
				throw new Error(updateError.message)
			}
			return { ok: false, error: updateError.message }
		}

		const { error: userError } = await supabase
			.from('users')
			.update({
				name: parsed.data.fullName,
				phone,
			})
			.eq('email', profile.email)

		if (userError && isOfflineClientError(userError)) {
			throw new Error(userError.message)
		}

		return { ok: true }
	} catch (err) {
		if (
			isUnreachableError(err)
			|| (
				err instanceof Error
				&& isUnreachableMessage(err.message)
			)
		) {
			return {
				ok: false,
				error:
					'The booking could not be updated because the database could not be reached.',
			}
		}
		if (err instanceof Error) {
			return { ok: false, error: err.message }
		}
		return {
			ok: false,
			error: 'Could not update your booking.',
		}
	} finally {
		clearTimeout(timer)
	}
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
