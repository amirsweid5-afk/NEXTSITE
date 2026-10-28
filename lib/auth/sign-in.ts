'use server'

import { redirect } from 'next/navigation'
import {
	signInInputSchema,
	type AuthActionResult,
} from '@/lib/auth/auth-schema'
import { ensureAppUser } from '@/lib/auth/ensure-app-user'
import {
	createLocalAccount,
	startLocalSession,
} from '@/lib/auth/local-accounts'
import { isUnreachableError } from '@/lib/bookings/service-catalog'
import { createClient } from '@/lib/supabase/server'

/**
 * Creates a new account. Passwords are hashed by Supabase Auth.
 */
export async function signIn (
	input: unknown,
	nextPath?: string,
): Promise<AuthActionResult> {
	const parsed = signInInputSchema.safeParse(input)

	if (!parsed.success) {
		return {
			ok: false,
			error: 'Please check the form and try again.',
		}
	}

	const destination = safeNextPath(nextPath)

	try {
		const supabase = await createClient()
		const pending = supabase.auth.signUp({
			email: parsed.data.email,
			password: parsed.data.password,
			options: {
				data: {
					name: parsed.data.fullName,
				},
			},
		})
		const { data, error } = await withTimeout(pending, 5000)

		if (error) {
			if (!isUnreachableError(error)) {
				return { ok: false, error: error.message }
			}
		} else {
			return finishRemoteSignUp(data, parsed.data, destination)
		}
	} catch (err) {
		if (!isUnreachableError(err)) {
			const message = err instanceof Error
				? err.message
				: 'Could not create your account. Please try again.'
			return { ok: false, error: message }
		}
	}

	const created = await createLocalAccount({
		email: parsed.data.email,
		name: parsed.data.fullName,
		password: parsed.data.password,
	})
	if (!created.ok) {
		return { ok: false, error: created.error }
	}

	await startLocalSession(created.profile.userId)
	redirect(destination)
}

async function finishRemoteSignUp (
	data: {
		user: { id: string, identities?: unknown[] } | null
		session: unknown
	},
	input: { email: string, fullName: string },
	destination: string,
): Promise<AuthActionResult> {
	const createdUser = data.user
	const isNewUser = (createdUser?.identities?.length ?? 0) > 0

	if (createdUser && isNewUser) {
		const profile = await ensureAppUser({
			id: createdUser.id,
			email: input.email,
			name: input.fullName,
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

	redirect(destination)
}

function safeNextPath (value: string | undefined) {
	if (!value || !value.startsWith('/') || value.startsWith('//')) {
		return '/'
	}
	return value
}

function withTimeout<T> (work: Promise<T>, ms: number): Promise<T> {
	let timer: ReturnType<typeof setTimeout> | undefined
	const timeout = new Promise<never>((_, reject) => {
		timer = setTimeout(() => reject(new Error('timeout')), ms)
	})
	return Promise.race([work, timeout]).finally(() => {
		if (timer) clearTimeout(timer)
	})
}
