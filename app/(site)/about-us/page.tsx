import { AboutHero } from '@/components/about-hero'
import { AboutScrollScene } from '@/components/about-scroll-scene'
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
			<AboutScrollScene />
			<div id="about-journey" className="relative z-10">
				<AboutHero />
				<OurStory />
				<OurMission />
				<OurVision />
			</div>
		</>
	)
}
