import { AdminNotificationsPanel } from '@/components/admin/admin-notifications-panel'
import { listBookingEditNotifications } from '@/lib/bookings/offline-notifications'

export const metadata = {
	title: 'Notifications',
}

export default async function AdminNotificationsPage () {
	const notifications = await listBookingEditNotifications()

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
					Notifications
				</h1>
				<p className="mt-1 text-sm text-white/50">
					Every client booking edit appears here so you can review the
					updated submission copy.
				</p>
			</div>
			<AdminNotificationsPanel notifications={notifications} />
		</div>
	)
}
