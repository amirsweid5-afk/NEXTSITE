import 'server-only'
import { connection } from 'next/server'
import { type BookingServiceOption } from '@/lib/bookings/booking-schema'
import {
	isOfflineClientError,
	SERVICE_CATALOG,
} from '@/lib/bookings/service-catalog'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Loads catalog services for the booking form.
 */
export async function getBookingServices ():
	Promise<BookingServiceOption[]> {
	await connection()

	try {
		const supabase = createAdminClient()
		const query = supabase
			.from('services')
			.select('service_id, name, price')
			.order('price', { ascending: true })
		const pending = Promise.resolve(query)
		void pending.catch(() => undefined)
		let timer: ReturnType<typeof setTimeout> | undefined
		const timeout = new Promise<never>((_, reject) => {
			timer = setTimeout(() => reject(new Error('timeout')), 4000)
		})
		const { data, error } = await Promise.race([pending, timeout])
		if (timer) clearTimeout(timer)

		if (error && isOfflineClientError(error)) {
			return SERVICE_CATALOG
		}

		if (error || !data) return []

		return data.map((service) => ({
			serviceId: service.service_id,
			name: service.name,
			price: Number(service.price),
		}))
	} catch {
		return SERVICE_CATALOG
	}
}
