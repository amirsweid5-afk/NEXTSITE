'use client'

import { useMemo, useState, useTransition } from 'react'
import { Search } from 'lucide-react'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import { updateWebsiteProgress } from '@/lib/admin/update-website-progress'
import { type AdminBookingCard } from '@/lib/bookings/admin-dashboard-types'
import { toDeadlineDisplay } from '@/lib/bookings/deadline'
import { formatUsd } from '@/lib/bookings/revenue-math'
import {
	WEBSITE_PROGRESS_OPTIONS,
	type WebsiteProgress,
	websiteProgressLabel,
} from '@/lib/bookings/website-progress'

interface AdminClientManagingPanelProps {
	bookings: AdminBookingCard[]
}

/**
 * Admin workspace to search clients and set website progress.
 */
export function AdminClientManagingPanel ({
	bookings: initialBookings,
}: AdminClientManagingPanelProps) {
	const [bookings, setBookings] = useState(initialBookings)
	const [query, setQuery] = useState('')
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()

	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase()
		if (normalized === '') return bookings
		return bookings.filter((booking) => {
			return [
				booking.fullName,
				booking.email,
				booking.phone ?? '',
				booking.serviceName,
			].join(' ').toLowerCase().includes(normalized)
		})
	}, [bookings, query])

	function handleProgressChange (
		bookingId: string,
		websiteProgress: WebsiteProgress,
	) {
		setError(null)
		startTransition(async () => {
			const result = await updateWebsiteProgress({
				bookingId,
				websiteProgress,
			})
			if (!result.ok) {
				setError(result.error ?? 'Could not update progress.')
				return
			}
			setBookings((current) => {
				return current.map((booking) => {
					if (booking.bookingId !== bookingId) return booking
					return { ...booking, websiteProgress }
				})
			})
		})
	}

	return (
		<div className="space-y-5">
			<div className="relative max-w-lg">
				<Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
				<input
					type="search"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Search client names, email, or website..."
					className={[
						'w-full rounded-xl border border-white/10',
						'bg-[var(--admin-surface)] py-2.5 ps-10 pe-4',
						'text-sm text-white placeholder:text-white/35',
						'focus:border-cyan-300/50 focus:outline-none',
					].join(' ')}
				/>
			</div>

			{error ? (
				<p role="alert" className="text-sm text-orange">
					{error}
				</p>
			) : null}

			{filtered.length === 0 ? (
				<AdminEmptyState
					title="No websites found"
					description="Bookings appear here after clients submit projects."
				/>
			) : (
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
					{filtered.map((booking) => {
						const isOpen = selectedId === booking.bookingId
						const wasEdited = booking.wasEdited === true

						if (!isOpen) {
							return (
								<button
									key={booking.bookingId}
									type="button"
									onClick={() => {
										setSelectedId(booking.bookingId)
									}}
									aria-expanded={false}
									className={[
										'site-card rounded-xl border border-white/10',
										'bg-[var(--admin-surface)] p-3 text-start',
										'transition hover:border-cyan-300/40',
										'focus-visible:outline-2',
										'focus-visible:outline-offset-2',
									].join(' ')}
								>
									<p className="truncate text-sm font-semibold text-white">
										{booking.fullName}
									</p>
									<p className="mt-1 truncate text-xs text-white/45">
										{booking.serviceName}
									</p>
									<p className="mt-2 truncate text-[0.7rem] text-white/35">
										{websiteProgressLabel(
											booking.websiteProgress,
										)}
										{' · '}
										{booking.status}
									</p>
								</button>
							)
						}

						return (
							<article
								key={booking.bookingId}
								className={[
									'site-card rounded-2xl border border-cyan-300/30',
									'bg-[var(--admin-surface)] p-5',
									'sm:col-span-2 xl:col-span-3',
								].join(' ')}
							>
								<div className="flex flex-wrap items-start justify-between gap-4">
									<div className="min-w-0">
										<p className="text-lg font-semibold text-white">
											{booking.fullName}
										</p>
										<p className="mt-1 text-sm text-white/50">
											{booking.email}
											{booking.phone
												? ` · ${booking.phone}`
												: ''}
										</p>
										<p className="mt-2 text-sm text-cyan-700 dark:text-cyan-100">
											{booking.serviceName}
										</p>
									</div>
									<div className="flex flex-col items-end gap-2">
										<button
											type="button"
											onClick={() => setSelectedId(null)}
											className={[
												'rounded-full border border-white/15',
												'px-3 py-1 text-xs font-semibold',
												'text-white hover:border-white/40',
											].join(' ')}
										>
											Cancel
										</button>
										<span
											className={[
												'rounded-full px-3 py-1 text-xs font-semibold',
												wasEdited
													? 'bg-emerald-400/15 text-emerald-300'
													: 'bg-red-500/15 text-red-300',
											].join(' ')}
										>
											{wasEdited
												? 'This booking got edited'
												: 'Still not edited'}
										</span>
										<p className="text-xs text-white/45">
											{booking.editCount ?? 0} edit
											{(booking.editCount ?? 0) === 1
												? ''
												: 's'}
										</p>
									</div>
								</div>

								<div className="mt-4 grid gap-3 sm:grid-cols-3">
									<div className="rounded-xl border border-white/10 bg-[var(--admin-inset)] px-3 py-3">
										<p className="text-xs text-white/45">Paid</p>
										<p className="mt-1 text-sm font-semibold text-white">
											{formatUsd(booking.amountPaid)}
										</p>
									</div>
									<div className="rounded-xl border border-white/10 bg-[var(--admin-inset)] px-3 py-3">
										<p className="text-xs text-white/45">Price</p>
										<p className="mt-1 text-sm font-semibold text-white">
											{booking.priceUsd === null
												? '—'
												: formatUsd(booking.priceUsd)}
										</p>
									</div>
									<div className="rounded-xl border border-white/10 bg-[var(--admin-inset)] px-3 py-3">
										<p className="text-xs text-white/45">Progress</p>
										<p className="mt-1 text-sm font-semibold text-white">
											{websiteProgressLabel(
												booking.websiteProgress,
											)}
										</p>
									</div>
								</div>

								<label className="mt-4 block text-xs font-medium uppercase tracking-[0.14em] text-white/45">
									Website status for client dashboard
									<select
										value={
											booking.websiteProgress ?? 'not_started'
										}
										disabled={isPending}
										onChange={(event) => {
											handleProgressChange(
												booking.bookingId,
												event.target.value as WebsiteProgress,
											)
										}}
										className={[
											'mt-2 w-full rounded-xl border border-white/10',
											'bg-[var(--admin-inset)] px-3 py-2.5 text-sm',
											'text-white focus:border-cyan-300/50',
											'focus:outline-none disabled:opacity-60',
										].join(' ')}
									>
										{WEBSITE_PROGRESS_OPTIONS.map((option) => (
											<option
												key={option.value}
												value={option.value}
											>
												{option.label}
											</option>
										))}
									</select>
								</label>

								<div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-[var(--admin-inset)] p-4 text-sm text-white/70">
										<p>
											<span className="text-white/45">Deadline: </span>
											{booking.deadline
												? toDeadlineDisplay(booking.deadline)
												: '—'}
										</p>
										<p>
											<span className="text-white/45">Budget: </span>
											{booking.budget || '—'}
										</p>
										<p className="whitespace-pre-wrap leading-6">
											{booking.websiteDescription || 'No notes.'}
										</p>
										{booking.lastEditedAt ? (
											<p className="text-xs text-emerald-300/80">
												Last edited{' '}
												{new Intl.DateTimeFormat(undefined, {
													dateStyle: 'medium',
													timeStyle: 'short',
												}).format(new Date(booking.lastEditedAt))}
											</p>
										) : null}
								</div>
							</article>
						)
					})}
				</div>
			)}
		</div>
	)
}
