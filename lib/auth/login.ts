'use server'

import { redirect } from 'next/navigation'
import {
	loginInputSchema,
	type AuthActionResult,
} from '@/lib/auth/auth-schema'
import { ensureAppUser } from '@/lib/auth/ensure-app-user'
import { createClient } from '@/lib/supabase/server'

/**
 * Signs an existing user in with email and password.
 */
export async function login (
	input: unknown,
): Promise<AuthActionResult> {
	const parsed = loginInputSchema.safeParse(input)

	if (!parsed.success) {
		return {
			ok: false,
			error: 'Please check the form and try again.',
		}
	}

	const supabase = await createClient()
	const { data, error } = await supabase.auth.signInWithPassword({
		email: parsed.data.email,
		password: parsed.data.password,
	})

	if (error || !data.user?.email) {
		return {
			ok: false,
			error: 'Invalid email or password.',
		}
	}

	const metadataName = data.user.user_metadata?.name
	const name = typeof metadataName === 'string' && metadataName !== ''
		? metadataName
		: data.user.email.split('@')[0]

	const profile = await ensureAppUser({
		id: data.user.id,
		email: data.user.email,
		name,
	})

	if (!profile.ok) {
		return {
			ok: false,
			error: profile.error
				?? 'Could not open your account. Please try again.',
		}
	}

	redirect('/')
}
