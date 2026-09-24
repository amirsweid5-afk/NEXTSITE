import { AdminShell } from '@/components/admin/admin-shell'
import { requireAdmin } from '@/lib/admin/require-admin'

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

	return (
		<AdminShell
			adminName={profile.name}
			adminEmail={profile.email}
		>
			{children}
		</AdminShell>
	)
}
