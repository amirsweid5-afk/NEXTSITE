import { HeroSection } from '@/components/hero-section'

export const metadata = {
	title: 'Home',
	description:
		'A calm place to land — explore the story and reserve a visit.',
}

export default function HomePage () {
	return (
		<HeroSection
			eyebrow="01 Stay"
			title="Rooms that hold the quiet between days."
			description="Lumen is a small house for long breakfasts, late light, and unhurried plans. Come as you are; leave with time that feels wider."
			ctaLabel="Reserve a stay"
			ctaHref="/booking"
		/>
	)
}
