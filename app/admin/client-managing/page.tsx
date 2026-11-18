import { AdminClientManagingPanel } from '@/components/admin/admin-client-managing-panel'
import { getAdminBookings } from '@/lib/bookings/get-admin-bookings'

export const metadata = {
	title: 'Client Managing',
}

export default async function AdminClientManagingPage () {
	const bookings = await getAdminBookings()

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
					Client Managing
				</h1>
				<p className="mt-1 text-sm text-white/50">
					Search every website, set Finished / Pending / Didn&apos;t
					start, and see whether a client edited their submission.
				</p>
			</div>
			<AdminClientManagingPanel bookings={bookings} />
		</div>
	)
}
