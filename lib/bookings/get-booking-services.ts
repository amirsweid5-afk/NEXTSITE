import 'server-only'
import { connection } from 'next/server'
import { type BookingServiceOption } from '@/lib/bookings/booking-schema'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Loads catalog services for the booking form.
 */
export async function getBookingServices ():
	Promise<BookingServiceOption[]> {
	await connection()

	const supabase = createAdminClient()
	const { data, error } = await supabase
		.from('services')
		.select('service_id, name, price')
		.order('price', { ascending: true })

	if (error) {
		throw new Error(error.message)
	}

	return (data ?? []).map((service) => ({
		serviceId: service.service_id,
		name: service.name,
		price: Number(service.price),
	}))
}
