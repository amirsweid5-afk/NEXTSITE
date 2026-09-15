import { BookNowSection } from '@/components/book-now-section'
import { BookingHero } from '@/components/booking-hero'

export const metadata = {
	title: 'Booking',
	description:
		'Book your website project with NEXTSITE.',
}

export default function BookingPage () {
	return (
		<>
			<BookingHero />
			<BookNowSection />
		</>
	)
}
