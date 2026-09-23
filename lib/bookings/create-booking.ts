'use server'

import { bookingInputSchema } from '@/lib/bookings/booking-schema'
import { createAdminClient } from '@/lib/supabase/admin'

export interface CreateBookingResult {
	ok: boolean
	bookingId?: string
	error?: string
}

/**
 * Saves a public booking request as a user and booking row.
 */
export async function createBooking (
	input: unknown,
): Promise<CreateBookingResult> {
	const parsed = bookingInputSchema.safeParse(input)

	if (!parsed.success) {
		return {
			ok: false,
			error: 'Please check the form and try again.',
		}
	}

	const fullName = parsed.data.fullName
	const email = parsed.data.email
	const phone = parsed.data.phone === ''
		? null
		: parsed.data.phone
	const serviceId = parsed.data.serviceId
	const websiteDescription = parsed.data.websiteDescription

	try {
		const supabase = createAdminClient()

		const { data: service, error: serviceError } = await supabase
			.from('services')
			.select('service_id')
			.eq('service_id', serviceId)
			.maybeSingle()

		if (serviceError) {
			return { ok: false, error: serviceError.message }
		}

		if (!service) {
			return {
				ok: false,
				error: 'Please choose a valid service.',
			}
		}

		const { data: existingUser, error: existingUserError } =
			await supabase
				.from('users')
				.select('user_id')
				.eq('email', email)
				.maybeSingle()

		if (existingUserError) {
			return { ok: false, error: existingUserError.message }
		}

		let userId = existingUser?.user_id

		if (userId) {
			const { error: updateError } = await supabase
				.from('users')
				.update({
					name: fullName,
					phone,
				})
				.eq('user_id', userId)

			if (updateError) {
				return { ok: false, error: updateError.message }
			}
		} else {
			const { data: createdUser, error: createUserError } =
				await supabase
					.from('users')
					.insert({
						name: fullName,
						email,
						phone,
						role: 'customer',
					})
					.select('user_id')
					.single()

			if (createUserError || !createdUser) {
				return {
					ok: false,
					error: createUserError?.message
						?? 'Could not save your details.',
				}
			}

			userId = createdUser.user_id
		}

		const { data: booking, error: bookingError } = await supabase
			.from('bookings')
			.insert({
				user_id: userId,
				service_id: serviceId,
				description: websiteDescription,
				status: 'pending',
			})
			.select('booking_id')
			.single()

		if (bookingError || !booking) {
			return {
				ok: false,
				error: bookingError?.message
					?? 'Could not save your booking.',
			}
		}

		return {
			ok: true,
			bookingId: booking.booking_id,
		}
	} catch (err) {
		if (err instanceof Error) {
			return { ok: false, error: err.message }
		}

		return {
			ok: false,
			error: 'Could not save your booking.',
		}
	}
}
