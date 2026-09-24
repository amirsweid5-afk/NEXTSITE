import { type AdminBookingCard } from '@/lib/bookings/admin-dashboard-types'

export interface AdminClientRow {
	userId: string
	fullName: string
	email: string
	phone: string | null
	bookingCount: number
	totalPaid: number
	latestBookingAt: string
	bookings: AdminBookingCard[]
}

export interface AdminAnalyticsData {
	bookingsByMonth: {
		key: string
		label: string
		amount: number
	}[]
	servicePopularity: { name: string; count: number }[]
	revenueByService: {
		serviceName: string
		amount: number
	}[]
	monthlyRevenue: {
		key: string
		label: string
		amount: number
	}[]
	statusCounts: Record<string, number>
}
