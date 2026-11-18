import 'server-only'

import {
	readLocalSession,
	setLocalAccountRole,
} from '@/lib/auth/local-accounts'
import { resolveUserRole } from '@/lib/auth/resolve-user-role'
import { isProfilePhoto } from '@/lib/profile-photo'
import { createClient } from '@/lib/supabase/server'
import { type UserRole } from '@/lib/supabase/database'

export interface CurrentProfile {
	userId: string
	authUserId: string
	name: string
	email: string
	phone: string
	avatar: string | null
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
	const local = await readLocalProfile()
	if (local) return local
	return loadRemoteProfile()
}

/**
 * Loads a Supabase Auth profile when that session can be reached.
 */
async function loadRemoteProfile (): Promise<CurrentProfile | null> {
	const supabase = await createClient()
	const auth = await Promise.race([
		supabase.auth.getUser().catch(() => null),
		new Promise<null>((resolve) => {
			setTimeout(() => resolve(null), 2000)
		}),
	])
	const user = auth?.data.user

	if (!user?.email) return null

	const profileQuery = supabase
		.from('users')
		.select('user_id, auth_user_id, name, email, phone, role')
		.eq('auth_user_id', user.id)
		.maybeSingle()
	const profileResult = await Promise.race([
		Promise.resolve(profileQuery).catch(() => null),
		new Promise<null>((resolve) => {
			setTimeout(() => resolve(null), 2000)
		}),
	])

	if (profileResult && !profileResult.error && profileResult.data) {
		const profile = profileResult.data
		if (profile.auth_user_id) {
			const role = profile.role === 'admin'
				? 'admin'
				: await resolveUserRole(profile.email)
			return {
				userId: profile.user_id,
				authUserId: profile.auth_user_id,
				name: profile.name,
				email: profile.email,
				phone: profile.phone ?? '',
				avatar: readAvatar(user.user_metadata),
				role,
				isAdmin: role === 'admin',
			}
		}
	}

	const metadataName = user.user_metadata?.name
	const name = typeof metadataName === 'string' && metadataName !== ''
		? metadataName
		: user.email.split('@')[0]
	const role = await resolveUserRole(user.email)

	return {
		userId: user.id,
		authUserId: user.id,
		name,
		email: user.email,
		phone: '',
		avatar: readAvatar(user.user_metadata),
		role,
		isAdmin: role === 'admin',
	}
}

function readAvatar (metadata: unknown): string | null {
	if (typeof metadata !== 'object' || metadata === null) return null
	if (!('avatar' in metadata)) return null
	return isProfilePhoto(metadata.avatar) ? metadata.avatar : null
}

async function readLocalProfile (): Promise<CurrentProfile | null> {
	const local = await readLocalSession()
	if (!local) return null

	const role = local.role === 'admin'
		? 'admin'
		: await resolveUserRole(local.email)

	if (role !== local.role) {
		await setLocalAccountRole(local.email, role)
	}

	return {
		userId: local.userId,
		authUserId: local.userId,
		name: local.name,
		email: local.email,
		phone: local.phone,
		avatar: local.avatar,
		role,
		isAdmin: role === 'admin',
	}
}
