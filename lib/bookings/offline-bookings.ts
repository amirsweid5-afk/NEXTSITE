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
import { SERVICE_CATALOG } from '@/lib/bookings/service-catalog'
import { type BookingStatus } from '@/lib/supabase/database'

interface OfflinePayment {
	paymentId: string
	amountUsd: number
	paidAt: string
	note: string | null
}

interface OfflineBooking {
	bookingId: string
	fullName: string
	email: string
	phone: string | null
	serviceName: string
	websiteDescription: string
	status: BookingStatus
	createdAt: string
	priceUsd: number
	payments: OfflinePayment[]
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
 * Saves a booking when the remote database cannot be reached.
 */
export async function insertOfflineBooking (input: {
	fullName: string
	email: string
	phone: string
	serviceId: string
	websiteDescription: string
}): Promise<string | null> {
	const service = SERVICE_CATALOG.find((item) => {
		return item.serviceId === input.serviceId
	})
	if (!service) return null

	const booking: OfflineBooking = {
		bookingId: crypto.randomUUID(),
		fullName: input.fullName,
		email: input.email,
		phone: input.phone,
		serviceName: service.name,
		websiteDescription: input.websiteDescription,
		status: 'pending',
		createdAt: new Date().toISOString(),
		priceUsd: service.price,
		payments: [],
	}

	await enqueue(async () => {
		const bookings = await readFileBookings()
		bookings.unshift(booking)
		await writeFileBookings(bookings)
	})

	return booking.bookingId
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
		status: booking.status,
		createdAt: booking.createdAt,
		priceUsd: booking.priceUsd,
		amountPaid,
		remainingBalance: getRemainingBalance(booking.priceUsd, amountPaid),
		paymentStatus: getPaymentStatus(booking.priceUsd, amountPaid),
		payments,
	}
}
