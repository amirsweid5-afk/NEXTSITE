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
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return null
	}

	const { data: profile, error } = await supabase
		.from('users')
		.select('user_id, auth_user_id, name, email, role')
		.eq('auth_user_id', user.id)
		.maybeSingle()

	if (error || !profile || !profile.auth_user_id) {
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
