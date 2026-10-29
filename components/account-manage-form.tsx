'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AUTH_INPUT_CLASS } from '@/components/auth-screen'
import { PasswordField } from '@/components/password-field'
import { useContent } from '@/components/language-provider'
import {
	updateAccount,
	type AccountErrorCode,
} from '@/lib/auth/account-actions'
import { createAccountSettingsSchema } from '@/lib/auth/auth-schema'
import { type AccountPanelContent } from '@/lib/site-content'

interface AccountSettingsValues {
	name: string
	phone: string
	currentPassword: string
	newPassword: string
	confirmPassword: string
}

interface AccountManageFormProps {
	name: string
	phone: string
	onBack: () => void
	onSaved: (profile: { name: string, phone: string }) => void
}

/**
 * Name, phone, and password fields inside the account sidebar.
 */
export function AccountManageForm ({
	name,
	phone,
	onBack,
	onSaved,
}: AccountManageFormProps) {
	const content = useContent()
	const copy = content.accountPanel
	const router = useRouter()
	const [saveError, setSaveError] = useState<string | null>(null)
	const [isSaved, setIsSaved] = useState(false)

	const schema = useMemo(() => {
		return createAccountSettingsSchema({
			nameError: copy.nameError,
			phoneError: copy.phoneError,
			passwordError: copy.passwordError,
			confirmPasswordError: copy.confirmPasswordError,
		})
	}, [
		copy.nameError,
		copy.phoneError,
		copy.passwordError,
		copy.confirmPasswordError,
	])

	const form = useForm<AccountSettingsValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name,
			phone,
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	})

	const isSubmitting = form.formState.isSubmitting
	const errors = form.formState.errors

	async function handleSubmit (values: AccountSettingsValues) {
		setSaveError(null)
		setIsSaved(false)
		const result = await updateAccount({
			name: values.name,
			phone: values.phone,
			currentPassword: values.currentPassword,
			newPassword: values.newPassword,
		})

		if (!result.ok) {
			const message = messageFor(copy, result.error)
			if (result.error === 'name') {
				form.setError('name', { message })
			} else if (result.error === 'phone') {
				form.setError('phone', { message })
			} else if (result.error === 'password-current') {
				form.setError('currentPassword', { message })
			} else if (result.error === 'password-short') {
				form.setError('newPassword', { message })
			} else {
				setSaveError(message)
			}
			return
		}

		form.reset({
			name: values.name,
			phone: values.phone,
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		})
		onSaved({ name: values.name, phone: values.phone })
		setIsSaved(true)
		router.refresh()
	}

	return (
		<form
			onSubmit={form.handleSubmit(handleSubmit)}
			noValidate
			className="flex flex-col gap-5"
		>
			<button
				type="button"
				onClick={onBack}
				className={[
					'inline-flex items-center gap-2',
					'text-xs font-semibold uppercase',
					'tracking-[0.16em] text-white/55',
					'focus-visible:outline-2',
					'focus-visible:outline-offset-4',
				].join(' ')}
			>
				<BackIcon />
				{copy.back}
			</button>

			{saveError ? (
				<p role="alert" className="text-sm text-orange">
					{saveError}
				</p>
			) : null}
			{isSaved ? (
				<p role="status" className="text-sm text-highlight">
					{copy.saved}
				</p>
			) : null}

			<div>
				<label
					htmlFor="account-name"
					className="block text-sm font-medium text-white"
				>
					{copy.name}
				</label>
				<input
					id="account-name"
					type="text"
					autoComplete="name"
					aria-invalid={errors.name ? true : undefined}
					aria-describedby={
						errors.name ? 'account-name-error' : undefined
					}
					className={[
						AUTH_INPUT_CLASS,
						'mt-2',
						errors.name
							? 'border-orange/70'
							: 'border-white/10',
					].join(' ')}
					{...form.register('name')}
				/>
				{errors.name ? (
					<p
						id="account-name-error"
						role="alert"
						className="mt-2 text-sm text-orange"
					>
						{errors.name.message}
					</p>
				) : null}
			</div>

			<div>
				<label
					htmlFor="account-phone"
					className="block text-sm font-medium text-white"
				>
					{copy.phone}
				</label>
				<input
					id="account-phone"
					type="tel"
					autoComplete="tel"
					placeholder={copy.phonePlaceholder}
					aria-invalid={errors.phone ? true : undefined}
					aria-describedby={
						errors.phone ? 'account-phone-error' : undefined
					}
					className={[
						AUTH_INPUT_CLASS,
						'mt-2',
						errors.phone
							? 'border-orange/70'
							: 'border-white/10',
					].join(' ')}
					{...form.register('phone')}
				/>
				{errors.phone ? (
					<p
						id="account-phone-error"
						role="alert"
						className="mt-2 text-sm text-orange"
					>
						{errors.phone.message}
					</p>
				) : null}
			</div>

			<PasswordField
				id="account-current-password"
				label={copy.currentPassword}
				autoComplete="current-password"
				error={errors.currentPassword?.message}
				errorId="account-current-password-error"
				showLabel={content.auth.showPassword}
				hideLabel={content.auth.hidePassword}
				{...form.register('currentPassword')}
			/>
			<PasswordField
				id="account-new-password"
				label={copy.newPassword}
				autoComplete="new-password"
				error={errors.newPassword?.message}
				errorId="account-new-password-error"
				showLabel={content.auth.showPassword}
				hideLabel={content.auth.hidePassword}
				{...form.register('newPassword')}
			/>
			<PasswordField
				id="account-confirm-password"
				label={copy.confirmPassword}
				autoComplete="new-password"
				error={errors.confirmPassword?.message}
				errorId="account-confirm-password-error"
				showLabel={content.auth.showPassword}
				hideLabel={content.auth.hidePassword}
				{...form.register('confirmPassword')}
			/>
			<p className="text-sm text-white/45">
				{copy.passwordHint}
			</p>

			<button
				type="submit"
				disabled={isSubmitting}
				className={[
					'inline-flex min-h-12 items-center',
					'justify-center rounded-full',
					'bg-gold px-5 text-xs font-semibold',
					'uppercase tracking-[0.16em] text-white',
					'transition duration-300',
					'hover:bg-highlight hover:text-ink',
					'focus-visible:outline-2',
					'focus-visible:outline-offset-4',
					'disabled:opacity-60',
				].join(' ')}
			>
				{isSubmitting ? copy.saving : copy.save}
			</button>
		</form>
	)
}

function messageFor (
	copy: AccountPanelContent,
	error: AccountErrorCode,
) {
	if (error === 'name') return copy.nameError
	if (error === 'phone') return copy.phoneError
	if (error === 'password-short') return copy.passwordError
	if (error === 'password-current') return copy.currentPasswordError
	if (error === 'signed-out') return copy.signedOut
	return copy.saveError
}

function BackIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-4 w-4 rtl:rotate-180"
		>
			<path
				d="M15 6 9 12l6 6"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
