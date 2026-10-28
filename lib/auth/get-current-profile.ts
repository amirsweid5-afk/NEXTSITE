import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { type UserRole } from '@/lib/supabase/database'

export interface CurrentProfile {
	userId: string
	authUserId: string
	name: string
	email: string
	role: UserRole
	isAdmin: boolean
}

/**
 * Returns the signed-in app profile, or null when there is no session.
 */
export async function getCurrentProfile (): Promise<CurrentProfile | null> {
	try {
		return await loadProfile()
	} catch {
		return null
	}
}

/**
 * Loads the profile, and gives up quickly if auth cannot be reached.
 */
async function loadProfile (): Promise<CurrentProfile | null> {
	const supabase = await createClient()
	const auth = await Promise.race([
		supabase.auth.getUser().catch(() => null),
		new Promise<null>((resolve) => {
			setTimeout(() => resolve(null), 2000)
		}),
	])
	const user = auth?.data.user

	if (!user) {
		return null
	}

	const profileQuery = supabase
		.from('users')
		.select('user_id, auth_user_id, name, email, role')
		.eq('auth_user_id', user.id)
		.maybeSingle()
	const profileResult = await Promise.race([
		Promise.resolve(profileQuery).catch(() => null),
		new Promise<null>((resolve) => {
			setTimeout(() => resolve(null), 2000)
		}),
	])

	if (!profileResult || profileResult.error || !profileResult.data) {
		return null
	}

	const profile = profileResult.data

	if (!profile.auth_user_id) {
		return null
	}

	return {
		userId: profile.user_id,
		authUserId: profile.auth_user_id,
		name: profile.name,
		email: profile.email,
		role: profile.role,
		isAdmin: profile.role === 'admin',
	}
}
