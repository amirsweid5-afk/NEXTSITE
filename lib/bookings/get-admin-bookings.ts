import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { type BookingStatus } from '@/lib/supabase/database'

export interface AdminBookingCard {
	bookingId: string
	fullName: string
	email: string
	phone: string | null
	serviceName: string
	websiteDescription: string
	status: BookingStatus
	createdAt: string
}

/**
 * Loads all booking submissions for the admin dashboard.
 */
export async function getAdminBookings (): Promise<AdminBookingCard[]> {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('bookings')
		.select(`
			booking_id,
			description,
			status,
			created_at,
			users (
				name,
				email,
				phone
			),
			services (
				name
			)
		`)
		.order('created_at', { ascending: false })

	if (error || !data) {
		return []
	}

	return data.flatMap((row) => {
		const user = Array.isArray(row.users)
			? row.users[0]
			: row.users
		const service = Array.isArray(row.services)
			? row.services[0]
			: row.services

		if (!user || !service) {
			return []
		}

		return [{
			bookingId: row.booking_id,
			fullName: user.name,
			email: user.email,
			phone: user.phone,
			serviceName: service.name,
			websiteDescription: row.description ?? '',
			status: row.status,
			createdAt: row.created_at,
		}]
	})
}
