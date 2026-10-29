'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import {
	readLocalSession,
	updateLocalAvatar,
	updateLocalProfile,
} from '@/lib/auth/local-accounts'
import { isProfilePhoto } from '@/lib/profile-photo'
import { createClient } from '@/lib/supabase/server'

export type AccountErrorCode =
	| 'name'
	| 'phone'
	| 'password-short'
	| 'password-current'
	| 'photo'
	| 'signed-out'
	| 'save'

export type AccountActionResult =
	| { ok: true }
	| { ok: false, error: AccountErrorCode }

const accountUpdateSchema = z.object({
	name: z.string().trim().min(1).max(120),
	phone: z.string().trim().max(30).refine((value) => {
		return value === '' || /^[0-9+().\-\s]{6,30}$/.test(value)
	}),
	currentPassword: z.string().max(72),
	newPassword: z.string().max(72),
}).superRefine((value, ctx) => {
	if (value.newPassword === '') return
	if (value.newPassword.length < 8) {
		ctx.addIssue({
			code: 'custom',
			path: ['newPassword'],
			message: 'password-short',
		})
	}
})

/**
 * Updates the signed-in name, phone, and password.
 */
export async function updateAccount (
	input: unknown,
): Promise<AccountActionResult> {
	const parsed = accountUpdateSchema.safeParse(input)
	if (!parsed.success) return { ok: false, error: issueCode(parsed.error) }

	const profile = await getCurrentProfile()
	if (!profile) return { ok: false, error: 'signed-out' }

	const local = await readLocalSession()
	const data = parsed.data

	if (local && local.userId === profile.userId) {
		const saved = await updateLocalProfile({
			userId: local.userId,
			name: data.name,
			phone: data.phone,
			currentPassword: data.currentPassword,
			newPassword: data.newPassword,
		})
		if (!saved.ok) return saved
		revalidatePath('/', 'layout')
		return { ok: true }
	}

	const saved = await updateRemoteProfile(
		profile.authUserId,
		profile.email,
		data,
	)
	if (!saved.ok) return saved
	revalidatePath('/', 'layout')
	return { ok: true }
}

/**
 * Saves or removes the signed-in profile photo.
 */
export async function updateAvatar (
	avatar: string | null,
): Promise<AccountActionResult> {
	if (avatar !== null && !isProfilePhoto(avatar)) {
		return { ok: false, error: 'photo' }
	}

	const profile = await getCurrentProfile()
	if (!profile) return { ok: false, error: 'signed-out' }

	const local = await readLocalSession()
	if (local && local.userId === profile.userId) {
		const saved = await updateLocalAvatar({
			userId: local.userId,
			avatar,
		})
		if (!saved.ok) return { ok: false, error: saved.error }
		revalidatePath('/', 'layout')
		return { ok: true }
	}

	try {
		const supabase = await createClient()
		const { error } = await withTimeout(
			supabase.auth.updateUser({
				data: { avatar: avatar ?? '' },
			}),
			4000,
		)
		if (error) return { ok: false, error: 'save' }
	} catch {
		return { ok: false, error: 'save' }
	}

	revalidatePath('/', 'layout')
	return { ok: true }
}

function issueCode (error: z.ZodError): AccountErrorCode {
	const issue = error.issues[0]
	if (!issue) return 'save'
	if (issue.path[0] === 'name') return 'name'
	if (issue.path[0] === 'phone') return 'phone'
	if (issue.message === 'password-short') return 'password-short'
	if (issue.message === 'password-current') return 'password-current'
	return 'save'
}

async function updateRemoteProfile (
	authUserId: string,
	email: string,
	input: {
		name: string
		phone: string
		currentPassword: string
		newPassword: string
	},
): Promise<AccountActionResult> {
	try {
		const supabase = await createClient()

		if (input.newPassword !== '') {
			if (input.currentPassword !== '') {
				const signed = await withTimeout(
					supabase.auth.signInWithPassword({
						email,
						password: input.currentPassword,
					}),
					4000,
				)
				if (signed.error || !signed.data.user) {
					return { ok: false, error: 'password-current' }
				}
			}

			const changed = await withTimeout(
				supabase.auth.updateUser({
					password: input.newPassword,
				}),
				4000,
			)
			if (changed.error) return { ok: false, error: 'save' }
		}

		const named = await withTimeout(
			supabase.auth.updateUser({
				data: { name: input.name },
			}),
			4000,
		)
		if (named.error) return { ok: false, error: 'save' }

		const saved = await withTimeout(
			Promise.resolve(supabase
				.from('users')
				.update({
					name: input.name,
					phone: input.phone === '' ? null : input.phone,
				})
				.eq('auth_user_id', authUserId)),
			4000,
		)
		if (!saved || saved.error) return { ok: false, error: 'save' }
		return { ok: true }
	} catch {
		return { ok: false, error: 'save' }
	}
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
