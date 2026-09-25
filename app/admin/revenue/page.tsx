import { AdminIncomePanel } from '@/components/admin/admin-income-panel'
import { AdminStatCard } from '@/components/admin/admin-stat-card'
import { getIncomeRecords } from '@/lib/admin/get-income'
import { formatUsd } from '@/lib/bookings/revenue-math'

export const metadata = {
	title: 'Revenue',
}

export default async function AdminRevenuePage () {
	const records = await getIncomeRecords()
	const completed = records.filter((record) => {
		return record.status === 'completed'
	})
	const totalReceived = completed.reduce((sum, record) => {
		return sum + record.amount
	}, 0)
	const now = new Date()
	const monthKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
	const thisMonth = completed
		.filter((record) => record.paymentDate.startsWith(monthKey))
		.reduce((sum, record) => sum + record.amount, 0)
	const pending = records
		.filter((record) => record.status === 'pending')
		.reduce((sum, record) => sum + record.amount, 0)

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
					Revenue
				</h1>
				<p className="mt-1 text-sm text-white/50">
					Create, edit, and delete income records from the income table.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-3">
				<AdminStatCard
					label="Total Received"
					value={formatUsd(totalReceived)}
					hint="Completed income only"
				/>
				<AdminStatCard
					label="This Month"
					value={formatUsd(thisMonth)}
				/>
				<AdminStatCard
					label="Pending Income"
					value={formatUsd(pending)}
					accent="orange"
				/>
			</div>

			<section>
				<h2 className="mb-4 text-lg font-semibold text-white">
					Income records
				</h2>
				<AdminIncomePanel records={records} />
			</section>
		</div>
	)
}
