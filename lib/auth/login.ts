'use server'

import {
	loginInputSchema,
	type AuthActionResult,
} from '@/lib/auth/auth-schema'
import { ensureAppUser } from '@/lib/auth/ensure-app-user'
import {
	startLocalSession,
	verifyLocalAccount,
} from '@/lib/auth/local-accounts'
import { createClient } from '@/lib/supabase/server'

/**
 * Signs an existing user in with email and password.
 */
export async function login (
	input: unknown,
	nextPath?: string,
): Promise<AuthActionResult> {
	const parsed = loginInputSchema.safeParse(input)

	if (!parsed.success) {
		return {
			ok: false,
			error: 'Please check the form and try again.',
		}
	}

	const destination = safeNextPath(nextPath)
	const local = await verifyLocalAccount(
		parsed.data.email,
		parsed.data.password,
	)

	if (local) {
		await startLocalSession(local.userId)
		return {
			ok: true,
			redirectTo: local.role === 'admin' ? '/admin' : destination,
		}
	}

	try {
		const supabase = await createClient()
		const { data, error } = await withTimeout(
			supabase.auth.signInWithPassword({
				email: parsed.data.email,
				password: parsed.data.password,
			}),
			5000,
		)

		if (!error && data.user?.email) {
			return finishRemoteLogin(data.user, destination)
		}
	} catch {
		return {
			ok: false,
			error: 'Invalid email or password.',
		}
	}

	return {
		ok: false,
		error: 'Invalid email or password.',
	}
}

async function finishRemoteLogin (
	user: {
		id: string
		email?: string
		user_metadata?: Record<string, unknown>
	},
	destination: string,
): Promise<AuthActionResult> {
	if (!user.email) {
		return {
			ok: false,
			error: 'Invalid email or password.',
		}
	}

	const metadataName = user.user_metadata?.name
	const name = typeof metadataName === 'string' && metadataName !== ''
		? metadataName
		: user.email.split('@')[0]

	const profile = await ensureAppUser({
		id: user.id,
		email: user.email,
		name,
	})

	if (!profile.ok) {
		return {
			ok: false,
			error: profile.error
				?? 'Could not open your account. Please try again.',
		}
	}

	return {
		ok: true,
		redirectTo: destination,
	}
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
