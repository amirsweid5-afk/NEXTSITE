'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import {
	deleteOfflineBooking,
	listOfflineBookingsForClient,
} from '@/lib/bookings/offline-bookings'
import { createAdminClient } from '@/lib/supabase/admin'

export interface DeleteMyBookingResult {
	ok: boolean
	error?: string
}

/**
 * Lets a signed-in client delete one of their own bookings.
 */
export async function deleteMyBooking (
	bookingId: string,
): Promise<DeleteMyBookingResult> {
	if (
		typeof bookingId !== 'string' ||
		bookingId.trim() === ''
	) {
		return { ok: false, error: 'Invalid booking.' }
	}

	const profile = await getCurrentProfile()
	if (!profile) {
		return {
			ok: false,
			error: 'Sign in before deleting a booking.',
		}
	}

	const email = profile.email.trim().toLowerCase()
	const offlineMine = await listOfflineBookingsForClient({
		userId: profile.userId,
		email,
	})
	const ownsOffline = offlineMine.some((booking) => {
		return booking.bookingId === bookingId
	})

	let ownsRemote = false
	let remoteDeleted = false
	let remoteError: string | null = null

	try {
		const supabase = createAdminClient()
		const { data: booking, error: lookupError } = await supabase
			.from('bookings')
			.select(`
				booking_id,
				users (
					email
				)
			`)
			.eq('booking_id', bookingId)
			.maybeSingle()

		if (lookupError) {
			remoteError = lookupError.message
		} else if (booking) {
			const user = Array.isArray(booking.users)
				? booking.users[0]
				: booking.users
			ownsRemote = Boolean(
				user
				&& user.email.toLowerCase() === email,
			)

			if (ownsRemote) {
				const { error: deleteError } = await supabase
					.from('bookings')
					.delete()
					.eq('booking_id', bookingId)

				if (deleteError) {
					remoteError = deleteError.message
				} else {
					remoteDeleted = true
				}
			}
		}
	} catch (err) {
		remoteError = err instanceof Error
			? err.message
			: 'Could not reach the database.'
	}

	if (!ownsOffline && !ownsRemote) {
		return {
			ok: false,
			error: 'This booking could not be found.',
		}
	}

	const offlineDeleted = ownsOffline
		? await deleteOfflineBooking(bookingId)
		: false

	if (!offlineDeleted && !remoteDeleted) {
		return {
			ok: false,
			error: remoteError ?? 'Could not delete this booking.',
		}
	}

	revalidatePath('/booking')
	revalidatePath('/dashboard')
	revalidatePath('/admin')
	revalidatePath('/admin/bookings')
	revalidatePath('/admin/client-managing')
	revalidatePath('/admin/clients')

	return { ok: true }
}
