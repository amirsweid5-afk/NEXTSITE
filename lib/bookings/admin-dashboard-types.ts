import {
	type WebsiteProgress,
} from '@/lib/bookings/website-progress'
import {
	type BookingStatus,
	type PaymentStatus,
} from '@/lib/supabase/database'

export interface AdminBookingPayment {
	paymentId: string
	amountUsd: number
	paidAt: string
	note: string | null
}

export interface AdminBookingCard {
	bookingId: string
	fullName: string
	email: string
	phone: string | null
	serviceName: string
	websiteDescription: string
	budget?: string
	deadline?: string
	status: BookingStatus
	createdAt: string
	priceUsd: number | null
	amountPaid: number
	remainingBalance: number
	paymentStatus: PaymentStatus
	payments: AdminBookingPayment[]
	editCount?: number
	wasEdited?: boolean
	lastEditedAt?: string | null
	websiteProgress?: WebsiteProgress
	statusUpdatedAt?: string | null
}

export interface MonthlyRevenuePoint {
	key: string
	label: string
	amount: number
}

export interface ServiceRevenuePoint {
	serviceName: string
	amount: number
}

export interface AdminRevenueSummary {
	totalRevenue: number
	revenueThisMonth: number
	pendingPayments: number
	revenueByService: ServiceRevenuePoint[]
	monthlyRevenue: MonthlyRevenuePoint[]
}

export interface AdminRevenueDashboardData {
	bookings: AdminBookingCard[]
	summary: AdminRevenueSummary
}
