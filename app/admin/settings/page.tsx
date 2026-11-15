import { AdminStatCard } from '@/components/admin/admin-stat-card'
import { getAdminPortalData } from '@/lib/admin/get-admin-portal-data'
import { getProjectRecords } from '@/lib/admin/get-projects'
import { requireAdmin } from '@/lib/admin/require-admin'

export const metadata = {
	title: 'Settings',
}

export default async function AdminSettingsPage () {
	const profile = await requireAdmin()
	const [portal, projects] = await Promise.all([
		getAdminPortalData(),
		getProjectRecords(),
	])

	const websitesMade = projects.filter((project) => {
		return project.status === 'completed'
	}).length
	const activeProjects = projects.filter((project) => {
		return project.status === 'in_progress'
	}).length
	const plannedProjects = projects.filter((project) => {
		return project.status === 'planned'
	}).length
	const pendingBookings = portal.analytics.statusCounts.pending ?? 0
	const activeBookings = portal.analytics.statusCounts.confirmed ?? 0
	const completedBookings = portal.analytics.statusCounts.completed ?? 0

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
					Settings
				</h1>
				<p className="mt-1 text-sm text-white/50">
					Admin profile and your work stats.
				</p>
			</div>

			<section className="site-card rounded-2xl border border-white/10 bg-[var(--admin-surface)] p-6">
				<h2 className="text-sm font-semibold text-white">
					Admin Profile
				</h2>
				<dl className="mt-5 grid gap-4 sm:grid-cols-2">
					<div>
						<dt className="text-xs uppercase tracking-[0.14em] text-white/40">
							Name
						</dt>
						<dd className="mt-2 text-sm text-white">
							{profile.name}
						</dd>
					</div>
					<div>
						<dt className="text-xs uppercase tracking-[0.14em] text-white/40">
							Email
						</dt>
						<dd className="mt-2 break-all text-sm text-white">
							{profile.email}
						</dd>
					</div>
					<div>
						<dt className="text-xs uppercase tracking-[0.14em] text-white/40">
							Role
						</dt>
						<dd className="mt-2">
							<span className="inline-flex rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-100">
								{profile.role}
							</span>
						</dd>
					</div>
				</dl>
			</section>

			<section className="space-y-4">
				<div>
					<h2 className="text-sm font-semibold text-white">
						My Stats
					</h2>
					<p className="mt-1 text-xs text-white/45">
						Websites, projects, and booking activity.
					</p>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					<AdminStatCard
						label="Websites Made"
						value={String(websitesMade)}
						accent="green"
						hint="Completed projects"
					/>
					<AdminStatCard
						label="Active Projects"
						value={String(activeProjects)}
						hint="Currently in progress"
					/>
					<AdminStatCard
						label="Planned Projects"
						value={String(plannedProjects)}
						accent="muted"
					/>
					<AdminStatCard
						label="Pending Bookings"
						value={String(pendingBookings)}
						accent="orange"
					/>
					<AdminStatCard
						label="Active Bookings"
						value={String(activeBookings)}
						hint="Confirmed and underway"
					/>
					<AdminStatCard
						label="Completed Bookings"
						value={String(completedBookings)}
						accent="green"
					/>
					<AdminStatCard
						label="Total Clients"
						value={String(portal.clients.length)}
					/>
					<AdminStatCard
						label="Total Projects"
						value={String(projects.length)}
					/>
					<AdminStatCard
						label="Total Bookings"
						value={String(portal.bookings.length)}
					/>
				</div>
			</section>
		</div>
	)
}
