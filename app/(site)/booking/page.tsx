import { BookNowSection } from '@/components/book-now-section'
import { BookingHero } from '@/components/booking-hero'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import { getBookingServices } from '@/lib/bookings/get-booking-services'

export const metadata = {
	title: 'Booking',
	description:
		'Tell NEXTSITE about your website project and send a booking request.',
	openGraph: {
		title: 'Booking · NEXTSITE',
		description:
			'Tell NEXTSITE about your website project and send a booking request.',
	},
}

interface BookingPageProps {
	searchParams: Promise<{ service?: string | string[] }>
}

export default async function BookingPage ({
	searchParams,
}: BookingPageProps) {
	const params = await searchParams
	const requested = Array.isArray(params.service)
		? params.service[0]
		: params.service
	const profile = await getCurrentProfile()
	const returnPath = requested
		? '/booking?service=' + encodeURIComponent(requested)
		: '/booking'
	const services = await getBookingServices()
	const match = services.find((service) => service.slug === requested)

	return (
		<>
			<BookingHero />
			<BookNowSection
				services={services}
				initialServiceId={match?.serviceId ?? ''}
				isSignedIn={profile !== null}
				returnPath={returnPath}
			/>
		</>
	)
}
