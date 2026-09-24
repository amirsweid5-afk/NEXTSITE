import { AdminBookingsPanel } from '@/components/admin/admin-bookings-panel'
import { AdminRevenueChart } from '@/components/admin/admin-revenue-chart'
import { AdminStatCard } from '@/components/admin/admin-stat-card'
import { getAdminPortalData } from '@/lib/admin/get-admin-portal-data'
import { formatUsd } from '@/lib/bookings/revenue-math'

export const metadata = {
	title: 'Revenue',
}

export default async function AdminRevenuePage () {
	const data = await getAdminPortalData()

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
					Revenue
				</h1>
				<p className="mt-1 text-sm text-white/50">
					Set prices, record payments, and track money actually received.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-3">
				<AdminStatCard
					label="Total Received"
					value={formatUsd(data.summary.totalRevenue)}
					hint="Sum of recorded payments"
				/>
				<AdminStatCard
					label="This Month"
					value={formatUsd(data.summary.revenueThisMonth)}
				/>
				<AdminStatCard
					label="Outstanding"
					value={formatUsd(data.summary.pendingPayments)}
					accent="orange"
					hint="Unpaid balances are not revenue"
				/>
			</div>

			<section className="rounded-2xl border border-white/10 bg-[var(--admin-surface)] p-5">
				<h2 className="text-sm font-semibold text-white">
					Monthly Revenue Chart
				</h2>
				<div className="mt-4">
					<AdminRevenueChart data={data.summary.monthlyRevenue} />
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-lg font-semibold text-white">
					Prices & Payments
				</h2>
				<AdminBookingsPanel
					bookings={data.bookings}
					showFinance
					showActions
				/>
			</section>
		</div>
	)
}
