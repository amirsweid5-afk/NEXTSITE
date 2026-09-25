import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { type IncomeRecord } from '@/lib/admin/income-project-types'

/**
 * Loads all income rows for the admin portal.
 */
export async function getIncomeRecords (): Promise<IncomeRecord[]> {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('income')
		.select('*')
		.order('payment_date', { ascending: false })

	if (error || !data) {
		return []
	}

	return data.map((row) => ({
		incomeId: row.income_id,
		amount: Number(row.amount),
		paymentDate: row.payment_date,
		paymentMethod: row.payment_method,
		paymentCurrency: row.payment_currency,
		status: row.status,
		notes: row.notes,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	}))
}
