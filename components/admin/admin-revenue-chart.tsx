'use client'

import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { type MonthlyRevenuePoint } from '@/lib/bookings/admin-dashboard-types'
import { formatUsd } from '@/lib/bookings/revenue-math'

interface AdminRevenueChartProps {
	data: MonthlyRevenuePoint[]
	valueLabel?: string
	formatAsCurrency?: boolean
}

/**
 * Interactive monthly bar chart for the admin portal.
 */
export function AdminRevenueChart ({
	data,
	valueLabel = 'Revenue',
	formatAsCurrency = true,
}: AdminRevenueChartProps) {
	const chartData = data.map((point) => ({
		label: point.label,
		value: point.amount,
	}))

	return (
		<div className="h-72 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={chartData}>
					<CartesianGrid
						stroke="var(--admin-chart-grid)"
						vertical={false}
					/>
					<XAxis
						dataKey="label"
						tick={{ fill: 'var(--admin-chart-tick)', fontSize: 12 }}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						tick={{ fill: 'var(--admin-chart-tick)', fontSize: 12 }}
						axisLine={false}
						tickLine={false}
						tickFormatter={(value: number) => {
							return formatAsCurrency
								? `$${value}`
								: String(value)
						}}
					/>
					<Tooltip
						cursor={{ fill: 'var(--admin-chart-cursor)' }}
						contentStyle={{
							background: 'var(--admin-chart-tooltip-bg)',
							border: '1px solid var(--admin-chart-tooltip-border)',
							borderRadius: '12px',
							color: 'var(--admin-chart-tooltip-fg)',
						}}
						formatter={(value) => {
							const amount = typeof value === 'number'
								? value
								: Number(value ?? 0)
							return [
								formatAsCurrency
									? formatUsd(amount)
									: String(amount),
								valueLabel,
							]
						}}
					/>
					<Bar
						dataKey="value"
						fill="#8b5cf6"
						radius={[8, 8, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}
