import { HeroSection } from '@/components/hero-section'
import { ServicesSection } from '@/components/services-section'

export const metadata = {
	title: 'Home',
	description:
		'Choose a date and time that works for you and book your appointment in seconds.',
}

export default function HomePage () {
	return (
		<>
			<HeroSection
				eyebrow="Your Time. Your Schedule. Your Booking."
				title="Book Your Appointment Easily"
				description="Choose a date and time that works for you and book your appointment in seconds. No phone tag, no waiting — pick a slot and you are done."
				ctaLabel="Book Now"
				ctaHref="/booking"
				backgroundSrc="/hero-appointment.png"
				backgroundAlt="A quiet reception desk with an appointment book and gold light"
			/>
			<ServicesSection />
		</>
	)
}
