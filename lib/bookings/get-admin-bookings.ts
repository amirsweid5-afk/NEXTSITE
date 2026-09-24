import 'server-only'

import {
	getPaymentStatus,
	getRemainingBalance,
	roundUsd,
} from '@/lib/bookings/revenue-math'
import {
	type AdminBookingCard,
	type AdminBookingPayment,
	type AdminRevenueDashboardData,
	type AdminRevenueSummary,
	type MonthlyRevenuePoint,
} from '@/lib/bookings/admin-dashboard-types'
import { createClient } from '@/lib/supabase/server'

export type {
	AdminBookingCard,
	AdminBookingPayment,
	AdminRevenueDashboardData,
	AdminRevenueSummary,
	MonthlyRevenuePoint,
	ServiceRevenuePoint,
} from '@/lib/bookings/admin-dashboard-types'

interface PaymentRow {
	payment_id: string
	amount_usd: number | string
	paid_at: string
	note: string | null
}

/**
 * Loads admin bookings with payments and computed revenue metrics.
 * Revenue totals use recorded payments only — never unpaid balances.
 */
export async function getAdminRevenueDashboard ():
	Promise<AdminRevenueDashboardData> {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('bookings')
		.select(`
			booking_id,
			description,
			status,
			created_at,
			price_usd,
			users (
				name,
				email,
				phone
			),
			services (
				name
			),
			booking_payments (
				payment_id,
				amount_usd,
				paid_at,
				note
			)
		`)
		.order('created_at', { ascending: false })

	if (error || !data) {
		return {
			bookings: [],
			summary: {
				totalRevenue: 0,
				revenueThisMonth: 0,
				pendingPayments: 0,
				revenueByService: [],
				monthlyRevenue: buildEmptyMonthlySeries(),
			},
		}
	}

	const bookings: AdminBookingCard[] = data.flatMap((row) => {
		const user = Array.isArray(row.users) ? row.users[0] : row.users
		const service = Array.isArray(row.services)
			? row.services[0]
			: row.services

		if (!user || !service) {
			return []
		}

		const paymentRows = normalizePayments(row.booking_payments)
		const amountPaid = roundUsd(
			paymentRows.reduce((sum, payment) => {
				return sum + payment.amountUsd
			}, 0),
		)
		const priceUsd = row.price_usd === null
			? null
			: Number(row.price_usd)

		return [{
			bookingId: row.booking_id,
			fullName: user.name,
			email: user.email,
			phone: user.phone,
			serviceName: service.name,
			websiteDescription: row.description ?? '',
			status: row.status,
			createdAt: row.created_at,
			priceUsd,
			amountPaid,
			remainingBalance: getRemainingBalance(priceUsd, amountPaid),
			paymentStatus: getPaymentStatus(priceUsd, amountPaid),
			payments: paymentRows,
		}]
	})

	return {
		bookings,
		summary: buildRevenueSummary(bookings),
	}
}

/**
 * Loads admin booking cards only.
 */
export async function getAdminBookings (): Promise<AdminBookingCard[]> {
	const data = await getAdminRevenueDashboard()
	return data.bookings
}

function normalizePayments (
	value: unknown,
): AdminBookingPayment[] {
	if (!Array.isArray(value)) return []

	return (value as PaymentRow[])
		.map((payment) => ({
			paymentId: payment.payment_id,
			amountUsd: Number(payment.amount_usd),
			paidAt: payment.paid_at,
			note: payment.note,
		}))
		.sort((left, right) => {
			return right.paidAt.localeCompare(left.paidAt)
		})
}

function buildRevenueSummary (
	bookings: AdminBookingCard[],
): AdminRevenueSummary {
	const now = new Date()
	const monthKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`

	let totalRevenue = 0
	let revenueThisMonth = 0
	let pendingPayments = 0
	const byService = new Map<string, number>()
	const byMonth = new Map<string, number>()

	for (const booking of bookings) {
		pendingPayments = roundUsd(
			pendingPayments + booking.remainingBalance,
		)

		for (const payment of booking.payments) {
			totalRevenue = roundUsd(totalRevenue + payment.amountUsd)

			const paidDate = new Date(payment.paidAt)
			const key = `${paidDate.getUTCFullYear()}-${String(paidDate.getUTCMonth() + 1).padStart(2, '0')}`

			if (key === monthKey) {
				revenueThisMonth = roundUsd(
					revenueThisMonth + payment.amountUsd,
				)
			}

			byMonth.set(
				key,
				roundUsd((byMonth.get(key) ?? 0) + payment.amountUsd),
			)
			byService.set(
				booking.serviceName,
				roundUsd(
					(byService.get(booking.serviceName) ?? 0)
						+ payment.amountUsd,
				),
			)
		}
	}

	const revenueByService = [...byService.entries()]
		.map(([serviceName, amount]) => ({ serviceName, amount }))
		.sort((left, right) => right.amount - left.amount)

	return {
		totalRevenue,
		revenueThisMonth,
		pendingPayments,
		revenueByService,
		monthlyRevenue: buildMonthlySeries(byMonth, now),
	}
}

function buildEmptyMonthlySeries (): MonthlyRevenuePoint[] {
	return buildMonthlySeries(new Map(), new Date())
}

function buildMonthlySeries (
	byMonth: Map<string, number>,
	now: Date,
): MonthlyRevenuePoint[] {
	const points: MonthlyRevenuePoint[] = []

	for (let offset = 11; offset >= 0; offset -= 1) {
		const date = new Date(
			Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1),
		)
		const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
		const label = new Intl.DateTimeFormat('en-US', {
			month: 'short',
			timeZone: 'UTC',
		}).format(date)

		points.push({
			key,
			label,
			amount: byMonth.get(key) ?? 0,
		})
	}

	return points
}
