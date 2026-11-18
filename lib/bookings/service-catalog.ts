import { type BookingServiceOption } from '@/lib/bookings/booking-schema'

export const SERVICE_CATALOG: BookingServiceOption[] = [
	{
		serviceId: 'e78f42ee-68d1-4bb0-aedb-4c573eeed631',
		name: 'Landing Page',
		price: 200,
		slug: 'landing-page',
	},
	{
		serviceId: '4b1aeb93-8f9c-4f0d-ad75-e81699c447be',
		name: 'Static Website',
		price: 300,
		slug: 'static-website',
	},
	{
		serviceId: 'd2788c95-73a2-4e9c-8791-0a8d4e04053b',
		name: 'Personal Website',
		price: 250,
		slug: 'personal-website',
	},
]

/**
 * Maps a service name to the slug used by booking links.
 */
export function serviceSlug (name: string): string {
	const normalized = name.toLowerCase()
	if (normalized.includes('landing')) return 'landing-page'
	if (normalized.includes('static')) return 'static-website'
	if (normalized.includes('personal')) return 'personal-website'
	return normalized
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
}

/**
 * True when a host or request never reached the database.
 */
export function isUnreachableError (err: unknown): boolean {
	if (!(err instanceof Error)) return false
	if (err.name === 'AbortError') return true
	const cause = err.cause
	const code = cause && typeof cause === 'object' && 'code' in cause
		? String(cause.code)
		: ''
	const text = `${err.message} ${code}`
	return /fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|network|aborted|timeout|getaddrinfo/i
		.test(text)
}

/**
 * True when a client error message means the database was unreachable.
 */
export function isUnreachableMessage (message: string): boolean {
	return isUnreachableError(new Error(message))
}

/**
 * True when the query failed before a database error code came back.
 */
export function isOfflineClientError (error: {
	message?: string
	code?: string
	details?: string | null
}): boolean {
	const text = `${error.message ?? ''} ${error.details ?? ''}`
	if (isUnreachableMessage(text)) return true
	return !error.code
}
