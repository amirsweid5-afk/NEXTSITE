import { z } from 'zod'

/**
 * Builds the login form schema with localized error messages.
 */
export function createLoginSchema (copy: {
	emailError: string
	passwordError: string
}) {
	return z.object({
		email: z
			.string()
			.trim()
			.toLowerCase()
			.max(254)
			.pipe(z.email(copy.emailError)),
		password: z.string().min(8, copy.passwordError).max(72),
	})
}

export const loginInputSchema = z.object({
	email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
	password: z.string().min(8).max(72),
})

export type LoginInput = z.infer<typeof loginInputSchema>

/**
 * Builds the sign-in form schema with localized error messages.
 */
export function createSignInSchema (copy: {
	fullNameError: string
	emailError: string
	passwordError: string
	confirmPasswordError: string
}) {
	return z.object({
		fullName: z.string().trim().min(1, copy.fullNameError).max(120),
		email: z
			.string()
			.trim()
			.toLowerCase()
			.max(254)
			.pipe(z.email(copy.emailError)),
		password: z.string().min(8, copy.passwordError).max(72),
		confirmPassword: z.string().min(8, copy.passwordError).max(72),
	}).refine((values) => {
		return values.password === values.confirmPassword
	}, {
		message: copy.confirmPasswordError,
		path: ['confirmPassword'],
	})
}

export const signInInputSchema = z.object({
	fullName: z.string().trim().min(1).max(120),
	email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
	password: z.string().min(8).max(72),
	confirmPassword: z.string().min(8).max(72),
}).refine((values) => {
	return values.password === values.confirmPassword
}, {
	path: ['confirmPassword'],
})

export type SignInInput = z.infer<typeof signInInputSchema>

export interface AuthActionResult {
	ok: boolean
	error?: string
	needsConfirmation?: boolean
}

/**
 * Builds the account settings schema with localized errors.
 */
export function createAccountSettingsSchema (copy: {
	nameError: string
	phoneError: string
	passwordError: string
	confirmPasswordError: string
}) {
	return z.object({
		name: z.string().trim().min(1, copy.nameError).max(120),
		phone: z.string().trim().max(30).refine((value) => {
			return value === '' || /^[0-9+().\-\s]{6,30}$/.test(value)
		}, {
			message: copy.phoneError,
		}),
		currentPassword: z.string().max(72),
		newPassword: z.string().max(72),
		confirmPassword: z.string().max(72),
	}).superRefine((value, ctx) => {
		const isKeepingPassword = value.newPassword === ''
			&& value.confirmPassword === ''
		if (isKeepingPassword) return

		if (value.newPassword.length < 8) {
			ctx.addIssue({
				code: 'custom',
				path: ['newPassword'],
				message: copy.passwordError,
			})
		}
		if (value.newPassword !== value.confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				path: ['confirmPassword'],
				message: copy.confirmPasswordError,
			})
		}
	})
}
