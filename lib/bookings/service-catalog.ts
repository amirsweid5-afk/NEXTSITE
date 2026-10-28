import { type BookingServiceOption } from '@/lib/bookings/booking-schema'

export const SERVICE_CATALOG: BookingServiceOption[] = [
	{
		serviceId: '6f1c0a2e-7b44-4c1a-9d2e-1a0b8c7d6e51',
		name: 'Landing Page',
		price: 200,
		slug: 'landing-page',
	},
	{
		serviceId: '7a2d1b3f-8c55-4d2b-ae3f-2b1c9d8e7f62',
		name: 'Static Website',
		price: 300,
		slug: 'static-website',
	},
	{
		serviceId: '8b3e2c40-9d66-4e3c-bf40-3c2d0e9f8063',
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
