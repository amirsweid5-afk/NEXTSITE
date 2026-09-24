import { BookNowSection } from '@/components/book-now-section'
import { BookingHero } from '@/components/booking-hero'
import { getBookingServices } from '@/lib/bookings/get-booking-services'

export const metadata = {
	title: 'Booking',
	description:
		'Book your website project with NEXTSITE.',
}

export default async function BookingPage () {
	const services = await getBookingServices()

	return (
		<>
			<BookingHero />
			<BookNowSection services={services} />
		</>
	)
}
