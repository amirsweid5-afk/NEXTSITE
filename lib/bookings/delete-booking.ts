'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import { deleteOfflineBooking } from '@/lib/bookings/offline-bookings'
import { createAdminClient } from '@/lib/supabase/admin'

export interface DeleteBookingResult {
	ok: boolean
	error?: string
}

/**
 * Deletes a booking row. Only admins may call this.
 */
export async function deleteBooking (
	bookingId: string,
): Promise<DeleteBookingResult> {
	if (
		typeof bookingId !== 'string' ||
		bookingId.trim() === ''
	) {
		return { ok: false, error: 'Invalid booking.' }
	}

	const profile = await getCurrentProfile()

	if (!profile?.isAdmin) {
		return {
			ok: false,
			error: 'Only admins can delete bookings.',
		}
	}

	const offlineDeleted = await deleteOfflineBooking(bookingId)
	let remoteDeleted = false
	let remoteError: string | null = null

	try {
		const supabase = createAdminClient()
		const { error } = await supabase
			.from('bookings')
			.delete()
			.eq('booking_id', bookingId)

		if (error) {
			remoteError = error.message
		} else {
			remoteDeleted = true
		}
	} catch (err) {
		remoteError = err instanceof Error
			? err.message
			: 'Could not reach the database.'
	}

	if (!offlineDeleted && !remoteDeleted) {
		return {
			ok: false,
			error: remoteError ?? 'Could not delete this booking.',
		}
	}

	revalidatePath('/admin')
	revalidatePath('/admin/bookings')
	revalidatePath('/admin/client-managing')
	revalidatePath('/admin/clients')
	revalidatePath('/admin/revenue')
	revalidatePath('/dashboard')
	revalidatePath('/booking')

	return { ok: true }
}
