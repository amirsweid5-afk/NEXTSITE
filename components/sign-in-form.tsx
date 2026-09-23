'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AuthScreen, AUTH_INPUT_CLASS } from '@/components/auth-screen'
import { useContent } from '@/components/language-provider'
import { PasswordField } from '@/components/password-field'
import { signIn } from '@/lib/auth/sign-in'
import { createSignInSchema } from '@/lib/auth/auth-schema'

interface SignInFormValues {
	fullName: string
	email: string
	password: string
	confirmPassword: string
}

/**
 * New-account form. Passwords are hashed by Supabase Auth.
 */
export function SignInForm () {
	const copy = useContent().auth
	const [saveError, setSaveError] = useState<string | null>(null)
	const [isConfirmed, setIsConfirmed] = useState(false)

	const schema = useMemo(() => {
		return createSignInSchema({
			fullNameError: copy.fullNameError,
			emailError: copy.emailError,
			passwordError: copy.passwordError,
			confirmPasswordError: copy.confirmPasswordError,
		})
	}, [
		copy.confirmPasswordError,
		copy.emailError,
		copy.fullNameError,
		copy.passwordError,
	])

	const form = useForm<SignInFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			fullName: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	})

	const isSubmitting = form.formState.isSubmitting
	const errors = form.formState.errors

	async function handleSubmit (values: SignInFormValues) {
		setSaveError(null)
		setIsConfirmed(false)

		const result = await signIn(values)

		if (!result.ok) {
			setSaveError(result.error ?? copy.signInError)
			return
		}

		if (result.needsConfirmation) {
			setIsConfirmed(true)
			form.reset()
		}
	}

	return (
		<AuthScreen
			eyebrow={copy.signInEyebrow}
			title={copy.signInTitle}
			description={copy.signInDescription}
		>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				noValidate
				className={[
					'mt-12 rounded-2xl border border-white/10',
					'bg-surface/80 p-6 sm:p-8',
					'shadow-[0_20px_50px_rgba(0,0,0,0.35)]',
				].join(' ')}
			>
				<div>
					<label
						htmlFor="sign-in-name"
						className="block text-sm font-medium text-white"
					>
						{copy.fullName}
					</label>
					<input
						id="sign-in-name"
						type="text"
						autoComplete="name"
						placeholder={copy.fullNamePlaceholder}
						aria-invalid={
							errors.fullName ? true : undefined
						}
						aria-describedby={
							errors.fullName
								? 'sign-in-name-error'
								: undefined
						}
						className={[
							AUTH_INPUT_CLASS,
							'mt-2',
							errors.fullName
								? 'border-orange/70'
								: 'border-white/10',
						].join(' ')}
						{...form.register('fullName')}
					/>
					{errors.fullName ? (
						<p
							id="sign-in-name-error"
							role="alert"
							className="mt-2 text-sm text-orange"
						>
							{errors.fullName.message}
						</p>
					) : null}
				</div>

				<div className="mt-6">
					<label
						htmlFor="sign-in-email"
						className="block text-sm font-medium text-white"
					>
						{copy.email}
					</label>
					<input
						id="sign-in-email"
						type="email"
						autoComplete="email"
						placeholder={copy.emailPlaceholder}
						aria-invalid={errors.email ? true : undefined}
						aria-describedby={
							errors.email
								? 'sign-in-email-error'
								: undefined
						}
						className={[
							AUTH_INPUT_CLASS,
							'mt-2',
							errors.email
								? 'border-orange/70'
								: 'border-white/10',
						].join(' ')}
						{...form.register('email')}
					/>
					{errors.email ? (
						<p
							id="sign-in-email-error"
							role="alert"
							className="mt-2 text-sm text-orange"
						>
							{errors.email.message}
						</p>
					) : null}
				</div>

				<div className="mt-6">
					<PasswordField
						id="sign-in-password"
						label={copy.password}
						autoComplete="new-password"
						placeholder={copy.passwordPlaceholder}
						showLabel={copy.showPassword}
						hideLabel={copy.hidePassword}
						error={errors.password?.message}
						errorId="sign-in-password-error"
						{...form.register('password')}
					/>
				</div>

				<div className="mt-6">
					<PasswordField
						id="sign-in-confirm-password"
						label={copy.confirmPassword}
						autoComplete="new-password"
						placeholder={
							copy.confirmPasswordPlaceholder
						}
						showLabel={copy.showPassword}
						hideLabel={copy.hidePassword}
						error={errors.confirmPassword?.message}
						errorId="sign-in-confirm-password-error"
						{...form.register('confirmPassword')}
					/>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className={[
						'mt-8 inline-flex min-h-12 w-full',
						'items-center justify-center',
						'rounded-full border border-white/10',
						'bg-[#010203] px-8',
						'text-sm font-semibold uppercase',
						'tracking-[0.18em] text-[#f7f4ef]',
						'transition duration-300 ease-out',
						'hover:border-white/25 hover:bg-stone',
						'focus-visible:outline-2',
						'focus-visible:outline-offset-4',
						'disabled:cursor-not-allowed',
						'disabled:opacity-60',
					].join(' ')}
				>
					{isSubmitting
						? copy.signInSubmitting
						: copy.signInSubmit}
				</button>

				{saveError ? (
					<p
						role="alert"
						className="mt-4 text-center text-sm text-orange"
					>
						{saveError}
					</p>
				) : null}

				{isConfirmed ? (
					<p
						role="status"
						className="mt-4 text-center text-sm leading-6 text-highlight"
					>
						{copy.checkEmail}
					</p>
				) : null}

				<p className="mt-6 text-center text-sm text-white/55">
					{copy.hasAccount}{' '}
					<Link
						href="/login"
						className="text-gold hover:text-highlight"
					>
						{copy.goLogin}
					</Link>
				</p>
			</form>
		</AuthScreen>
	)
}
