import { BookingCta } from '@/components/booking-cta'
import { HeroSection } from '@/components/hero-section'
import { ServicesSection } from '@/components/services-section'
import { WhyChooseUs } from '@/components/why-choose-us'

export const metadata = {
	title: 'Home',
	description:
		'Modern websites built around your ideas — landing pages, static websites, and personal sites for businesses and professionals.',
}

export default function HomePage () {
	return (
		<>
			<HeroSection
				eyebrow="Modern Websites. Built for You."
				title="Websites Designed Around Your Ideas."
				description="We create landing pages, static websites, and personal sites for businesses and professionals who want a modern, professional presence online."
				ctaLabel="Book Now"
				ctaHref="/booking"
			/>
			<ServicesSection />
			<WhyChooseUs />
			<BookingCta />
		</>
	)
}
