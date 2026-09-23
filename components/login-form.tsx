'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AuthScreen, AUTH_INPUT_CLASS } from '@/components/auth-screen'
import { useContent } from '@/components/language-provider'
import { PasswordField } from '@/components/password-field'
import { login } from '@/lib/auth/login'
import { createLoginSchema } from '@/lib/auth/auth-schema'

interface LoginFormValues {
	email: string
	password: string
}

/**
 * Email and password form for returning users.
 */
export function LoginForm () {
	const copy = useContent().auth
	const [saveError, setSaveError] = useState<string | null>(null)

	const schema = useMemo(() => {
		return createLoginSchema({
			emailError: copy.emailError,
			passwordError: copy.passwordError,
		})
	}, [copy.emailError, copy.passwordError])

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const isSubmitting = form.formState.isSubmitting
	const errors = form.formState.errors

	async function handleSubmit (values: LoginFormValues) {
		setSaveError(null)
		const result = await login(values)

		if (!result.ok) {
			setSaveError(result.error ?? copy.loginError)
		}
	}

	return (
		<AuthScreen
			eyebrow={copy.loginEyebrow}
			title={copy.loginTitle}
			description={copy.loginDescription}
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
						htmlFor="login-email"
						className="block text-sm font-medium text-white"
					>
						{copy.email}
					</label>
					<input
						id="login-email"
						type="email"
						autoComplete="email"
						placeholder={copy.emailPlaceholder}
						aria-invalid={errors.email ? true : undefined}
						aria-describedby={
							errors.email ? 'login-email-error' : undefined
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
							id="login-email-error"
							role="alert"
							className="mt-2 text-sm text-orange"
						>
							{errors.email.message}
						</p>
					) : null}
				</div>

				<div className="mt-6">
					<PasswordField
						id="login-password"
						label={copy.password}
						autoComplete="current-password"
						placeholder={copy.passwordPlaceholder}
						showLabel={copy.showPassword}
						hideLabel={copy.hidePassword}
						error={errors.password?.message}
						errorId="login-password-error"
						{...form.register('password')}
					/>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className={[
						'mt-8 inline-flex min-h-12 w-full',
						'items-center justify-center',
						'rounded-full bg-gold px-8',
						'text-sm font-semibold uppercase',
						'tracking-[0.18em] text-[#f7f4ef]',
						'transition duration-300 ease-out',
						'hover:bg-highlight hover:text-ink',
						'focus-visible:outline-2',
						'focus-visible:outline-offset-4',
						'disabled:cursor-not-allowed',
						'disabled:opacity-60',
					].join(' ')}
				>
					{isSubmitting
						? copy.loginSubmitting
						: copy.loginSubmit}
				</button>

				{saveError ? (
					<p
						role="alert"
						className="mt-4 text-center text-sm text-orange"
					>
						{saveError}
					</p>
				) : null}

				<p className="mt-6 text-center text-sm text-white/55">
					{copy.noAccount}{' '}
					<Link
						href="/sign-in"
						className="text-orange hover:text-highlight"
					>
						{copy.goSignIn}
					</Link>
				</p>
			</form>
		</AuthScreen>
	)
}
