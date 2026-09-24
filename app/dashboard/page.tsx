import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin-dashboard'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import { getAdminBookings } from '@/lib/bookings/get-admin-bookings'

export const metadata = {
	title: 'Dashboard',
	description: 'Admin booking submissions for NEXTSITE.',
}

export default async function DashboardPage () {
	const profile = await getCurrentProfile()

	if (!profile) {
		redirect('/login')
	}

	if (!profile.isAdmin) {
		redirect('/')
	}

	const bookings = await getAdminBookings()

	return <AdminDashboard bookings={bookings} />
}
