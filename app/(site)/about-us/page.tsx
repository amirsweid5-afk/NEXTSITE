import { AboutHero } from '@/components/about-hero'
import { OurMission } from '@/components/our-mission'
import { OurStory } from '@/components/our-story'
import { OurVision } from '@/components/our-vision'

export const metadata = {
	title: 'About Us',
	description:
		'We craft modern, fast, high-quality websites for businesses that want a premium digital presence.',
}

export default function AboutUsPage () {
	return (
		<>
			<AboutHero />
			<OurStory />
			<OurMission />
			<OurVision />
		</>
	)
}
