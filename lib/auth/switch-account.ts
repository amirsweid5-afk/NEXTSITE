'use server'

import { redirect } from 'next/navigation'
import { endLocalSession } from '@/lib/auth/local-accounts'
import { createClient } from '@/lib/supabase/server'

/**
 * Signs out the current account and opens login or sign-in.
 */
export async function switchAccount (destination: string) {
	const path = destination === 'sign-in'
		? '/sign-in'
		: destination === 'home'
			? '/'
			: '/login'

	try {
		const supabase = await createClient()
		await withTimeout(supabase.auth.signOut(), 3000)
	} catch {
		// The local session is cleared either way.
	}

	await endLocalSession()
	redirect(path)
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
