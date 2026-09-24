import { AdminBookingsPanel } from '@/components/admin/admin-bookings-panel'
import { AdminStatCard } from '@/components/admin/admin-stat-card'
import { getAdminPortalData } from '@/lib/admin/get-admin-portal-data'

export const metadata = {
	title: 'Projects',
}

export default async function AdminProjectsPage () {
	const data = await getAdminPortalData()
	const inProgress = data.projects.filter((booking) => {
		return booking.status === 'confirmed'
	}).length
	const completed = data.projects.filter((booking) => {
		return booking.status === 'completed'
	}).length

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
					Projects
				</h1>
				<p className="mt-1 text-sm text-white/50">
					Track accepted bookings through delivery and completion.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-3">
				<AdminStatCard
					label="Active Projects"
					value={String(inProgress)}
				/>
				<AdminStatCard
					label="Completed Websites"
					value={String(completed)}
					accent="green"
				/>
				<AdminStatCard
					label="Total Projects"
					value={String(data.projects.length)}
				/>
			</div>

			<AdminBookingsPanel
				bookings={data.projects}
				showFinance
				showActions
			/>
		</div>
	)
}
