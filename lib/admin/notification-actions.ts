'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import {
	deleteAllNotifications,
	deleteNotification,
	markAllNotificationsRead,
	markNotificationRead,
} from '@/lib/bookings/offline-notifications'

/**
 * Marks one booking-edit notification as read.
 */
export async function markAdminNotificationRead (
	notificationId: string,
) {
	const profile = await getCurrentProfile()
	if (!profile?.isAdmin) {
		return { ok: false as const, error: 'Admin only.' }
	}
	await markNotificationRead(notificationId)
	revalidatePath('/admin', 'layout')
	revalidatePath('/admin/notifications')
	return { ok: true as const }
}

/**
 * Marks every booking-edit notification as read.
 */
export async function markAllAdminNotificationsRead () {
	const profile = await getCurrentProfile()
	if (!profile?.isAdmin) {
		return { ok: false as const, error: 'Admin only.' }
	}
	await markAllNotificationsRead()
	revalidatePath('/admin', 'layout')
	revalidatePath('/admin/notifications')
	return { ok: true as const }
}

/**
 * Deletes one booking-edit notification. Admin only.
 */
export async function deleteAdminNotification (
	notificationId: string,
) {
	const profile = await getCurrentProfile()
	if (!profile?.isAdmin) {
		return { ok: false as const, error: 'Admin only.' }
	}
	if (
		typeof notificationId !== 'string'
		|| notificationId.trim() === ''
	) {
		return { ok: false as const, error: 'Invalid notification.' }
	}
	await deleteNotification(notificationId)
	revalidatePath('/admin', 'layout')
	revalidatePath('/admin/notifications')
	return { ok: true as const }
}

/**
 * Deletes every booking-edit notification. Admin only.
 */
export async function deleteAllAdminNotifications () {
	const profile = await getCurrentProfile()
	if (!profile?.isAdmin) {
		return { ok: false as const, error: 'Admin only.' }
	}
	await deleteAllNotifications()
	revalidatePath('/admin', 'layout')
	revalidatePath('/admin/notifications')
	return { ok: true as const }
}
