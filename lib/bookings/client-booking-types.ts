import {
	type WebsiteProgress,
} from '@/lib/bookings/website-progress'
import { type PaymentStatus } from '@/lib/supabase/database'

export interface ClientBooking {
	bookingId: string
	fullName: string
	email: string
	phone: string
	countryCode: string
	localPhone: string
	serviceId: string
	serviceName: string
	websiteDescription: string
	budget: string
	deadline: string
	status: string
	createdAt: string
	priceUsd: number | null
	amountPaid: number
	remainingBalance: number
	paymentStatus: PaymentStatus
	editCount: number
	wasEdited: boolean
	lastEditedAt: string | null
	websiteProgress: WebsiteProgress
	progressSetByAdmin?: boolean
	progressUpdatedAt?: string | null
	statusUpdatedAt?: string | null
}
