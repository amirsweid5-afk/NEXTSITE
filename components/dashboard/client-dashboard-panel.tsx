'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
	Clock3,
	CreditCard,
	Pencil,
	Sparkles,
	WandSparkles,
} from 'lucide-react'
import { BookNowSection } from '@/components/book-now-section'
import { ClientWebsiteStatus } from '@/components/client-website-status'
import { type BookingServiceOption } from '@/lib/bookings/booking-schema'
import { type ClientBooking } from '@/lib/bookings/client-booking-types'
import { toDeadlineDisplay } from '@/lib/bookings/deadline'
import { formatUsd } from '@/lib/bookings/revenue-math'

interface ClientDashboardPanelProps {
	bookings: ClientBooking[]
	services: BookingServiceOption[]
	clientName: string
	accountEmail: string
}

/**
 * Client portal overview with stats, bookings, and inline edit.
 */
export function ClientDashboardPanel ({
	bookings: initialBookings,
	services,
	clientName,
	accountEmail,
}: ClientDashboardPanelProps) {
	const serverStamp = bookingStamp(initialBookings)
	const [seenStamp, setSeenStamp] = useState(serverStamp)
	const [bookings, setBookings] = useState(initialBookings)
	const [editingBookingId, setEditingBookingId] = useState<string | null>(
		null,
	)
	if (seenStamp !== serverStamp) {
		setSeenStamp(serverStamp)
		setBookings(initialBookings)
	}

	const stats = useMemo(() => {
		const totalPaid = bookings.reduce((sum, booking) => {
			return sum + booking.amountPaid
		}, 0)
		const totalEdits = bookings.reduce((sum, booking) => {
			return sum + booking.editCount
		}, 0)
		const finished = bookings.filter((booking) => {
			return booking.websiteProgress === 'finished'
		}).length
		const pending = bookings.filter((booking) => {
			return booking.websiteProgress === 'pending'
		}).length
		const notStarted = bookings.filter((booking) => {
			return booking.websiteProgress === 'not_started'
		}).length

		return {
			totalPaid,
			totalEdits,
			finished,
			pending,
			notStarted,
			count: bookings.length,
		}
	}, [bookings])

	function handleEdit (bookingId: string) {
		setEditingBookingId(bookingId)
		window.requestAnimationFrame(() => {
			document.getElementById('dashboard-edit')?.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		})
	}

	return (
		<div className="space-y-8">
			<section className="overflow-hidden rounded-3xl border border-white/10 bg-surface/60 p-6 sm:p-8">
				<div className="flex flex-wrap items-end justify-between gap-4">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
							Your studio
						</p>
						<h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
							Welcome back, {clientName.split(' ')[0] || 'friend'}
						</h1>
						<p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
							Track every website you booked, what you have paid,
							how many edits you made, and live progress from the
							NEXTSITE team.
						</p>
					</div>
					<Link
						href="/booking"
						className={[
							'inline-flex min-h-11 items-center gap-2',
							'rounded-full bg-orange px-5 text-sm',
							'font-semibold text-ink',
							'hover:bg-highlight',
						].join(' ')}
					>
						<Sparkles className="h-4 w-4" />
						Book another site
					</Link>
				</div>
			</section>

			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					label="Bookings"
					value={String(stats.count)}
					hint="Projects on your account"
					icon={<WandSparkles className="h-4 w-4" />}
				/>
				<StatCard
					label="Paid so far"
					value={formatUsd(stats.totalPaid)}
					hint="Across every website"
					icon={<CreditCard className="h-4 w-4" />}
					accent="green"
				/>
				<StatCard
					label="Edits made"
					value={String(stats.totalEdits)}
					hint="Submission updates sent"
					icon={<Pencil className="h-4 w-4" />}
					accent="orange"
				/>
				<StatCard
					label="In motion"
					value={`${stats.pending} pending`}
					hint={`${stats.finished} finished · ${stats.notStarted} not started`}
					icon={<Clock3 className="h-4 w-4" />}
				/>
			</section>

			<section className="space-y-4">
				<div>
					<h2 className="text-xl font-semibold text-white">
						Your websites
					</h2>
					<p className="mt-1 text-sm text-white/50">
						Tap the pen to revise a submission. Admins see every
						change in Notifications.
					</p>
				</div>

				{bookings.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-white/15 bg-ink/40 px-6 py-12 text-center">
						<p className="text-base font-medium text-white">
							No bookings yet
						</p>
						<p className="mt-2 text-sm text-white/50">
							When you book a website, it will live here with
							payment and progress details.
						</p>
						<Link
							href="/booking"
							className="mt-5 inline-flex min-h-11 items-center rounded-full bg-orange px-5 text-sm font-semibold text-ink"
						>
							Start a booking
						</Link>
					</div>
				) : (
					<ul className="grid gap-4 lg:grid-cols-2">
						{bookings.map((booking) => {
							return (
								<li
									key={booking.bookingId}
									className={[
										'site-card rounded-2xl border border-white/10',
										'bg-surface/70 p-5',
										editingBookingId === booking.bookingId
											? 'border-highlight/50'
											: '',
									].join(' ')}
								>
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0">
											<p className="truncate text-lg font-semibold text-white">
												{booking.serviceName}
											</p>
											<ClientWebsiteStatus
												status={booking.status}
												websiteProgress={
													booking.websiteProgress
												}
												progressSetByAdmin={
													booking.progressSetByAdmin
												}
												progressUpdatedAt={
													booking.progressUpdatedAt
												}
												statusUpdatedAt={
													booking.statusUpdatedAt
												}
											/>
										</div>
										<button
											type="button"
											onClick={() => {
												handleEdit(booking.bookingId)
											}}
											aria-label="Edit booking"
											aria-pressed={
												editingBookingId === booking.bookingId
											}
											className={[
												'inline-flex h-9 w-9 shrink-0',
												'items-center justify-center',
												'rounded-full border border-white/15',
												'text-highlight transition',
												'hover:border-highlight/50',
												'hover:bg-highlight/10',
											].join(' ')}
										>
											<Pencil className="h-4 w-4" />
										</button>
									</div>

									<div className="mt-4 flex flex-wrap gap-2">
										<span className="inline-flex rounded-full border border-white/10 bg-ink/50 px-3 py-1 text-xs text-white/70">
											Paid {formatUsd(booking.amountPaid)}
										</span>
										<span className="inline-flex rounded-full border border-white/10 bg-ink/50 px-3 py-1 text-xs text-white/70">
											{booking.editCount} edit
											{booking.editCount === 1 ? '' : 's'}
										</span>
									</div>

									<dl className="mt-4 grid gap-2 text-sm text-white/65">
										<div className="flex justify-between gap-3">
											<dt>Project price</dt>
											<dd className="text-white">
												{booking.priceUsd === null
													? 'Set by admin'
													: formatUsd(booking.priceUsd)}
											</dd>
										</div>
										<div className="flex justify-between gap-3">
											<dt>Still due</dt>
											<dd className="text-white">
												{formatUsd(booking.remainingBalance)}
											</dd>
										</div>
										{booking.deadline ? (
											<div className="flex justify-between gap-3">
												<dt>Deadline</dt>
												<dd className="text-white">
													{toDeadlineDisplay(booking.deadline)}
												</dd>
											</div>
										) : null}
									</dl>

									<p className="mt-4 line-clamp-3 text-sm leading-6 text-white/50">
										{booking.websiteDescription
											|| 'No website notes yet.'}
									</p>
								</li>
							)
						})}
					</ul>
				)}
			</section>

			{editingBookingId ? (
				<section
					id="dashboard-edit"
					className="overflow-hidden rounded-3xl border border-highlight/25 bg-ink/40"
				>
					<div className="border-b border-white/10 px-6 py-5">
						<p className="text-xs font-medium uppercase tracking-[0.22em] text-highlight">
							Edit submission
						</p>
						<p className="mt-2 text-sm text-white/55">
							Changes update your booking copy and appear in the
							admin Notifications section.
						</p>
						<button
							type="button"
							onClick={() => setEditingBookingId(null)}
							className="mt-3 text-sm text-orange hover:text-highlight"
						>
							Close editor
						</button>
					</div>
					<BookNowSection
						key={editingBookingId}
						services={services}
						isSignedIn
						accountEmail={accountEmail}
						accountName={clientName}
						returnPath="/dashboard"
						myBookings={bookings}
						hideBookingsList
						initialEditingBookingId={editingBookingId}
						onBookingsChange={setBookings}
						onEditingChange={(bookingId) => {
							if (bookingId === null) {
								setEditingBookingId(null)
							}
						}}
					/>
				</section>
			) : null}
		</div>
	)
}

