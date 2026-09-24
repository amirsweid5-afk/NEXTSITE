import { AdminRevenueChart } from '@/components/admin/admin-revenue-chart'
import { AdminStatCard } from '@/components/admin/admin-stat-card'
import { getAdminPortalData } from '@/lib/admin/get-admin-portal-data'
import { formatUsd } from '@/lib/bookings/revenue-math'

export const metadata = {
	title: 'Analytics',
}

export default async function AdminAnalyticsPage () {
	const data = await getAdminPortalData()
	const { analytics } = data

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
					Analytics
				</h1>
				<p className="mt-1 text-sm text-white/50">
					Booking trends, service popularity, and revenue performance.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<AdminStatCard
					label="Pending"
					value={String(analytics.statusCounts.pending ?? 0)}
					accent="orange"
				/>
				<AdminStatCard
					label="Accepted"
					value={String(analytics.statusCounts.confirmed ?? 0)}
				/>
				<AdminStatCard
					label="Completed"
					value={String(analytics.statusCounts.completed ?? 0)}
					accent="green"
				/>
				<AdminStatCard
					label="Rejected"
					value={String(analytics.statusCounts.cancelled ?? 0)}
					accent="muted"
				/>
			</div>

			<div className="grid gap-4 xl:grid-cols-2">
				<section className="rounded-2xl border border-white/10 bg-[var(--admin-surface)] p-5">
					<h2 className="text-sm font-semibold text-white">
						Booking Trends
					</h2>
					<p className="mt-1 text-xs text-white/45">
						New bookings by month
					</p>
					<div className="mt-4">
						<AdminRevenueChart
							data={analytics.bookingsByMonth}
							valueLabel="Bookings"
							formatAsCurrency={false}
						/>
					</div>
				</section>

				<section className="rounded-2xl border border-white/10 bg-[var(--admin-surface)] p-5">
					<h2 className="text-sm font-semibold text-white">
						Revenue Trends
					</h2>
					<p className="mt-1 text-xs text-white/45">
						Payments received by month
					</p>
					<div className="mt-4">
						<AdminRevenueChart data={analytics.monthlyRevenue} />
					</div>
				</section>
			</div>

			<div className="grid gap-4 xl:grid-cols-2">
				<section className="rounded-2xl border border-white/10 bg-[var(--admin-surface)] p-5">
					<h2 className="text-sm font-semibold text-white">
						Service Popularity
					</h2>
					{analytics.servicePopularity.length === 0 ? (
						<p className="mt-8 text-sm text-white/45">
							No bookings yet.
						</p>
					) : (
						<ul className="mt-5 space-y-3">
							{analytics.servicePopularity.map((item) => (
								<li
									key={item.name}
									className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-b-0"
								>
									<span className="text-sm text-white/75">
										{item.name}
									</span>
									<span className="text-sm font-semibold text-violet-600 dark:text-violet-200">
										{item.count}
									</span>
								</li>
							))}
						</ul>
					)}
				</section>

				<section className="rounded-2xl border border-white/10 bg-[var(--admin-surface)] p-5">
					<h2 className="text-sm font-semibold text-white">
						Revenue by Service
					</h2>
					{analytics.revenueByService.length === 0 ? (
						<p className="mt-8 text-sm text-white/45">
							No payments recorded yet.
						</p>
					) : (
						<ul className="mt-5 space-y-3">
							{analytics.revenueByService.map((item) => (
								<li
									key={item.serviceName}
									className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-b-0"
								>
									<span className="text-sm text-white/75">
										{item.serviceName}
									</span>
									<span className="text-sm font-semibold text-violet-600 dark:text-violet-200">
										{formatUsd(item.amount)}
									</span>
								</li>
							))}
						</ul>
					)}
				</section>
			</div>
		</div>
	)
}
