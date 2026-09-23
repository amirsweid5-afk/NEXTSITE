'use server'

import { redirect } from 'next/navigation'
import {
	loginInputSchema,
	type AuthActionResult,
} from '@/lib/auth/auth-schema'
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
	const { error } = await supabase.auth.signInWithPassword({
		email: parsed.data.email,
		password: parsed.data.password,
	})

	if (error) {
		return {
			ok: false,
			error: 'Invalid email or password.',
		}
	}

	redirect('/')
}
