import { AdminProjectPanel } from '@/components/admin/admin-project-panel'
import { AdminStatCard } from '@/components/admin/admin-stat-card'
import { getProjectRecords } from '@/lib/admin/get-projects'

export const metadata = {
	title: 'Projects',
}

export default async function AdminProjectsPage () {
	const records = await getProjectRecords()
	const inProgress = records.filter((record) => {
		return record.status === 'in_progress'
	}).length
	const completed = records.filter((record) => {
		return record.status === 'completed'
	}).length

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
					Projects
				</h1>
				<p className="mt-1 text-sm text-white/50">
					Create, edit, and delete projects from the project table.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-3">
				<AdminStatCard
					label="In Progress"
					value={String(inProgress)}
				/>
				<AdminStatCard
					label="Completed"
					value={String(completed)}
					accent="green"
				/>
				<AdminStatCard
					label="Total Projects"
					value={String(records.length)}
				/>
			</div>

			<AdminProjectPanel records={records} />
		</div>
	)
}
