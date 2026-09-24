'use client'

import { useState } from 'react'
import { useContent } from '@/components/language-provider'
import { type AdminBookingCard } from '@/lib/bookings/get-admin-bookings'

interface AdminDashboardProps {
	bookings: AdminBookingCard[]
}

/**
 * Admin booking cards with expandable full form details.
 */
export function AdminDashboard ({ bookings }: AdminDashboardProps) {
	const copy = useContent().dashboard
	const [selectedId, setSelectedId] = useState<string | null>(null)

	function handleToggle (bookingId: string) {
		setSelectedId((current) => {
			return current === bookingId ? null : bookingId
		})
	}

	return (
		<section
			aria-labelledby="dashboard-heading"
			className={[
				'relative isolate overflow-hidden',
				'border-t border-white/10 bg-ink',
				'py-16 sm:py-20 lg:py-24',
			].join(' ')}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
			>
				<div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-orange/10 blur-[100px]" />
				<div className="absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-gold/10 blur-[90px]" />
			</div>

			<div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10 lg:px-12">
				<div className="max-w-2xl">
					<p className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
						{copy.eyebrow}
					</p>
					<h1
						id="dashboard-heading"
						className={[
							'mt-4 text-3xl font-semibold',
							'tracking-tight text-white',
							'sm:text-4xl',
						].join(' ')}
					>
						{copy.title}
					</h1>
					<p className="mt-4 text-base leading-7 text-white/65 sm:text-lg">
						{copy.description}
					</p>
				</div>

				{bookings.length === 0 ? (
					<p
						role="status"
						className={[
							'mt-12 rounded-2xl border border-white/10',
							'bg-surface/70 px-6 py-10 text-center',
							'text-sm text-white/60',
						].join(' ')}
					>
						{copy.empty}
					</p>
				) : (
					<ul className="mt-12 grid gap-4 sm:gap-5">
						{bookings.map((booking) => {
							const isOpen =
								selectedId === booking.bookingId
							const dateLabel = new Intl.DateTimeFormat(
								undefined,
								{
									dateStyle: 'medium',
									timeStyle: 'short',
								},
							).format(new Date(booking.createdAt))

							return (
								<li key={booking.bookingId}>
									<article
										className={[
											'rounded-2xl border border-white/10',
											'bg-surface/80 transition duration-300',
											isOpen
												? 'border-orange/40 shadow-[0_16px_40px_rgba(0,0,0,0.35)]'
												: 'hover:border-white/20',
										].join(' ')}
									>
										<button
											type="button"
											aria-expanded={isOpen}
											onClick={() => {
												handleToggle(booking.bookingId)
											}}
											className={[
												'flex w-full flex-col gap-3',
												'px-5 py-5 text-start sm:px-6',
												'focus-visible:outline-2',
												'focus-visible:outline-offset-[-4px]',
											].join(' ')}
										>
											<div className="flex flex-wrap items-start justify-between gap-3">
												<div>
													<h2 className="text-lg font-semibold text-white">
														{booking.fullName}
													</h2>
													<p className="mt-1 text-sm text-white/55">
														{booking.serviceName}
													</p>
												</div>
												<span
													className={[
														'rounded-full px-3 py-1',
														'text-[0.65rem] font-semibold',
														'uppercase tracking-[0.16em]',
														'bg-orange/15 text-orange',
													].join(' ')}
												>
													{booking.status}
												</span>
											</div>
											<p className="text-xs uppercase tracking-[0.16em] text-white/40">
												{dateLabel}
											</p>
											<p className="text-sm text-orange/90">
												{isOpen
													? copy.hideDetails
													: copy.viewDetails}
											</p>
										</button>

										{isOpen ? (
											<dl
												className={[
													'grid gap-5 border-t',
													'border-white/10 px-5 py-5',
													'sm:grid-cols-2 sm:px-6',
												].join(' ')}
											>
												<div>
													<dt className="text-xs uppercase tracking-[0.16em] text-white/40">
														{copy.fullName}
													</dt>
													<dd className="mt-2 text-sm text-white">
														{booking.fullName}
													</dd>
												</div>
												<div>
													<dt className="text-xs uppercase tracking-[0.16em] text-white/40">
														{copy.email}
													</dt>
													<dd className="mt-2 text-sm text-white break-all">
														{booking.email}
													</dd>
												</div>
												<div>
													<dt className="text-xs uppercase tracking-[0.16em] text-white/40">
														{copy.phone}
													</dt>
													<dd className="mt-2 text-sm text-white">
														{booking.phone
															?? copy.noPhone}
													</dd>
												</div>
												<div>
													<dt className="text-xs uppercase tracking-[0.16em] text-white/40">
														{copy.service}
													</dt>
													<dd className="mt-2 text-sm text-white">
														{booking.serviceName}
													</dd>
												</div>
												<div className="sm:col-span-2">
													<dt className="text-xs uppercase tracking-[0.16em] text-white/40">
														{copy.website}
													</dt>
													<dd className="mt-2 whitespace-pre-wrap text-sm leading-7 text-white/85">
														{booking.websiteDescription
															=== ''
															? copy.noWebsite
															: booking.websiteDescription}
													</dd>
												</div>
											</dl>
										) : null}
									</article>
								</li>
							)
						})}
					</ul>
				)}
			</div>
		</section>
	)
}
