import { BookingCta } from '@/components/booking-cta'
import { HomeScrollScene } from '@/components/home-scroll-scene'
import { HomeHero } from '@/components/home-hero'
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
			<HomeScrollScene />
			<div id="home-journey" className="relative z-10">
				<HomeHero />
				<ServicesSection />
				<WhyChooseUs />
				<BookingCta />
			</div>
		</>
	)
}
