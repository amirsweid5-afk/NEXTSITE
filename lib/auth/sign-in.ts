'use server'

import { redirect } from 'next/navigation'
import {
	signInInputSchema,
	type AuthActionResult,
} from '@/lib/auth/auth-schema'
import { ensureAppUser } from '@/lib/auth/ensure-app-user'
import { createClient } from '@/lib/supabase/server'

/**
 * Creates a new account. Passwords are hashed by Supabase Auth.
 */
export async function signIn (
	input: unknown,
): Promise<AuthActionResult> {
	const parsed = signInInputSchema.safeParse(input)

	if (!parsed.success) {
		return {
			ok: false,
			error: 'Please check the form and try again.',
		}
	}

	const supabase = await createClient()
	const { data, error } = await supabase.auth.signUp({
		email: parsed.data.email,
		password: parsed.data.password,
		options: {
			data: {
				name: parsed.data.fullName,
			},
		},
	})

	if (error) {
		return {
			ok: false,
			error: error.message,
		}
	}

	const createdUser = data.user
	const isNewUser = (createdUser?.identities?.length ?? 0) > 0

	if (createdUser && isNewUser) {
		const profile = await ensureAppUser({
			id: createdUser.id,
			email: parsed.data.email,
			name: parsed.data.fullName,
		})

		if (!profile.ok) {
			return {
				ok: false,
				error: profile.error
					?? 'Could not create your account. Please try again.',
			}
		}
	}

	if (!data.session) {
		return {
			ok: true,
			needsConfirmation: true,
		}
	}

	redirect('/')
}
