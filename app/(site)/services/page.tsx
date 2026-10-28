import { ServicesSection } from '@/components/services-section'

export const metadata = {
	title: 'Services',
	description:
		'Landing pages, static websites, and personal websites from NEXTSITE.',
	openGraph: {
		title: 'Services · NEXTSITE',
		description:
			'Landing pages, static websites, and personal websites from NEXTSITE.',
	},
}

export default function ServicesPage () {
	return <ServicesSection />
}
