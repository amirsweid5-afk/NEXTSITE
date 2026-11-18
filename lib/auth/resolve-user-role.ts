import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { type UserRole } from '@/lib/supabase/database'

/**
 * Emails listed in ADMIN_EMAILS always count as admins.
 */
export function adminEmailsFromEnv (): string[] {
	const raw = process.env.ADMIN_EMAILS ?? ''
	return raw
		.split(',')
		.map((email) => email.trim().toLowerCase())
		.filter((email) => email !== '')
}

/**
 * Resolves customer vs admin from env allow-list and Supabase.
 */
export async function resolveUserRole (
	email: string,
): Promise<UserRole> {
	const normalized = email.trim().toLowerCase()
	if (normalized === '') return 'customer'
	if (adminEmailsFromEnv().includes(normalized)) return 'admin'

	try {
		const admin = createAdminClient()
		const query = admin
			.from('users')
			.select('role')
			.eq('email', normalized)
			.maybeSingle()
		const pending = Promise.resolve(query)
		void pending.catch(() => undefined)
		let timer: ReturnType<typeof setTimeout> | undefined
		const timeout = new Promise<null>((resolve) => {
			timer = setTimeout(() => resolve(null), 1500)
		})
		const result = await Promise.race([pending, timeout])
		if (timer) clearTimeout(timer)
		if (!result || result.error || !result.data) return 'customer'
		return result.data.role === 'admin' ? 'admin' : 'customer'
	} catch {
		return 'customer'
	}
}
