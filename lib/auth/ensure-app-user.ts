import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

interface EnsureAppUserInput {
	id: string
	email: string
	name: string
}

interface EnsureAppUserResult {
	ok: boolean
	error?: string
}

/**
 * Makes sure a Supabase Auth user has a public.users profile.
 */
export async function ensureAppUser (
	input: EnsureAppUserInput,
): Promise<EnsureAppUserResult> {
	const email = input.email.trim().toLowerCase()
	const name = input.name.trim()

	if (email === '' || name === '') {
		return {
			ok: false,
			error: 'Could not save your profile.',
		}
	}

	try {
		const admin = createAdminClient()
		const { data: existing, error: existingError } = await admin
			.from('users')
			.select('user_id, auth_user_id')
			.eq('email', email)
			.maybeSingle()

		if (existingError) {
			return { ok: false, error: existingError.message }
		}

		if (existing) {
			if (existing.auth_user_id === input.id) {
				return { ok: true }
			}

			const { error: updateError } = await admin
				.from('users')
				.update({
					auth_user_id: input.id,
					name,
				})
				.eq('user_id', existing.user_id)

			if (updateError) {
				return { ok: false, error: updateError.message }
			}

			return { ok: true }
		}

		const { error: insertError } = await admin
			.from('users')
			.insert({
				user_id: input.id,
				auth_user_id: input.id,
				name,
				email,
				role: 'customer',
			})

		if (insertError) {
			if (insertError.code === '23505') {
				return { ok: true }
			}

			return { ok: false, error: insertError.message }
		}

		return { ok: true }
	} catch (error) {
		const message = error instanceof Error
			? error.message
			: 'Could not save your profile.'

		return { ok: false, error: message }
	}
}
