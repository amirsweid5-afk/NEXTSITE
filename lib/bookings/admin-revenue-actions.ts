'use server'

import { z } from 'zod'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import { createClient } from '@/lib/supabase/server'

export interface AdminMutationResult {
	ok: boolean
	error?: string
}

const priceSchema = z.object({
	bookingId: z.uuid(),
	priceUsd: z.number().finite().min(0).max(1_000_000),
})

const paymentSchema = z.object({
	bookingId: z.uuid(),
	amountUsd: z.number().finite().positive().max(1_000_000),
	note: z.string().trim().max(500).optional(),
})

/**
 * Sets the project price in USD for a booking (admin only).
 */
export async function updateBookingPrice (
	input: unknown,
): Promise<AdminMutationResult> {
	const parsed = priceSchema.safeParse(input)
	if (!parsed.success) {
		return { ok: false, error: 'Enter a valid USD price.' }
	}

	const profile = await getCurrentProfile()
	if (!profile?.isAdmin) {
		return { ok: false, error: 'Only admins can set prices.' }
	}

	const supabase = await createClient()
	const { error } = await supabase
		.from('bookings')
		.update({ price_usd: parsed.data.priceUsd })
		.eq('booking_id', parsed.data.bookingId)

	if (error) {
		return { ok: false, error: error.message }
	}

	return { ok: true }
}

/**
 * Records a real customer payment against a booking (admin only).
 */
export async function addBookingPayment (
	input: unknown,
): Promise<AdminMutationResult> {
	const parsed = paymentSchema.safeParse(input)
	if (!parsed.success) {
		return { ok: false, error: 'Enter a valid payment amount.' }
	}

	const profile = await getCurrentProfile()
	if (!profile?.isAdmin) {
		return {
			ok: false,
			error: 'Only admins can record payments.',
		}
	}

	const supabase = await createClient()
	const { data: booking, error: bookingError } = await supabase
		.from('bookings')
		.select('booking_id, price_usd')
		.eq('booking_id', parsed.data.bookingId)
		.maybeSingle()

	if (bookingError) {
		return { ok: false, error: bookingError.message }
	}

	if (!booking) {
		return { ok: false, error: 'Booking not found.' }
	}

	if (booking.price_usd === null) {
		return {
			ok: false,
			error: 'Set a project price before recording payments.',
		}
	}

	const { error } = await supabase
		.from('booking_payments')
		.insert({
			booking_id: parsed.data.bookingId,
			amount_usd: parsed.data.amountUsd,
			note: parsed.data.note === ''
				? null
				: parsed.data.note ?? null,
			created_by: profile.authUserId,
		})

	if (error) {
		return { ok: false, error: error.message }
	}

	return { ok: true }
}
