'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import {
	deleteAdminNotification,
	deleteAllAdminNotifications,
	markAdminNotificationRead,
	markAllAdminNotificationsRead,
} from '@/lib/admin/notification-actions'
import {
	type BookingEditNotification,
} from '@/lib/bookings/offline-notifications'

interface AdminNotificationsPanelProps {
	notifications: BookingEditNotification[]
}

/**
 * Feed of client booking edits for the admin portal.
 */
export function AdminNotificationsPanel ({
	notifications: initialNotifications,
}: AdminNotificationsPanelProps) {
	const router = useRouter()
	const [notifications, setNotifications] = useState(initialNotifications)
	const [isPending, startTransition] = useTransition()
	const unreadCount = notifications.filter((item) => !item.read).length

	function handleMarkRead (notificationId: string) {
		startTransition(async () => {
			await markAdminNotificationRead(notificationId)
			router.refresh()
			setNotifications((current) => {
				return current.map((item) => {
					if (item.notificationId !== notificationId) return item
					return { ...item, read: true }
				})
			})
		})
	}

	function handleDelete (notificationId: string) {
		startTransition(async () => {
			const result = await deleteAdminNotification(notificationId)
			if (!result.ok) return
			router.refresh()
			setNotifications((current) => {
				return current.filter((item) => {
					return item.notificationId !== notificationId
				})
			})
		})
	}

	function handleDeleteAll () {
		if (!window.confirm('Delete all notifications?')) return
		startTransition(async () => {
			const result = await deleteAllAdminNotifications()
			if (!result.ok) return
			router.refresh()
			setNotifications([])
		})
	}

	function handleMarkAll () {
		startTransition(async () => {
			await markAllAdminNotificationsRead()
			router.refresh()
			setNotifications((current) => {
				return current.map((item) => ({ ...item, read: true }))
			})
		})
	}

	return (
		<div className="space-y-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<p className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange/10 px-3 py-1 text-xs font-semibold text-orange">
					<Bell className="h-3.5 w-3.5" />
					{unreadCount} unread
				</p>
				{notifications.length > 0 ? (
					<div className="flex flex-wrap items-center gap-2">
						<button
							type="button"
							disabled={isPending || unreadCount === 0}
							onClick={handleMarkAll}
							className={[
								'inline-flex min-h-9 items-center gap-2',
								'rounded-full border border-white/15 px-4',
								'text-xs font-semibold uppercase tracking-[0.14em]',
								'text-white/70 hover:text-white',
								'disabled:cursor-not-allowed disabled:opacity-40',
							].join(' ')}
						>
							<CheckCheck className="h-3.5 w-3.5" />
							Mark all read
						</button>
						<button
							type="button"
							disabled={isPending}
							onClick={handleDeleteAll}
							className={[
								'inline-flex min-h-9 items-center gap-2',
								'rounded-full border border-orange/40 px-4',
								'text-xs font-semibold uppercase tracking-[0.14em]',
								'text-orange hover:bg-orange/10',
								'disabled:cursor-not-allowed disabled:opacity-40',
							].join(' ')}
						>
							<Trash2 className="h-3.5 w-3.5" />
							Delete all
						</button>
					</div>
				) : null}
			</div>

			{notifications.length === 0 ? (
				<AdminEmptyState
					title="No notifications yet"
					description="When a client edits a booking, the change lands here."
				/>
			) : (
				<ul className="space-y-3">
					{notifications.map((notification) => (
						<li
							key={notification.notificationId}
							className={[
								'site-card rounded-2xl border p-5',
								notification.read
									? 'border-white/10 bg-[var(--admin-surface)]'
									: 'border-orange/35 bg-orange/5',
							].join(' ')}
						>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<p className="text-sm font-semibold text-white">
										{notification.clientName} edited{' '}
										{notification.serviceName}
									</p>
									<p className="mt-1 text-xs text-white/45">
										{notification.clientEmail}
										{' · '}
										{new Intl.DateTimeFormat(undefined, {
											dateStyle: 'medium',
											timeStyle: 'short',
										}).format(new Date(notification.createdAt))}
									</p>
								</div>
								<div className="flex items-center gap-3">
									{notification.read ? (
										<span className="text-xs text-white/35">
											Read
										</span>
									) : (
										<button
											type="button"
											disabled={isPending}
											onClick={() => {
												handleMarkRead(
													notification.notificationId,
												)
											}}
											className="text-xs font-medium text-cyan-300 hover:underline disabled:opacity-50"
										>
											Mark read
										</button>
									)}
									<button
										type="button"
										disabled={isPending}
										onClick={() => {
											handleDelete(notification.notificationId)
										}}
										aria-label="Delete notification"
										className="text-xs font-medium text-orange hover:underline disabled:opacity-50"
									>
										Delete
									</button>
								</div>
							</div>

							<ul className="mt-4 space-y-2">
								{notification.changes.map((change) => (
									<li
										key={change.field + change.to}
										className="rounded-xl border border-white/10 bg-[var(--admin-inset)] px-3 py-3 text-sm"
									>
										<p className="text-xs uppercase tracking-[0.14em] text-white/40">
											{change.field}
										</p>
										<p className="mt-1 text-white/50 line-through">
											{change.from}
										</p>
										<p className="mt-1 text-emerald-300">
											{change.to}
										</p>
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
