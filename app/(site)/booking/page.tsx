import { BookNowSection } from '@/components/book-now-section'
import { BookingHero } from '@/components/booking-hero'
import { BookingScrollScene } from '@/components/booking-scroll-scene'
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
			<BookingScrollScene />
			<div id="booking-journey" className="relative z-10">
				<BookingHero />
				<BookNowSection services={services} />
			</div>
		</>
	)
}
