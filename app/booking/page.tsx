import { HeroSection } from '@/components/hero-section'

export const metadata = {
	title: 'Booking',
	description:
		'Reserve a room, a table, or an afternoon at Lumen.',
}

export default function BookingPage () {
	return (
		<HeroSection
			eyebrow="03 Book"
			title="Choose a date. We will keep a place for you."
			description="Tell us when you would like to arrive. This page is the start of a booking — no forms yet, just a clear next step when you are ready."
			ctaLabel="Back to home"
			ctaHref="/"
		/>
	)
}
