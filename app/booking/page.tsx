import { BookNowSection } from '@/components/book-now-section'
import { HeroSection } from '@/components/hero-section'

export const metadata = {
	title: 'Booking',
	description:
		'Book your website project with NEXTSITE.',
}

export default function BookingPage () {
	return (
		<>
			<HeroSection />
			<BookNowSection />
		</>
	)
}
