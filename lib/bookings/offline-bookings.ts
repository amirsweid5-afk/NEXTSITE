import 'server-only'

import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import {
	type AdminBookingCard,
	type AdminBookingPayment,
} from '@/lib/bookings/admin-dashboard-types'
import {
	getPaymentStatus,
	getRemainingBalance,
	roundUsd,
} from '@/lib/bookings/revenue-math'
import {
	insertBookingEditNotification,
	type BookingEditChange,
} from '@/lib/bookings/offline-notifications'
import { SERVICE_CATALOG } from '@/lib/bookings/service-catalog'
import {
	type WebsiteProgress,
} from '@/lib/bookings/website-progress'
import { type BookingStatus } from '@/lib/supabase/database'

export interface OfflineBooking {
	bookingId: string
	fullName: string
	email: string
	phone: string | null
	countryCode?: string
	localPhone?: string
	serviceId?: string
	serviceName: string
	websiteDescription: string
	budget?: string
	deadline?: string
	status: BookingStatus
	createdAt: string
	priceUsd: number
	payments: OfflinePayment[]
	editCount?: number
	wasEdited?: boolean
	lastEditedAt?: string | null
	websiteProgress?: WebsiteProgress
	progressSetByAdmin?: boolean
	progressUpdatedAt?: string | null
	ownerUserId?: string
	ownerEmail?: string
	statusUpdatedAt?: string | null
}

interface OfflinePayment {
	paymentId: string
	amountUsd: number
	paidAt: string
	note: string | null
}

interface OfflineFile {
	bookings: OfflineBooking[]
}

const filePath = path.join(process.cwd(), 'data', 'bookings.json')

let queue: Promise<unknown> = Promise.resolve()

/**
 * Runs file updates one at a time so two submits cannot clobber each other.
 */
function enqueue<T> (job: () => Promise<T>): Promise<T> {
	const run = queue.then(job, job)
	queue = run.then(() => undefined, () => undefined)
	return run
}

/**
 * Reads the local booking file. Missing or broken files count as empty.
 */
async function readFileBookings (): Promise<OfflineBooking[]> {
	try {
		const raw = await readFile(filePath, 'utf8')
		const parsed = JSON.parse(raw) as OfflineFile
		if (!Array.isArray(parsed.bookings)) return []
		return parsed.bookings
	} catch {
		return []
	}
}

/**
 * Writes the local booking file.
 */
async function writeFileBookings (bookings: OfflineBooking[]) {
	await mkdir(path.dirname(filePath), { recursive: true })
	const body: OfflineFile = { bookings }
	await writeFile(filePath, JSON.stringify(body, null, '\t'))
}

/**
 * Saves a booking locally for the admin portal and client dashboard.
 */
export async function insertOfflineBooking (input: {
	bookingId?: string
	fullName: string
	email: string
	phone: string
	countryCode: string
	localPhone: string
	serviceId: string
	websiteDescription: string
	budget: string
	deadline: string
	priceUsd?: number
	ownerUserId?: string
	ownerEmail?: string
}): Promise<string | null> {
	const service = SERVICE_CATALOG.find((item) => {
		return item.serviceId === input.serviceId
	})
	if (!service && input.priceUsd === undefined) return null

	const bookingId = input.bookingId ?? crypto.randomUUID()
	const booking: OfflineBooking = {
		bookingId,
		fullName: input.fullName,
		email: input.email.trim().toLowerCase(),
		phone: input.phone,
		countryCode: input.countryCode,
		localPhone: input.localPhone,
		serviceId: input.serviceId,
		serviceName: service?.name ?? 'Website',
		websiteDescription: input.websiteDescription,
		budget: input.budget,
		deadline: input.deadline,
		status: 'pending',
		createdAt: new Date().toISOString(),
		priceUsd: input.priceUsd ?? service?.price ?? 0,
		payments: [],
		editCount: 0,
		wasEdited: false,
		lastEditedAt: null,
		websiteProgress: 'not_started',
		progressSetByAdmin: false,
		progressUpdatedAt: null,
		ownerUserId: input.ownerUserId,
		ownerEmail: input.ownerEmail?.trim().toLowerCase(),
		statusUpdatedAt: null,
	}

	await enqueue(async () => {
		const bookings = await readFileBookings()
		const existing = bookings.findIndex((item) => {
			return item.bookingId === bookingId
		})
		if (existing >= 0) {
			bookings[existing] = {
				...bookings[existing],
				...booking,
				payments: bookings[existing].payments,
				editCount: bookings[existing].editCount,
				wasEdited: bookings[existing].wasEdited,
				lastEditedAt: bookings[existing].lastEditedAt,
				websiteProgress: bookings[existing].websiteProgress,
				progressSetByAdmin: bookings[existing].progressSetByAdmin,
				progressUpdatedAt: bookings[existing].progressUpdatedAt,
				ownerUserId: bookings[existing].ownerUserId
					?? booking.ownerUserId,
				ownerEmail: bookings[existing].ownerEmail
					?? booking.ownerEmail,
				statusUpdatedAt: bookings[existing].statusUpdatedAt,
				status: bookings[existing].status,
			}
		} else {
			bookings.unshift(booking)
		}
		await writeFileBookings(bookings)
	})

	return booking.bookingId
}

