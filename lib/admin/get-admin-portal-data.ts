import 'server-only'

import { getAdminRevenueDashboard } from '@/lib/bookings/get-admin-bookings'
import {
	type AdminBookingCard,
	type AdminRevenueSummary,
	type MonthlyRevenuePoint,
} from '@/lib/bookings/admin-dashboard-types'
import {
	type AdminAnalyticsData,
	type AdminClientRow,
} from '@/lib/admin/admin-portal-types'

export type {
	AdminAnalyticsData,
	AdminClientRow,
} from '@/lib/admin/admin-portal-types'

export interface AdminPortalData {
	bookings: AdminBookingCard[]
	summary: AdminRevenueSummary
	clients: AdminClientRow[]
	projects: AdminBookingCard[]
	analytics: AdminAnalyticsData
}

/**
 * Aggregates portal data from bookings and payments.
 */
export async function getAdminPortalData (): Promise<AdminPortalData> {
	const { bookings, summary } = await getAdminRevenueDashboard()
	const clients = buildClients(bookings)
	const projects = bookings.filter((booking) => {
		return booking.status === 'confirmed'
			|| booking.status === 'completed'
	})
	const analytics = buildAnalytics(bookings, summary)

	return {
		bookings,
		summary,
		clients,
		projects,
		analytics,
	}
}

function buildClients (
	bookings: AdminBookingCard[],
): AdminClientRow[] {
	const map = new Map<string, AdminClientRow>()

	for (const booking of bookings) {
		const key = booking.email.toLowerCase()
		const existing = map.get(key)

		if (!existing) {
			map.set(key, {
				userId: key,
				fullName: booking.fullName,
				email: booking.email,
				phone: booking.phone,
				bookingCount: 1,
				totalPaid: booking.amountPaid,
				latestBookingAt: booking.createdAt,
				bookings: [booking],
			})
			continue
		}

		existing.bookingCount += 1
		existing.totalPaid += booking.amountPaid
		existing.bookings.push(booking)

		if (booking.createdAt > existing.latestBookingAt) {
			existing.latestBookingAt = booking.createdAt
			existing.fullName = booking.fullName
			existing.phone = booking.phone
		}
	}

	return [...map.values()].sort((left, right) => {
		return right.latestBookingAt.localeCompare(left.latestBookingAt)
	})
}

function buildAnalytics (
	bookings: AdminBookingCard[],
	summary: AdminRevenueSummary,
): AdminAnalyticsData {
	const byMonth = new Map<string, number>()
	const serviceCounts = new Map<string, number>()
	const statusCounts: Record<string, number> = {
		pending: 0,
		confirmed: 0,
		cancelled: 0,
		completed: 0,
	}

	for (const booking of bookings) {
		statusCounts[booking.status] =
			(statusCounts[booking.status] ?? 0) + 1

		serviceCounts.set(
			booking.serviceName,
			(serviceCounts.get(booking.serviceName) ?? 0) + 1,
		)

		const date = new Date(booking.createdAt)
		const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
		byMonth.set(key, (byMonth.get(key) ?? 0) + 1)
	}

	const now = new Date()
	const bookingsByMonth: MonthlyRevenuePoint[] = []

	for (let offset = 11; offset >= 0; offset -= 1) {
		const date = new Date(
			Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1),
		)
		const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
		const label = new Intl.DateTimeFormat('en-US', {
			month: 'short',
			timeZone: 'UTC',
		}).format(date)

		bookingsByMonth.push({
			key,
			label,
			amount: byMonth.get(key) ?? 0,
		})
	}

	const servicePopularity = [...serviceCounts.entries()]
		.map(([name, count]) => ({ name, count }))
		.sort((left, right) => right.count - left.count)

	return {
		bookingsByMonth,
		servicePopularity,
		revenueByService: summary.revenueByService,
		monthlyRevenue: summary.monthlyRevenue,
		statusCounts,
	}
}
