import { type PaymentStatus } from '@/lib/supabase/database'

/**
 * Rounds a USD amount to two decimal places.
 */
export function roundUsd (amount: number): number {
	return Math.round((amount + Number.EPSILON) * 100) / 100
}

/**
 * Formats a USD amount for display.
 */
export function formatUsd (amount: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(amount)
}

/**
 * Derives payment status from project price and amount paid.
 */
export function getPaymentStatus (
	priceUsd: number | null,
	amountPaid: number,
): PaymentStatus {
	if (priceUsd === null) return 'unpriced'
	if (amountPaid <= 0) return 'unpaid'
	if (amountPaid + 0.001 >= priceUsd) return 'paid'
	return 'partial'
}

/**
 * Remaining balance for a booking. Zero when unpriced or fully paid.
 */
export function getRemainingBalance (
	priceUsd: number | null,
	amountPaid: number,
): number {
	if (priceUsd === null) return 0
	return roundUsd(Math.max(priceUsd - amountPaid, 0))
}