/**
 * Updates one offline booking owned by this email.
 * Records edit metadata and queues an admin notification.
 */
export async function updateOfflineBooking (input: {
	bookingId: string
	email: string
	fullName: string
	phone: string
	countryCode: string
	localPhone: string
	serviceId: string
	serviceName?: string
	websiteDescription: string
	budget: string
	deadline: string
	priceUsd?: number
	notify?: boolean
	ownerUserId?: string
}): Promise<boolean> {
	const catalog = SERVICE_CATALOG.find((item) => {
		return item.serviceId === input.serviceId
			|| item.name === input.serviceName
	})
	const email = input.email.trim().toLowerCase()
	let updated = false
	let notificationPayload: {
		bookingId: string
		clientName: string
		clientEmail: string
		serviceName: string
		changes: BookingEditChange[]
	} | null = null

	await enqueue(async () => {
		const bookings = await readFileBookings()
		const index = bookings.findIndex((booking) => {
			return booking.bookingId === input.bookingId
		})

		if (index >= 0) {
			const current = bookings[index]
			if (!clientCanEditBooking(current, {
				email,
				ownerUserId: input.ownerUserId,
			})) {
				return
			}

			const serviceName = catalog?.name
				?? input.serviceName
				?? current.serviceName
			const changes = collectBookingChanges(current, {
				fullName: input.fullName,
				phone: input.phone,
				serviceName,
				websiteDescription: input.websiteDescription,
				budget: input.budget,
				deadline: input.deadline,
			})

			bookings[index] = {
				...current,
				fullName: input.fullName,
				phone: input.phone,
				countryCode: input.countryCode,
				localPhone: input.localPhone,
				serviceId: input.serviceId || current.serviceId,
				serviceName,
				websiteDescription: input.websiteDescription,
				budget: input.budget,
				deadline: input.deadline,
				priceUsd: input.priceUsd
					?? catalog?.price
					?? current.priceUsd,
				editCount: (current.editCount ?? 0) + 1,
				wasEdited: true,
				lastEditedAt: new Date().toISOString(),
				websiteProgress: current.websiteProgress ?? 'not_started',
				ownerUserId: current.ownerUserId ?? input.ownerUserId,
				ownerEmail: current.ownerEmail ?? email,
			}
			await writeFileBookings(bookings)
			updated = true

			if (changes.length > 0 && input.notify !== false) {
				notificationPayload = {
					bookingId: current.bookingId,
					clientName: input.fullName,
					clientEmail: email,
					serviceName,
					changes,
				}
			}
			return
		}

		const serviceName = catalog?.name
			?? input.serviceName
			?? 'Website'
		const created: OfflineBooking = {
			bookingId: input.bookingId,
			fullName: input.fullName,
			email,
			phone: input.phone,
			countryCode: input.countryCode,
			localPhone: input.localPhone,
			serviceId: input.serviceId,
			serviceName,
			websiteDescription: input.websiteDescription,
			budget: input.budget,
			deadline: input.deadline,
			status: 'pending',
			createdAt: new Date().toISOString(),
			priceUsd: input.priceUsd ?? catalog?.price ?? 0,
			payments: [],
			editCount: 1,
			wasEdited: true,
			lastEditedAt: new Date().toISOString(),
			websiteProgress: 'not_started',
			ownerUserId: input.ownerUserId,
			ownerEmail: email,
			statusUpdatedAt: null,
		}
		bookings.unshift(created)
		await writeFileBookings(bookings)
		updated = true

		if (input.notify !== false) {
			notificationPayload = {
				bookingId: created.bookingId,
				clientName: input.fullName,
				clientEmail: email,
				serviceName,
				changes: [{
					field: 'Booking details',
					from: 'Previous submission',
					to: 'Updated by client',
				}],
			}
		}
	})

	if (notificationPayload) {
		await insertBookingEditNotification(notificationPayload)
	}

	return updated
}

