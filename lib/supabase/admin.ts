import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { type Database } from '@/lib/supabase/database'
import { getSupabaseUrl } from '@/lib/supabase/env'

/**
 * Creates a privileged server-only Supabase client.
 *
 * Never import this module into Client Components.
 */
export function createAdminClient () {
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

	if (
		typeof serviceRoleKey !== 'string' ||
		serviceRoleKey === ''
	) {
		throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set.')
	}

	return createClient<Database>(getSupabaseUrl(), serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	})
}
