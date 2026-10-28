import { BookingCta } from '@/components/booking-cta'
import { HomeHero } from '@/components/home-hero'
import { PortfolioSection } from '@/components/portfolio-section'
import { WhyChooseUs } from '@/components/why-choose-us'

export const metadata = {
	title: 'Home',
	description:
		'Build a stunning digital presence with modern, responsive websites designed around your goals.',
	openGraph: {
		title: 'NEXTSITE',
		description:
			'Build a stunning digital presence with modern, responsive websites designed around your goals.',
	},
}

export default function HomePage () {
	return (
		<>
			<HomeHero />
			<WhyChooseUs />
			<PortfolioSection />
			<BookingCta />
		</>
	)
}
