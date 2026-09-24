'use client'

import { useMemo, useState } from 'react'
import { type AdminClientRow } from '@/lib/admin/admin-portal-types'
import { formatUsd } from '@/lib/bookings/revenue-math'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'

interface AdminClientsPanelProps {
	clients: AdminClientRow[]
}

/**
 * Searchable clients list with booking history.
 */
export function AdminClientsPanel ({
	clients,
}: AdminClientsPanelProps) {
	const [query, setQuery] = useState('')
	const [selectedEmail, setSelectedEmail] = useState<string | null>(null)

	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase()
		if (normalized === '') return clients

		return clients.filter((client) => {
			return [
				client.fullName,
				client.email,
				client.phone ?? '',
			].join(' ').toLowerCase().includes(normalized)
		})
	}, [clients, query])

	return (
		<div className="space-y-4">
			<input
				type="search"
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				placeholder="Search clients..."
				className="w-full rounded-xl border border-white/10 bg-[var(--admin-surface)] px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-violet-400/50 focus:outline-none sm:max-w-md"
			/>

			{filtered.length === 0 ? (
				<AdminEmptyState
					title="No clients yet"
					description="Clients appear here after booking submissions."
				/>
			) : (
				<div className="overflow-x-auto rounded-2xl border border-white/10 bg-[var(--admin-surface)]">
					<table className="min-w-full text-start">
						<thead>
							<tr className="border-b border-white/10 text-sm text-white/60">
								<th className="px-4 py-3 font-medium">Client</th>
								<th className="px-4 py-3 font-medium">Bookings</th>
								<th className="px-4 py-3 font-medium">Total Paid</th>
								<th className="px-4 py-3 font-medium">Latest</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((client) => {
								const isOpen = selectedEmail === client.email

								return (
									<tr
										key={client.email}
										className="border-b border-white/10 last:border-b-0"
									>
										<td className="px-4 py-4 align-top">
											<p className="font-medium text-white">
												{client.fullName}
											</p>
											<p className="mt-1 text-xs text-white/45">
												{client.email}
											</p>
											<p className="mt-1 text-xs text-white/45">
												{client.phone ?? 'No phone'}
											</p>
											<button
												type="button"
												onClick={() => {
													setSelectedEmail((current) => {
														return current === client.email
															? null
															: client.email
													})
												}}
												className="mt-2 text-xs font-medium text-violet-300 hover:underline"
											>
												{isOpen ? 'Hide history' : 'View history'}
											</button>
											{isOpen ? (
												<ul className="mt-3 space-y-2 rounded-xl border border-white/10 bg-[var(--admin-inset)] p-3 text-xs text-white/70">
													{client.bookings.map((booking) => (
														<li key={booking.bookingId}>
															{booking.serviceName}
															{' · '}
															{booking.status}
															{' · '}
															{formatUsd(booking.amountPaid)}
														</li>
													))}
												</ul>
											) : null}
										</td>
										<td className="px-4 py-4 align-top text-sm text-white">
											{client.bookingCount}
										</td>
										<td className="px-4 py-4 align-top text-sm text-violet-600 dark:text-violet-200">
											{formatUsd(client.totalPaid)}
										</td>
										<td className="px-4 py-4 align-top text-sm text-white/70">
											{new Intl.DateTimeFormat(undefined, {
												dateStyle: 'medium',
											}).format(new Date(client.latestBookingAt))}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}
