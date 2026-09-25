import { AiTypingClip } from '@/components/ai-typing-clip'
import { BookingCta } from '@/components/booking-cta'
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
			<AiTypingClip />
			<div className="relative z-10">
				<HomeHero />
				<ServicesSection />
				<WhyChooseUs />
				<BookingCta />
			</div>
		</>
	)
}
