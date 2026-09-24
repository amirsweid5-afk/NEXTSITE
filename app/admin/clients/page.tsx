import { AdminClientsPanel } from '@/components/admin/admin-clients-panel'
import { getAdminPortalData } from '@/lib/admin/get-admin-portal-data'

export const metadata = {
	title: 'Clients',
}

export default async function AdminClientsPage () {
	const data = await getAdminPortalData()

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
					Clients
				</h1>
				<p className="mt-1 text-sm text-white/50">
					Customer profiles and booking history from live submissions.
				</p>
			</div>
			<AdminClientsPanel clients={data.clients} />
		</div>
	)
}
