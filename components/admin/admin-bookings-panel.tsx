'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateBookingStatus } from '@/lib/admin/update-booking-status'
import {
	addBookingPayment,
	updateBookingPrice,
} from '@/lib/bookings/admin-revenue-actions'
import { type AdminBookingCard } from '@/lib/bookings/admin-dashboard-types'
import { deleteBooking } from '@/lib/bookings/delete-booking'
import { formatUsd } from '@/lib/bookings/revenue-math'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'

interface AdminBookingsPanelProps {
	bookings: AdminBookingCard[]
	showFinance?: boolean
	showActions?: boolean
	pageSize?: number
}

/**
 * Searchable, paginated bookings table with admin actions.
 */
export function AdminBookingsPanel ({
	bookings: initialBookings,
	showFinance = true,
	showActions = true,
	pageSize = 8,
}: AdminBookingsPanelProps) {
	const router = useRouter()
	const [query, setQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [page, setPage] = useState(1)
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({})
	const [paymentDrafts, setPaymentDrafts] = useState<Record<string, string>>({})
	const [isPending, startTransition] = useTransition()

	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase()

		return initialBookings.filter((booking) => {
			const matchesStatus = statusFilter === 'all'
				|| booking.status === statusFilter
			const haystack = [
				booking.fullName,
				booking.email,
				booking.phone ?? '',
				booking.serviceName,
			].join(' ').toLowerCase()
			const matchesQuery = normalized === ''
				|| haystack.includes(normalized)

			return matchesStatus && matchesQuery
		})
	}, [initialBookings, query, statusFilter])

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
	const currentPage = Math.min(page, totalPages)
	const pageRows = filtered.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	)

	function refresh () {
		router.refresh()
	}

	function runAction (action: () => Promise<{ ok: boolean; error?: string }>) {
		setError(null)
		startTransition(async () => {
			const result = await action()
			if (!result.ok) {
				setError(result.error ?? 'Something went wrong.')
				return
			}
			refresh()
		})
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<input
					type="search"
					value={query}
					onChange={(event) => {
						setQuery(event.target.value)
						setPage(1)
					}}
					placeholder="Search clients, email, phone, service..."
					className="w-full rounded-xl border border-white/10 bg-[var(--admin-surface)] px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-violet-400/50 focus:outline-none sm:max-w-md"
				/>
				<select
					value={statusFilter}
					onChange={(event) => {
						setStatusFilter(event.target.value)
						setPage(1)
					}}
					className="rounded-xl border border-white/10 bg-[var(--admin-surface)] px-4 py-2.5 text-sm text-white focus:border-violet-400/50 focus:outline-none"
				>
					<option value="all">All statuses</option>
					<option value="pending">Pending</option>
					<option value="confirmed">Accepted</option>
					<option value="completed">Completed</option>
					<option value="cancelled">Rejected</option>
				</select>
			</div>

			{error ? (
				<p role="alert" className="text-sm text-orange">
					{error}
				</p>
			) : null}

			{pageRows.length === 0 ? (
				<AdminEmptyState
					title="No bookings found"
					description="Try another search or wait for new client submissions."
				/>
			) : (
				<div className="overflow-x-auto rounded-2xl border border-white/10 bg-[var(--admin-surface)]">
					<table className="min-w-full text-start">
						<thead>
							<tr className="border-b border-white/10 text-sm text-white/60">
								<th className="px-4 py-3 font-medium">Client</th>
								<th className="px-4 py-3 font-medium">Service</th>
								{showFinance ? (
									<>
										<th className="px-4 py-3 font-medium">Price</th>
										<th className="px-4 py-3 font-medium">Paid</th>
										<th className="px-4 py-3 font-medium">Balance</th>
									</>
								) : null}
								<th className="px-4 py-3 font-medium">Status</th>
							</tr>
						</thead>
						<tbody>
							{pageRows.map((booking) => {
								const isOpen = selectedId === booking.bookingId
								const priceValue = priceDrafts[booking.bookingId]
									?? (booking.priceUsd === null
										? ''
										: String(booking.priceUsd))
								const paymentValue =
									paymentDrafts[booking.bookingId] ?? ''

								return (
									<tr
										key={booking.bookingId}
										className="border-b border-white/10 last:border-b-0"
									>
										<td className="px-4 py-4 align-top">
											<p className="font-medium text-white">
												{booking.fullName}
											</p>
											<p className="mt-1 text-xs text-white/45">
												{booking.email}
											</p>
											<div className="mt-2 flex flex-wrap gap-2">
												<button
													type="button"
													onClick={() => {
														setSelectedId((current) => {
															return current === booking.bookingId
																? null
																: booking.bookingId
														})
													}}
													className="text-xs font-medium text-violet-300 hover:underline"
												>
													{isOpen ? 'Hide details' : 'See details'}
												</button>
												{showActions ? (
													<button
														type="button"
														disabled={isPending}
														onClick={() => {
															if (!window.confirm('Delete this booking?')) {
																return
															}
															runAction(() => {
																return deleteBooking(booking.bookingId)
															})
														}}
														className="text-xs font-medium text-orange hover:underline disabled:opacity-50"
													>
														Delete
													</button>
												) : null}
											</div>

											{isOpen ? (
												<div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-[var(--admin-inset)] p-4 text-sm">
													<p className="text-white/70">
														<span className="text-white/40">Phone: </span>
														{booking.phone ?? '—'}
													</p>
													<p className="whitespace-pre-wrap text-white/80">
														{booking.websiteDescription || 'No website details.'}
													</p>

													{showActions ? (
														<div className="flex flex-wrap gap-2 pt-2">
															<button
																type="button"
																disabled={isPending}
																onClick={() => {
																	runAction(() => updateBookingStatus({
																		bookingId: booking.bookingId,
																		status: 'confirmed',
																	}))
																}}
																className="rounded-full bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
															>
																Accept
															</button>
															<button
																type="button"
																disabled={isPending}
																onClick={() => {
																	runAction(() => updateBookingStatus({
																		bookingId: booking.bookingId,
																		status: 'cancelled',
																	}))
																}}
																className="rounded-full border border-orange/40 px-3 py-1.5 text-xs font-semibold text-orange disabled:opacity-50"
															>
																Reject
															</button>
															<button
																type="button"
																disabled={isPending}
																onClick={() => {
																	runAction(() => updateBookingStatus({
																		bookingId: booking.bookingId,
																		status: 'completed',
																	}))
																}}
																className="rounded-full border border-emerald-400/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 disabled:opacity-50"
															>
																Mark completed
															</button>
														</div>
													) : null}

													{showFinance ? (
														<div className="space-y-3 border-t border-white/10 pt-3">
															<label className="block text-xs text-white/45">
																Project price (USD)
																<input
																	type="number"
																	min="0"
																	step="0.01"
																	value={priceValue}
																	onChange={(event) => {
																		setPriceDrafts((current) => ({
																			...current,
																			[booking.bookingId]: event.target.value,
																		}))
																	}}
																	className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-surface)] px-3 py-2 text-sm text-white"
																/>
															</label>
															<button
																type="button"
																disabled={isPending}
																onClick={() => {
																	const priceUsd = Number(priceValue)
																	if (!Number.isFinite(priceUsd) || priceUsd < 0) {
																		setError('Enter a valid USD price.')
																		return
																	}
																	runAction(() => updateBookingPrice({
																		bookingId: booking.bookingId,
																		priceUsd,
																	}))
																}}
																className="rounded-full bg-violet-500/90 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
															>
																Save price
															</button>
															<label className="block text-xs text-white/45">
																Record payment (USD)
																<input
																	type="number"
																	min="0.01"
																	step="0.01"
																	value={paymentValue}
																	onChange={(event) => {
																		setPaymentDrafts((current) => ({
																			...current,
																			[booking.bookingId]: event.target.value,
																		}))
																	}}
																	className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-surface)] px-3 py-2 text-sm text-white"
																/>
															</label>
															<button
																type="button"
																disabled={isPending}
																onClick={() => {
																	const amountUsd = Number(paymentValue)
																	if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
																		setError('Enter a valid payment amount.')
																		return
																	}
																	runAction(async () => {
																		const result = await addBookingPayment({
																			bookingId: booking.bookingId,
																			amountUsd,
																		})
																		if (result.ok) {
																			setPaymentDrafts((current) => ({
																				...current,
																				[booking.bookingId]: '',
																			}))
																		}
																		return result
																	})
																}}
																className="rounded-full border border-violet-400/40 px-3 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-200 disabled:opacity-50"
															>
																Add payment
															</button>
															{booking.payments.length > 0 ? (
																<ul className="space-y-1 text-xs text-white/55">
																	{booking.payments.map((payment) => (
																		<li
																			key={payment.paymentId}
																			className="flex justify-between gap-3"
																		>
																			<span>
																				{new Intl.DateTimeFormat(undefined, {
																					dateStyle: 'medium',
																				}).format(new Date(payment.paidAt))}
																			</span>
																			<span className="text-violet-600 dark:text-violet-200">
																				{formatUsd(payment.amountUsd)}
																			</span>
																		</li>
																	))}
																</ul>
															) : null}
														</div>
													) : null}
												</div>
											) : null}
										</td>
										<td className="px-4 py-4 align-top text-sm text-white/75">
											{booking.serviceName}
										</td>
										{showFinance ? (
											<>
												<td className="px-4 py-4 align-top text-sm text-white">
													{booking.priceUsd === null
														? '—'
														: formatUsd(booking.priceUsd)}
												</td>
												<td className="px-4 py-4 align-top text-sm text-white">
													{formatUsd(booking.amountPaid)}
												</td>
												<td className="px-4 py-4 align-top text-sm text-white">
													{booking.priceUsd === null
														? '—'
														: formatUsd(booking.remainingBalance)}
												</td>
											</>
										) : null}
										<td className="px-4 py-4 align-top">
											<span className="inline-flex rounded-full bg-violet-500/15 px-3 py-1 text-xs font-medium capitalize text-violet-600 dark:text-violet-200">
												{booking.status === 'confirmed'
													? 'accepted'
													: booking.status === 'cancelled'
														? 'rejected'
														: booking.status}
											</span>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			)}

			{filtered.length > pageSize ? (
				<div className="flex items-center justify-between gap-3 text-sm text-white/55">
					<button
						type="button"
						disabled={currentPage <= 1}
						onClick={() => setPage((value) => value - 1)}
						className="rounded-lg border border-white/10 px-3 py-1.5 disabled:opacity-40"
					>
						Previous
					</button>
					<p>
						Page {currentPage} of {totalPages}
					</p>
					<button
						type="button"
						disabled={currentPage >= totalPages}
						onClick={() => setPage((value) => value + 1)}
						className="rounded-lg border border-white/10 px-3 py-1.5 disabled:opacity-40"
					>
						Next
					</button>
				</div>
			) : null}
		</div>
	)
}
