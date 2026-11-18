import { AdminShell } from '@/components/admin/admin-shell'
import { AdminEnglishLock } from '@/components/language-provider'
import { requireAdmin } from '@/lib/admin/require-admin'
import { countUnreadBookingNotifications } from '@/lib/bookings/offline-notifications'

export const metadata = {
	title: 'Admin Portal',
	description: 'NEXTSITE admin portal',
}

export default async function AdminLayout ({
	children,
}: {
	children: React.ReactNode
}) {
	const profile = await requireAdmin()
	const unreadNotifications = await countUnreadBookingNotifications()

	return (
		<AdminEnglishLock>
			<AdminShell
				adminName={profile.name}
				adminEmail={profile.email}
				unreadNotifications={unreadNotifications}
			>
				{children}
			</AdminShell>
		</AdminEnglishLock>
	)
}
