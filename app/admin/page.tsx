import { AdminBookingsPanel } from '@/components/admin/admin-bookings-panel'
import { AdminRevenueChart } from '@/components/admin/admin-revenue-chart'
import { AdminStatCard } from '@/components/admin/admin-stat-card'
import { getAdminPortalData } from '@/lib/admin/get-admin-portal-data'
import { formatUsd } from '@/lib/bookings/revenue-math'

export const metadata = {
	title: 'Dashboard',
}

export default async function AdminDashboardPage () {
	const data = await getAdminPortalData()
	const pendingCount = data.bookings.filter((booking) => {
		return booking.status === 'pending'
	}).length
	const recent = data.bookings.slice(0, 6)

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
					Dashboard
				</h1>
				<p className="mt-1 text-sm text-white/50">
					Overview of bookings, revenue, and recent activity.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<AdminStatCard
					label="Total Bookings"
					value={String(data.bookings.length)}
				/>
				<AdminStatCard
					label="Pending Bookings"
					value={String(pendingCount)}
					accent="orange"
				/>
				<AdminStatCard
					label="Revenue Received"
					value={formatUsd(data.summary.totalRevenue)}
				/>
				<AdminStatCard
					label="Pending Payments"
					value={formatUsd(data.summary.pendingPayments)}
					accent="orange"
					hint="Outstanding balances only"
				/>
			</div>

			<div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
				<section className="rounded-2xl border border-white/10 bg-[var(--admin-surface)] p-5">
					<h2 className="text-sm font-semibold text-white">
						Monthly Revenue
					</h2>
					<p className="mt-1 text-xs text-white/45">
						Based on recorded payments only
					</p>
					<div className="mt-4">
						<AdminRevenueChart data={data.summary.monthlyRevenue} />
					</div>
				</section>

				<section className="rounded-2xl border border-white/10 bg-[var(--admin-surface)] p-5">
					<h2 className="text-sm font-semibold text-white">
						Revenue by Service
					</h2>
					{data.summary.revenueByService.length === 0 ? (
						<p className="mt-8 text-sm text-white/45">
							No payments recorded yet.
						</p>
					) : (
						<ul className="mt-5 space-y-3">
							{data.summary.revenueByService.map((item) => (
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

			<section>
				<h2 className="mb-4 text-lg font-semibold text-white">
					Recent Activity
				</h2>
				<AdminBookingsPanel
					bookings={recent}
					showFinance
					showActions
					pageSize={6}
				/>
			</section>
		</div>
	)
}
