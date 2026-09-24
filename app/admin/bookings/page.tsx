import { AdminBookingsPanel } from '@/components/admin/admin-bookings-panel'
import { getAdminPortalData } from '@/lib/admin/get-admin-portal-data'

export const metadata = {
	title: 'Bookings',
}

export default async function AdminBookingsPage () {
	const data = await getAdminPortalData()

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
					Bookings
				</h1>
				<p className="mt-1 text-sm text-white/50">
					Search every customer booking, review details, and accept or reject requests.
				</p>
			</div>
			<AdminBookingsPanel
				bookings={data.bookings}
				showFinance
				showActions
			/>
		</div>
	)
}