function bookingStamp (bookings: ClientBooking[]) {
	return bookings.map((booking) => {
		return [
			booking.bookingId,
			booking.status,
			booking.websiteProgress,
			booking.progressSetByAdmin ? '1' : '0',
			booking.statusUpdatedAt ?? '',
			booking.progressUpdatedAt ?? '',
			booking.websiteDescription,
			booking.deadline,
			booking.budget,
			String(booking.editCount),
		].join(':')
	}).join('|')
}

function StatCard ({
	label,
	value,
	hint,
	icon,
	accent = 'cyan',
}: {
	label: string
	value: string
	hint: string
	icon: React.ReactNode
	accent?: 'cyan' | 'green' | 'orange'
}) {
	const valueClass = accent === 'green'
		? 'text-emerald-300'
		: accent === 'orange'
			? 'text-orange'
			: 'text-highlight'

	return (
		<article className="site-card rounded-2xl border border-white/10 bg-surface/70 p-5">
			<div className="flex items-center justify-between gap-3">
				<p className="text-sm text-white/50">{label}</p>
				<span className="rounded-full border border-white/10 bg-ink/60 p-2 text-orange">
					{icon}
				</span>
			</div>
			<p className={`mt-3 text-3xl font-semibold tracking-tight ${valueClass}`}>
				{value}
			</p>
			<p className="mt-2 text-xs text-white/40">{hint}</p>
		</article>
	)
}