/**
 * Removes one booking from the local booking file.
 */
export async function deleteOfflineBooking (
	bookingId: string,
): Promise<boolean> {
	let deleted = false

	await enqueue(async () => {
		const bookings = await readFileBookings()
		const next = bookings.filter((booking) => {
			return booking.bookingId !== bookingId
		})
		if (next.length === bookings.length) return
		await writeFileBookings(next)
		deleted = true
	})

	return deleted
}

/**
 * Sets website progress for one booking from the admin portal.
 * Creates a local copy when the booking only exists remotely.
 */
export async function updateOfflineWebsiteProgress (input: {
	bookingId: string
	websiteProgress: WebsiteProgress
	seed?: {
		fullName: string
		email: string
		phone: string | null
		serviceId: string
		serviceName: string
		websiteDescription: string
		budget?: string
		deadline?: string
		priceUsd?: number
		status?: BookingStatus
		createdAt?: string
	}
}): Promise<boolean> {
	let updated = false

	await enqueue(async () => {
		const bookings = await readFileBookings()
		const index = bookings.findIndex((booking) => {
			return booking.bookingId === input.bookingId
		})

		if (index >= 0) {
			bookings[index] = {
				...bookings[index],
				websiteProgress: input.websiteProgress,
				progressSetByAdmin: true,
				progressUpdatedAt: new Date().toISOString(),
			}
			await writeFileBookings(bookings)
			updated = true
			return
		}

		if (!input.seed) return

		bookings.unshift({
			bookingId: input.bookingId,
			fullName: input.seed.fullName,
			email: input.seed.email.trim().toLowerCase(),
			phone: input.seed.phone,
			serviceId: input.seed.serviceId,
			serviceName: input.seed.serviceName,
			websiteDescription: input.seed.websiteDescription,
			budget: input.seed.budget ?? '',
			deadline: input.seed.deadline ?? '',
			status: input.seed.status ?? 'pending',
			createdAt: input.seed.createdAt ?? new Date().toISOString(),
			priceUsd: input.seed.priceUsd ?? 0,
			payments: [],
			editCount: 0,
			wasEdited: false,
			lastEditedAt: null,
			websiteProgress: input.websiteProgress,
			progressSetByAdmin: true,
			progressUpdatedAt: new Date().toISOString(),
		})
		await writeFileBookings(bookings)
		updated = true
	})

	return updated
}

/**
 * Sets the admin booking status on the local copy the client reads.
 */
export async function updateOfflineBookingStatus (input: {
	bookingId: string
	status: BookingStatus
	seed?: {
		fullName: string
		email: string
		phone: string | null
		serviceId: string
		serviceName: string
		websiteDescription: string
		budget?: string
		deadline?: string
		priceUsd?: number
		createdAt?: string
		ownerUserId?: string
		ownerEmail?: string
	}
}): Promise<boolean> {
	let updated = false

	await enqueue(async () => {
		const bookings = await readFileBookings()
		const index = bookings.findIndex((booking) => {
			return booking.bookingId === input.bookingId
		})
		const statusUpdatedAt = new Date().toISOString()

		if (index >= 0) {
			bookings[index] = {
				...bookings[index],
				status: input.status,
				statusUpdatedAt,
			}
			await writeFileBookings(bookings)
			updated = true
			return
		}

		if (!input.seed) return

		bookings.unshift({
			bookingId: input.bookingId,
			fullName: input.seed.fullName,
			email: input.seed.email.trim().toLowerCase(),
			phone: input.seed.phone,
			serviceId: input.seed.serviceId,
			serviceName: input.seed.serviceName,
			websiteDescription: input.seed.websiteDescription,
			budget: input.seed.budget ?? '',
			deadline: input.seed.deadline ?? '',
			status: input.status,
			createdAt: input.seed.createdAt ?? statusUpdatedAt,
			priceUsd: input.seed.priceUsd ?? 0,
			payments: [],
			editCount: 0,
			wasEdited: false,
			lastEditedAt: null,
			websiteProgress: 'not_started',
			ownerUserId: input.seed.ownerUserId,
			ownerEmail: input.seed.ownerEmail?.trim().toLowerCase()
				?? input.seed.email.trim().toLowerCase(),
			statusUpdatedAt,
		})
		await writeFileBookings(bookings)
		updated = true
	})

	return updated
}

