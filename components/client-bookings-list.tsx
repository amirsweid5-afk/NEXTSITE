'use client'

import { Pencil } from 'lucide-react'
import { useContent } from '@/components/language-provider'
import { type ClientBooking } from '@/lib/bookings/client-booking-types'
import { toDeadlineDisplay } from '@/lib/bookings/deadline'

interface ClientBookingsListProps {
	bookings: ClientBooking[]
	editingBookingId: string | null
	onEdit: (booking: ClientBooking) => void
}

/**
 * Shows the signed-in client's bookings with a pen edit control.
 */
export function ClientBookingsList ({
	bookings,
	editingBookingId,
	onEdit,
}: ClientBookingsListProps) {
	const copy = useContent().booking.form

	if (bookings.length === 0) {
		return (
			<section className="mx-auto w-full max-w-3xl px-6 pb-4">
				<h2 className="text-lg font-semibold text-white">
					{copy.myBookings}
				</h2>
				<p className="mt-2 text-sm text-white/55">
					{copy.myBookingsEmpty}
				</p>
			</section>
		)
	}

	return (
		<section className="mx-auto w-full max-w-3xl px-6 pb-6">
			<h2 className="text-lg font-semibold text-white">
				{copy.myBookings}
			</h2>
			<ul className="mt-4 space-y-3">
				{bookings.map((booking) => {
					const isEditing = editingBookingId === booking.bookingId
					return (
						<li
							key={booking.bookingId}
							className={[
								'site-card rounded-2xl border border-white/10',
								'bg-surface/70 px-4 py-4',
								isEditing ? 'border-highlight/40' : '',
							].join(' ')}
						>
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0">
									<p className="truncate text-sm font-semibold text-white">
										{booking.serviceName}
									</p>
									<p className="mt-1 text-xs text-white/50">
										{copy.statusLabel}: {booking.status}
									</p>
									{booking.deadline ? (
										<p className="mt-1 text-xs text-white/50">
											{copy.deadline}:{' '}
											{toDeadlineDisplay(booking.deadline)}
										</p>
									) : null}
								</div>
								<button
									type="button"
									onClick={() => onEdit(booking)}
									aria-label={copy.editBooking}
									aria-pressed={isEditing}
									className={[
										'inline-flex h-9 w-9 shrink-0',
										'items-center justify-center',
										'rounded-full border border-white/15',
										'text-highlight transition',
										'hover:border-highlight/50',
										'hover:bg-highlight/10',
										'focus-visible:outline-2',
										'focus-visible:outline-offset-2',
									].join(' ')}
								>
									<Pencil className="h-4 w-4" />
								</button>
							</div>
						</li>
					)
				})}
			</ul>
		</section>
	)
}
