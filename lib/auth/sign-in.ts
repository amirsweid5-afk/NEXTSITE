'use server'

import { redirect } from 'next/navigation'
import {
	signInInputSchema,
	type AuthActionResult,
} from '@/lib/auth/auth-schema'
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

	if (!data.session) {
		return {
			ok: true,
			needsConfirmation: true,
		}
	}

	redirect('/')
}
