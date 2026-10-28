'use server'

import {
	bookingInputSchema,
	type BookingInput,
	toStoredPhone,
} from '@/lib/bookings/booking-schema'
import { insertOfflineBooking } from '@/lib/bookings/offline-bookings'
import {
	isOfflineClientError,
	isUnreachableError,
} from '@/lib/bookings/service-catalog'
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

	const controller = new AbortController()
	const timer = setTimeout(() => controller.abort(), 4000)

	try {
		const supabase = createAdminClient(controller.signal)
		return await saveRemoteBooking(supabase, parsed.data)
	} catch (err) {
		if (isUnreachableError(err)) {
			return saveOffline(parsed.data)
		}

		if (err instanceof Error) {
			return { ok: false, error: err.message }
		}

		return {
			ok: false,
			error: 'Could not save your booking.',
		}
	} finally {
		clearTimeout(timer)
	}
}

/**
 * Writes the booking to the database.
 */
async function saveRemoteBooking (
	supabase: ReturnType<typeof createAdminClient>,
	input: BookingInput,
): Promise<CreateBookingResult> {
	const fullName = input.fullName
	const email = input.email
	const phone = toStoredPhone(input)
	const serviceId = input.serviceId
	const websiteDescription = input.websiteDescription

	const { data: service, error: serviceError } = await supabase
		.from('services')
		.select('service_id, price')
		.eq('service_id', serviceId)
		.maybeSingle()

	if (serviceError) {
		if (isOfflineClientError(serviceError)) {
			throw new Error(serviceError.message)
		}
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
		if (isOfflineClientError(existingUserError)) {
			throw new Error(existingUserError.message)
		}
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
			if (isOfflineClientError(updateError)) {
				throw new Error(updateError.message)
			}
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
			if (
				createUserError
				&& isOfflineClientError(createUserError)
			) {
				throw new Error(createUserError.message)
			}
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
			price_usd: Number(service.price),
		})
		.select('booking_id')
		.single()

	if (bookingError || !booking) {
		if (
			bookingError
			&& isOfflineClientError(bookingError)
		) {
			throw new Error(bookingError.message)
		}
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
}

/**
 * Keeps the request when the database host cannot be reached.
 */
async function saveOffline (
	input: BookingInput,
): Promise<CreateBookingResult> {
	const bookingId = await insertOfflineBooking({
		fullName: input.fullName,
		email: input.email,
		phone: toStoredPhone(input),
		serviceId: input.serviceId,
		websiteDescription: input.websiteDescription,
	})

	if (!bookingId) {
		return {
			ok: false,
			error: 'Please choose a valid service.',
		}
	}

	return { ok: true, bookingId }
}
