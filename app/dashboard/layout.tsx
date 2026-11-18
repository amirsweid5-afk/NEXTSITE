import { ClientDashboardShell } from '@/components/dashboard/client-dashboard-shell'
import { requireSignedIn } from '@/lib/auth/require-signed-in'

export const metadata = {
	title: 'Dashboard',
	description: 'Your NEXTSITE bookings, payments, and website progress.',
}

export default async function DashboardLayout ({
	children,
}: {
	children: React.ReactNode
}) {
	const profile = await requireSignedIn('/dashboard')

	return (
		<ClientDashboardShell clientName={profile.name}>
			{children}
		</ClientDashboardShell>
	)
}
