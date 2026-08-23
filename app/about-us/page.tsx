import { HeroSection } from '@/components/hero-section'

export const metadata = {
	title: 'About Us',
	description:
		'The people and craft behind Lumen — a house built for slower hours.',
}

export default function AboutUsPage () {
	return (
		<HeroSection
			eyebrow="02 Story"
			title="A house shaped by hands, not a template."
			description="We restore old rooms, cook with neighbors, and keep the door easy to find. About us is really about the table you sit at when you arrive."
			ctaLabel="Plan a visit"
			ctaHref="/booking"
		/>
	)
}
