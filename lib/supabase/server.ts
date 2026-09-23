import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type Database } from '@/lib/supabase/database'
import {
	getSupabasePublicKey,
	getSupabaseUrl,
} from '@/lib/supabase/env'

/**
 * Creates a request-scoped Supabase client for Server Components.
 */
export async function createClient () {
	const cookieStore = await cookies()

	return createServerClient<Database>(
		getSupabaseUrl(),
		getSupabasePublicKey(),
		{
			cookies: {
				getAll () {
					return cookieStore.getAll()
				},
				setAll (cookiesToSet, _headers) {
					try {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options)
						})
					} catch (err) {
						if (!(err instanceof Error)) {
							throw err
						}
					}
				},
			},
		},
	)
}
