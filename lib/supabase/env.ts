/**
 * Reads the public Supabase URL from the environment.
 */
export function getSupabaseUrl (): string {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL

	if (typeof url !== 'string' || url === '') {
		throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set.')
	}

	return url
}

/**
 * Reads the public Supabase key. Prefers the publishable key.
 */
export function getSupabasePublicKey (): string {
	const publishableKey =
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	if (
		typeof publishableKey === 'string' &&
		publishableKey !== ''
	) {
		return publishableKey
	}

	if (typeof anonKey === 'string' && anonKey !== '') {
		return anonKey
	}

	throw new Error(
		'Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.',
	)
}
