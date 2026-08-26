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
			<HeroSection
				eyebrow="03 Book"
				title="Ready to start your website?"
				description="Share your project details below and reach us directly on WhatsApp. We will review your request and get back to you to discuss the next steps."
			/>
			<BookNowSection />
		</>
	)
}
