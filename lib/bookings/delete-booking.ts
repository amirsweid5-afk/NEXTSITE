'use server'

import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import { createClient } from '@/lib/supabase/server'

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

	const supabase = await createClient()
	const { error } = await supabase
		.from('bookings')
		.delete()
		.eq('booking_id', bookingId)

	if (error) {
		return { ok: false, error: error.message }
	}

	return { ok: true }
}
