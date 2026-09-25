'use server'

import { z } from 'zod'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import { createClient } from '@/lib/supabase/server'

export interface AdminMutationResult {
	ok: boolean
	error?: string
}

const incomeSchema = z.object({
	amount: z.number().finite().positive().max(10_000_000),
	paymentDate: z.string().trim().min(1),
	paymentMethod: z.enum([
		'cash',
		'card',
		'bank_transfer',
		'paypal',
		'other',
	]),
	paymentCurrency: z
		.string()
		.trim()
		.toUpperCase()
		.length(3),
	status: z.enum([
		'pending',
		'completed',
		'failed',
		'refunded',
	]),
	notes: z.string().trim().max(2000).optional(),
})

const updateIncomeSchema = incomeSchema.extend({
	incomeId: z.uuid(),
})

async function requireAdminProfile () {
	const profile = await getCurrentProfile()
	if (!profile?.isAdmin) {
		return null
	}
	return profile
}

/**
 * Creates an income record. Admin only.
 */
export async function createIncome (
	input: unknown,
): Promise<AdminMutationResult> {
	const parsed = incomeSchema.safeParse(input)
	if (!parsed.success) {
		return { ok: false, error: 'Please check the income form.' }
	}

	if (!(await requireAdminProfile())) {
		return { ok: false, error: 'Only admins can create income.' }
	}

	const supabase = await createClient()
	const { error } = await supabase.from('income').insert({
		amount: parsed.data.amount,
		payment_date: parsed.data.paymentDate,
		payment_method: parsed.data.paymentMethod,
		payment_currency: parsed.data.paymentCurrency,
		status: parsed.data.status,
		notes: parsed.data.notes === ''
			? null
			: parsed.data.notes ?? null,
	})

	if (error) {
		return { ok: false, error: error.message }
	}

	return { ok: true }
}

/**
 * Updates an income record. Admin only.
 */
export async function updateIncome (
	input: unknown,
): Promise<AdminMutationResult> {
	const parsed = updateIncomeSchema.safeParse(input)
	if (!parsed.success) {
		return { ok: false, error: 'Please check the income form.' }
	}

	if (!(await requireAdminProfile())) {
		return { ok: false, error: 'Only admins can update income.' }
	}

	const supabase = await createClient()
	const { error } = await supabase
		.from('income')
		.update({
			amount: parsed.data.amount,
			payment_date: parsed.data.paymentDate,
			payment_method: parsed.data.paymentMethod,
			payment_currency: parsed.data.paymentCurrency,
			status: parsed.data.status,
			notes: parsed.data.notes === ''
				? null
				: parsed.data.notes ?? null,
		})
		.eq('income_id', parsed.data.incomeId)

	if (error) {
		return { ok: false, error: error.message }
	}

	return { ok: true }
}

/**
 * Deletes an income record. Admin only.
 */
export async function deleteIncome (
	incomeId: string,
): Promise<AdminMutationResult> {
	if (typeof incomeId !== 'string' || incomeId.trim() === '') {
		return { ok: false, error: 'Invalid income id.' }
	}

	if (!(await requireAdminProfile())) {
		return { ok: false, error: 'Only admins can delete income.' }
	}

	const supabase = await createClient()
	const { error } = await supabase
		.from('income')
		.delete()
		.eq('income_id', incomeId)

	if (error) {
		return { ok: false, error: error.message }
	}

	return { ok: true }
}