/**
 * Reads one offline booking by id.
 */
export async function getOfflineBooking (
	bookingId: string,
): Promise<OfflineBooking | null> {
	const bookings = await readFileBookings()
	return bookings.find((booking) => {
		return booking.bookingId === bookingId
	}) ?? null
}

/**
 * Offline bookings owned by this signed-in client.
 * Matches the account, the saved owner, or the contact email.
 */
export async function listOfflineBookingsForClient (input: {
	userId?: string
	email: string
}): Promise<OfflineBooking[]> {
	const email = input.email.trim().toLowerCase()
	const bookings = await readFileBookings()
	return bookings.filter((booking) => {
		return bookingBelongsToClient(booking, {
			userId: input.userId,
			email,
		})
	})
}

/**
 * Offline bookings for one client email.
 */
export async function listOfflineBookingsForEmail (
	email: string,
): Promise<OfflineBooking[]> {
	return listOfflineBookingsForClient({ email })
}

/**
 * Local bookings shaped like the admin dashboard cards.
 */
export async function listOfflineBookingCards ():
	Promise<AdminBookingCard[]> {
	const bookings = await readFileBookings()
	return bookings.map(toCard)
}

function toCard (booking: OfflineBooking): AdminBookingCard {
	const payments: AdminBookingPayment[] = booking.payments.map((payment) => {
		return {
			paymentId: payment.paymentId,
			amountUsd: payment.amountUsd,
			paidAt: payment.paidAt,
			note: payment.note,
		}
	})
	const amountPaid = roundUsd(payments.reduce((sum, payment) => {
		return sum + payment.amountUsd
	}, 0))

	return {
		bookingId: booking.bookingId,
		fullName: booking.fullName,
		email: booking.email,
		phone: booking.phone,
		serviceName: booking.serviceName,
		websiteDescription: booking.websiteDescription,
		budget: booking.budget ?? '',
		deadline: booking.deadline ?? '',
		status: booking.status,
		createdAt: booking.createdAt,
		priceUsd: booking.priceUsd,
		amountPaid,
		remainingBalance: getRemainingBalance(booking.priceUsd, amountPaid),
		paymentStatus: getPaymentStatus(booking.priceUsd, amountPaid),
		payments,
		editCount: booking.editCount ?? 0,
		wasEdited: booking.wasEdited === true,
		lastEditedAt: booking.lastEditedAt ?? null,
		websiteProgress: booking.websiteProgress ?? 'not_started',
		statusUpdatedAt: booking.statusUpdatedAt ?? null,
	}
}

function bookingBelongsToClient (
	booking: OfflineBooking,
	input: { userId?: string, email: string },
) {
	if (
		input.userId
		&& booking.ownerUserId
		&& booking.ownerUserId === input.userId
	) {
		return true
	}
	const ownerEmail = booking.ownerEmail?.trim().toLowerCase()
	if (ownerEmail && ownerEmail === input.email) return true
	return booking.email.trim().toLowerCase() === input.email
}

/**
 * A signed-in client may edit a booking they own.
 * Older rows have no owner yet, so the client who saves them claims them.
 */
function clientCanEditBooking (
	booking: OfflineBooking,
	input: { email: string, ownerUserId?: string },
) {
	if (bookingBelongsToClient(booking, {
		userId: input.ownerUserId,
		email: input.email,
	})) {
		return true
	}
	return !booking.ownerUserId && Boolean(input.ownerUserId)
}

function collectBookingChanges (
	current: OfflineBooking,
	next: {
		fullName: string
		phone: string
		serviceName: string
		websiteDescription: string
		budget: string
		deadline: string
	},
): BookingEditChange[] {
	const pairs: [string, string, string][] = [
		['Name', current.fullName, next.fullName],
		['Phone', current.phone ?? '', next.phone],
		['Service', current.serviceName, next.serviceName],
		[
			'Website details',
			current.websiteDescription,
			next.websiteDescription,
		],
		['Budget', current.budget ?? '', next.budget],
		['Deadline', current.deadline ?? '', next.deadline],
	]

	return pairs.flatMap(([field, from, to]) => {
		if (from.trim() === to.trim()) return []
		return [{ field, from: from || '—', to: to || '—' }]
	})
}
