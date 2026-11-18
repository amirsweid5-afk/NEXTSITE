import 'server-only'

import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

export interface BookingEditChange {
	field: string
	from: string
	to: string
}

export interface BookingEditNotification {
	notificationId: string
	bookingId: string
	clientName: string
	clientEmail: string
	serviceName: string
	createdAt: string
	read: boolean
	changes: BookingEditChange[]
}

interface NotificationsFile {
	notifications: BookingEditNotification[]
}

const filePath = path.join(process.cwd(), 'data', 'notifications.json')

let queue: Promise<unknown> = Promise.resolve()

function enqueue<T> (job: () => Promise<T>): Promise<T> {
	const run = queue.then(job, job)
	queue = run.then(() => undefined, () => undefined)
	return run
}

async function readFileNotifications (): Promise<BookingEditNotification[]> {
	try {
		const raw = await readFile(filePath, 'utf8')
		const parsed = JSON.parse(raw) as NotificationsFile
		if (!Array.isArray(parsed.notifications)) return []
		return parsed.notifications
	} catch {
		return []
	}
}

async function writeFileNotifications (
	notifications: BookingEditNotification[],
) {
	await mkdir(path.dirname(filePath), { recursive: true })
	const body: NotificationsFile = { notifications }
	await writeFile(filePath, JSON.stringify(body, null, '\t'))
}

/**
 * Stores a booking-edit alert for the admin notifications feed.
 */
export async function insertBookingEditNotification (input: {
	bookingId: string
	clientName: string
	clientEmail: string
	serviceName: string
	changes: BookingEditChange[]
}): Promise<BookingEditNotification> {
	const notification: BookingEditNotification = {
		notificationId: crypto.randomUUID(),
		bookingId: input.bookingId,
		clientName: input.clientName,
		clientEmail: input.clientEmail.trim().toLowerCase(),
		serviceName: input.serviceName,
		createdAt: new Date().toISOString(),
		read: false,
		changes: input.changes,
	}

	await enqueue(async () => {
		const notifications = await readFileNotifications()
		notifications.unshift(notification)
		await writeFileNotifications(notifications.slice(0, 200))
	})

	return notification
}

/**
 * Counts notifications the admin has not opened yet.
 */
export async function countUnreadBookingNotifications (): Promise<number> {
	const notifications = await readFileNotifications()
	return notifications.filter((item) => !item.read).length
}

/**
 * Returns newest notifications first.
 */
export async function listBookingEditNotifications ():
	Promise<BookingEditNotification[]> {
	const notifications = await readFileNotifications()
	return notifications.sort((left, right) => {
		return right.createdAt.localeCompare(left.createdAt)
	})
}

/**
 * Marks one notification as read.
 */
export async function markNotificationRead (
	notificationId: string,
): Promise<boolean> {
	let updated = false
	await enqueue(async () => {
		const notifications = await readFileNotifications()
		const index = notifications.findIndex((item) => {
			return item.notificationId === notificationId
		})
		if (index < 0) return
		notifications[index] = {
			...notifications[index],
			read: true,
		}
		await writeFileNotifications(notifications)
		updated = true
	})
	return updated
}

/**
 * Removes one notification from the admin feed.
 */
export async function deleteNotification (
	notificationId: string,
): Promise<boolean> {
	let deleted = false
	await enqueue(async () => {
		const notifications = await readFileNotifications()
		const next = notifications.filter((item) => {
			return item.notificationId !== notificationId
		})
		if (next.length === notifications.length) return
		await writeFileNotifications(next)
		deleted = true
	})
	return deleted
}

/**
 * Removes every notification from the admin feed.
 */
export async function deleteAllNotifications (): Promise<number> {
	let count = 0
	await enqueue(async () => {
		const notifications = await readFileNotifications()
		count = notifications.length
		if (count === 0) return
		await writeFileNotifications([])
	})
	return count
}

/**
 * Marks every notification as read.
 */
export async function markAllNotificationsRead (): Promise<number> {
	let count = 0
	await enqueue(async () => {
		const notifications = await readFileNotifications()
		const next = notifications.map((item) => {
			if (item.read) return item
			count += 1
			return { ...item, read: true }
		})
		await writeFileNotifications(next)
	})
	return count
}
