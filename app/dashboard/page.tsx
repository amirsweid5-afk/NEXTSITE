import { ClientDashboardPanel } from '@/components/dashboard/client-dashboard-panel'
import { requireSignedIn } from '@/lib/auth/require-signed-in'
import { getBookingServices } from '@/lib/bookings/get-booking-services'
import { getMyBookings } from '@/lib/bookings/get-my-bookings'

export const dynamic = 'force-dynamic'

export default async function ClientDashboardPage () {
	const profile = await requireSignedIn('/dashboard')
	const [bookings, services] = await Promise.all([
		getMyBookings(),
		getBookingServices(),
	])

	return (
		<ClientDashboardPanel
			bookings={bookings}
			services={services}
			clientName={profile.name}
			accountEmail={profile.email}
		/>
	)
}
