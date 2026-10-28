import { AboutHero } from '@/components/about-hero'
import { HowWeWork } from '@/components/how-we-work'
import { OurMission } from '@/components/our-mission'
import { OurStory } from '@/components/our-story'
import { OurVision } from '@/components/our-vision'

export const metadata = {
	title: 'About Us',
	description:
		'How NEXTSITE plans, designs, and builds a website with you.',
	openGraph: {
		title: 'About Us · NEXTSITE',
		description:
			'How NEXTSITE plans, designs, and builds a website with you.',
	},
}

export default function AboutUsPage () {
	return (
		<>
			<AboutHero />
			<OurStory />
			<OurMission />
			<OurVision />
			<HowWeWork />
		</>
	)
}
