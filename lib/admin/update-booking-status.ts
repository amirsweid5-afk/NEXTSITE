'use server'

import { z } from 'zod'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import { createClient } from '@/lib/supabase/server'
import { type BookingStatus } from '@/lib/supabase/database'

export interface AdminMutationResult {
	ok: boolean
	error?: string
}

const statusSchema = z.object({
	bookingId: z.uuid(),
	status: z.enum([
		'pending',
		'confirmed',
		'cancelled',
		'completed',
	]),
})

/**
 * Updates a booking status. Admin only.
 */
export async function updateBookingStatus (
	input: unknown,
): Promise<AdminMutationResult> {
	const parsed = statusSchema.safeParse(input)

	if (!parsed.success) {
		return { ok: false, error: 'Invalid booking status.' }
	}

	const profile = await getCurrentProfile()

	if (!profile?.isAdmin) {
		return {
			ok: false,
			error: 'Only admins can update booking status.',
		}
	}

	const supabase = await createClient()
	const { error } = await supabase
		.from('bookings')
		.update({
			status: parsed.data.status as BookingStatus,
		})
		.eq('booking_id', parsed.data.bookingId)

	if (error) {
		return { ok: false, error: error.message }
	}

	return { ok: true }
}
