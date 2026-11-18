'use server'

import { revalidatePath } from 'next/cache'
import {
	bookingInputSchema,
	type BookingInput,
	toStoredPhone,
} from '@/lib/bookings/booking-schema'
import { isAllowedBookingDeadline } from '@/lib/bookings/deadline'
import {
	isOfflineClientError,
	isUnreachableError,
	isUnreachableMessage,
	SERVICE_CATALOG,
} from '@/lib/bookings/service-catalog'
import { insertOfflineBooking } from '@/lib/bookings/offline-bookings'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import { createAdminClient } from '@/lib/supabase/admin'

export interface CreateBookingResult {
	ok: boolean
	bookingId?: string
	error?: string
}

interface CreateBookingPayload {
	fullName: string
	email: string
	countryCode: string
	phone: string
	serviceId: string
	websiteDescription: string
	budget: string
	deadline: string
	website?: string
}

/**
 * Saves a public booking request as a user and booking row.
 * Guests may book without an account; honeypot blocks bots.
 */
export async function createBooking (
	input: unknown,
): Promise<CreateBookingResult> {
	const raw = input as CreateBookingPayload

	if (
		typeof raw?.website === 'string'
		&& raw.website.trim() !== ''
	) {
		return { ok: true, bookingId: 'ignored' }
	}

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

	const controller = new AbortController()
	const timer = setTimeout(() => controller.abort(), 4000)
	const owner = await readBookingOwner()

	try {
		const supabase = createAdminClient(controller.signal)
		return await saveRemoteBooking(supabase, parsed.data, owner)
	} catch (err) {
		if (
			isUnreachableError(err)
			|| (
				err instanceof Error
				&& isUnreachableMessage(err.message)
			)
		) {
			return saveOfflineBooking(parsed.data, undefined, undefined, owner)
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

interface BookingOwner {
	ownerUserId?: string
	ownerEmail?: string
}

/**
 * Attaches the booking to the signed-in account, not only the form email.
 */
async function readBookingOwner (): Promise<BookingOwner> {
	const profile = await getCurrentProfile()
	if (!profile) return {}
	return {
		ownerUserId: profile.userId,
		ownerEmail: profile.email.trim().toLowerCase(),
	}
}

async function saveOfflineBooking (
	input: BookingInput,
	bookingId?: string,
	priceUsd?: number,
	owner: BookingOwner = {},
): Promise<CreateBookingResult> {
	const savedId = await insertOfflineBooking({
		bookingId,
		fullName: input.fullName,
		email: input.email,
		phone: toStoredPhone(input),
		countryCode: input.countryCode,
		localPhone: input.phone,
		serviceId: input.serviceId,
		websiteDescription: input.websiteDescription,
		budget: input.budget,
		deadline: input.deadline,
		priceUsd,
		ownerUserId: owner.ownerUserId,
		ownerEmail: owner.ownerEmail,
	})

	if (!savedId) {
		return {
			ok: false,
			error: 'Could not save your booking.',
		}
	}

	revalidateAdminBookingPaths()
	return { ok: true, bookingId: savedId }
}

function revalidateAdminBookingPaths () {
	revalidatePath('/admin')
	revalidatePath('/admin/bookings')
	revalidatePath('/admin/client-managing')
	revalidatePath('/admin/clients')
	revalidatePath('/dashboard')
	revalidatePath('/booking')
}

/**
 * Writes the booking to the database.
 */
async function saveRemoteBooking (
	supabase: ReturnType<typeof createAdminClient>,
	input: BookingInput,
	owner: BookingOwner = {},
): Promise<CreateBookingResult> {
	const fullName = input.fullName
	const email = input.email
	const phone = toStoredPhone(input)
	const serviceId = input.serviceId
	const websiteDescription = projectDetails(input)

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

	const catalog = SERVICE_CATALOG.find((item) => {
		return item.serviceId === serviceId
	})
	await insertOfflineBooking({
		bookingId: booking.booking_id,
		fullName: input.fullName,
		email: input.email,
		phone,
		countryCode: input.countryCode,
		localPhone: input.phone,
		serviceId,
		websiteDescription: input.websiteDescription,
		budget: input.budget,
		deadline: input.deadline,
		priceUsd: Number(service.price) || catalog?.price,
		ownerUserId: owner.ownerUserId,
		ownerEmail: owner.ownerEmail,
	})
	revalidateAdminBookingPaths()

	return {
		ok: true,
		bookingId: booking.booking_id,
	}
}

/**
 * Stores optional budget and deadline with the project description.
 */
function projectDetails (input: BookingInput): string {
	const lines = [input.websiteDescription]
	if (input.budget !== '') {
		lines.push('Budget: ' + input.budget)
	}
	if (input.deadline !== '') {
		lines.push('Preferred deadline: ' + input.deadline)
	}
	return lines.join('\n\n')
}
