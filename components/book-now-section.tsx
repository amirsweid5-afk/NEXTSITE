'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useContent } from '@/components/language-provider'
import { PhoneCountryField } from '@/components/phone-country-field'
import { createBooking } from '@/lib/bookings/create-booking'
import {
	createBookingSchema,
	type BookingServiceOption,
} from '@/lib/bookings/booking-schema'
import { DEFAULT_PHONE_COUNTRY } from '@/lib/phone/countries'

interface BookNowSectionProps {
	services: BookingServiceOption[]
	initialServiceId?: string
	isSignedIn?: boolean
	returnPath?: string
}

interface BookingFormValues {
	fullName: string
	email: string
	countryCode: string
	phone: string
	serviceId: string
	websiteDescription: string
	budget: string
	deadline: string
}

/**
 * Booking form that saves to the database and shows a confirmation.
 */
export function BookNowSection ({
	services,
	initialServiceId = '',
	isSignedIn = false,
	returnPath = '/booking',
}: BookNowSectionProps) {
	const copy = useContent().booking.form
	const [isConfirmed, setIsConfirmed] = useState(false)
	const [saveError, setSaveError] = useState<string | null>(null)

	const schema = useMemo(() => {
		return createBookingSchema({
			fullNameError: copy.fullNameError,
			emailError: copy.emailError,
			phoneError: copy.phoneError,
			countryError: copy.countryError,
			serviceError: copy.serviceError,
			websiteError: copy.websiteError,
			budgetError: copy.budgetError,
			deadlineError: copy.deadlineError,
		})
	}, [
		copy.budgetError,
		copy.countryError,
		copy.deadlineError,
		copy.emailError,
		copy.fullNameError,
		copy.phoneError,
		copy.serviceError,
		copy.websiteError,
	])

	const form = useForm<BookingFormValues>({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: {
			fullName: '',
			email: '',
			countryCode: DEFAULT_PHONE_COUNTRY.code,
			phone: '',
			serviceId: initialServiceId,
			websiteDescription: '',
			budget: '',
			deadline: '',
		},
	})

	const isSubmitting = form.formState.isSubmitting
	const isValid = form.formState.isValid
	const errors = form.formState.errors
	const hasServices = services.length > 0
	const canSubmit = isSignedIn && !isSubmitting
	const authNext = encodeURIComponent(returnPath)

	async function handleSubmit (values: BookingFormValues) {
		if (!isSignedIn) return
		setIsConfirmed(false)
		setSaveError(null)

		const result = await createBooking(values)

		if (!result.ok) {
			setSaveError(result.error ?? copy.saveError)
			return
		}

		setIsConfirmed(true)
		form.reset({
			fullName: '',
			email: '',
			countryCode: DEFAULT_PHONE_COUNTRY.code,
			phone: '',
			serviceId: '',
			websiteDescription: '',
			budget: '',
			deadline: '',
		})
	}

	const inputClassName = [
		'w-full rounded-xl border bg-ink/60',
		'px-4 py-3 text-sm text-white',
		'placeholder:text-white/35',
		'transition duration-300',
		'focus:border-orange/60 focus:bg-ink/80',
		'focus-visible:outline-2 focus-visible:outline-offset-2',
	].join(' ')

	return (
		<section
			id="book-now"
			aria-labelledby="book-now-heading"
			className={[
				'relative isolate overflow-hidden',
				'border-t border-white/10 bg-transparent',
				'py-20 sm:py-24 lg:py-28',
			].join(' ')}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
			>
				<div className="absolute left-1/2 top-0 h-px w-[min(72%,40rem)] -translate-x-1/2 bg-linear-to-r from-transparent via-orange/40 to-transparent" />
				<div className="absolute -left-20 top-16 h-64 w-64 rounded-full bg-orange/10 blur-[100px]" />
				<div className="absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-gold/10 blur-[90px]" />
			</div>

			<div className="relative z-10 mx-auto max-w-2xl px-6 sm:px-10 lg:px-12">
				<div className="text-center">
					<p className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
						{copy.eyebrow}
					</p>
					<h2
						id="book-now-heading"
						className={[
							'mt-4 text-3xl font-semibold',
							'tracking-tight text-white',
							'sm:text-4xl',
						].join(' ')}
					>
						{copy.title}
					</h2>
					<p className="mt-4 text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
						{copy.description}
					</p>
				</div>

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
							htmlFor="full-name"
							className="block text-sm font-medium text-white"
						>
							{copy.fullName}
						</label>
						<input
							id="full-name"
							type="text"
							autoComplete="name"
							placeholder={copy.fullNamePlaceholder}
							aria-invalid={
								errors.fullName ? true : undefined
							}
							aria-describedby={
								errors.fullName
									? 'full-name-error'
									: undefined
							}
							className={[
								inputClassName,
								'mt-2',
								errors.fullName
									? 'border-orange/70'
									: 'border-white/10',
							].join(' ')}
							{...form.register('fullName')}
						/>
						{errors.fullName ? (
							<p
								id="full-name-error"
								role="alert"
								className="mt-2 text-sm text-orange"
							>
								{errors.fullName.message}
							</p>
						) : null}
					</div>

					<div className="mt-6">
						<label
							htmlFor="email"
							className="block text-sm font-medium text-white"
						>
							{copy.email}
						</label>
						<input
							id="email"
							type="email"
							autoComplete="email"
							placeholder={copy.emailPlaceholder}
							aria-invalid={
								errors.email ? true : undefined
							}
							aria-describedby={
								errors.email ? 'email-error' : undefined
							}
							className={[
								inputClassName,
								'mt-2',
								errors.email
									? 'border-orange/70'
									: 'border-white/10',
							].join(' ')}
							{...form.register('email')}
						/>
						{errors.email ? (
							<p
								id="email-error"
								role="alert"
								className="mt-2 text-sm text-orange"
							>
								{errors.email.message}
							</p>
						) : null}
					</div>

					<div className="mt-6">
						<Controller
							control={form.control}
							name="countryCode"
							render={({ field: countryField }) => (
								<Controller
									control={form.control}
									name="phone"
									render={({ field: phoneField }) => (
										<PhoneCountryField
											label={copy.phone}
											countryLabel={copy.country}
											phonePlaceholder={
												copy.phonePlaceholder
											}
											countryCode={countryField.value}
											phoneValue={phoneField.value}
											countryError={
												errors.countryCode?.message
											}
											phoneError={
												errors.phone?.message
											}
											onCountryChange={(code) => {
												countryField.onChange(code)
											}}
											onPhoneChange={(value) => {
												phoneField.onChange(value)
											}}
											onPhoneBlur={phoneField.onBlur}
										/>
									)}
								/>
							)}
						/>
					</div>

					<div className="mt-6">
						<label
							htmlFor="service"
							className="block text-sm font-medium text-white"
						>
							{copy.service}
						</label>
						<select
							id="service"
							aria-invalid={
								errors.serviceId ? true : undefined
							}
							aria-describedby={
								errors.serviceId
									? 'service-error'
									: undefined
							}
							className={[
								inputClassName,
								'mt-2',
								errors.serviceId
									? 'border-orange/70'
									: 'border-white/10',
							].join(' ')}
							{...form.register('serviceId')}
							defaultValue={initialServiceId}
						>
							<option value="">
								{copy.servicePlaceholder}
							</option>
							{services.map((service) => (
								<option
									key={service.serviceId}
									value={service.serviceId}
								>
									{service.name}
								</option>
							))}
						</select>
						{errors.serviceId ? (
							<p
								id="service-error"
								role="alert"
								className="mt-2 text-sm text-orange"
							>
								{errors.serviceId.message}
							</p>
						) : null}
					</div>

					<div className="mt-6">
						<label
							htmlFor="website-description"
							className="block text-sm font-medium text-white"
						>
							{copy.website}
						</label>
						<textarea
							id="website-description"
							rows={6}
							placeholder={copy.websitePlaceholder}
							aria-invalid={
								errors.websiteDescription
									? true
									: undefined
							}
							aria-describedby={
								errors.websiteDescription
									? 'website-description-error'
									: undefined
							}
							className={[
								inputClassName,
								'mt-2 min-h-36 resize-y',
								errors.websiteDescription
									? 'border-orange/70'
									: 'border-white/10',
							].join(' ')}
							{...form.register('websiteDescription')}
						/>
						{errors.websiteDescription ? (
							<p
								id="website-description-error"
								role="alert"
								className="mt-2 text-sm text-orange"
							>
								{errors.websiteDescription.message}
							</p>
						) : null}
					</div>

					<div className="mt-6 grid gap-6 sm:grid-cols-2">
						<div>
							<label
								htmlFor="budget"
								className="block text-sm font-medium text-white"
							>
								{copy.budget}
								<span className="ms-2 text-white/45">
									{copy.budgetPlaceholder}
								</span>
							</label>
							<input
								id="budget"
								type="text"
								inputMode="decimal"
								autoComplete="off"
								placeholder={copy.budgetPlaceholder}
								aria-invalid={
									errors.budget ? true : undefined
								}
								aria-describedby={
									errors.budget ? 'budget-error' : undefined
								}
								className={[
									inputClassName,
									'mt-2 border-white/10',
								].join(' ')}
								{...form.register('budget')}
								onChange={(event) => {
									let raw = event.target.value
									if (!raw.includes('$') && /\d/.test(raw)) {
										raw = '$' + raw
									}
									const marked = raw.match(
										/\$\s*(\d*(?:\.\d{0,2})?)/,
									)
									const amount = marked?.[1] ?? ''
									event.target.value = amount === ''
										? ''
										: '$' + amount
									void form.register('budget').onChange(event)
								}}
							/>
							{errors.budget ? (
								<p
									id="budget-error"
									role="alert"
									className="mt-2 text-sm text-orange"
								>
									{errors.budget.message}
								</p>
							) : null}
						</div>
						<div>
							<label
								htmlFor="deadline"
								className="block text-sm font-medium text-white"
							>
								{copy.deadline}
								<span className="ms-2 text-white/45">
									{copy.deadlinePlaceholder}
								</span>
							</label>
							<div className="relative mt-2">
								<input
									id="deadline"
									type="date"
									aria-invalid={
										errors.deadline ? true : undefined
									}
									aria-describedby={
										errors.deadline
											? 'deadline-error'
											: undefined
									}
									className={[
										inputClassName,
										'booking-date border-white/10 pe-12',
										'[color-scheme:dark]',
									].join(' ')}
									{...form.register('deadline')}
								/>
								<button
									type="button"
									aria-label={copy.deadline}
									onClick={() => {
										const field = document.getElementById(
											'deadline',
										)
										if (
											field instanceof HTMLInputElement
											&& typeof field.showPicker === 'function'
										) {
											field.showPicker()
										}
									}}
									className={[
										'absolute inset-y-0 end-0',
										'flex w-12 items-center justify-center',
										'text-white/70',
										'focus-visible:outline-2',
										'focus-visible:outline-offset-2',
									].join(' ')}
								>
									<svg
										aria-hidden="true"
										viewBox="0 0 24 24"
										fill="none"
										className="h-4 w-4"
									>
										<rect
											x="4"
											y="5"
											width="16"
											height="15"
											rx="2"
											stroke="currentColor"
											strokeWidth="1.5"
										/>
										<path
											d="M4 10h16M8 3.5v3M16 3.5v3"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
									</svg>
								</button>
							</div>
							{errors.deadline ? (
								<p
									id="deadline-error"
									role="alert"
									className="mt-2 text-sm text-orange"
								>
									{errors.deadline.message}
								</p>
							) : null}
						</div>
					</div>

					<button
						type="submit"
						disabled={!canSubmit}
						className={[
							'mt-8 inline-flex min-h-12 w-full',
							'items-center justify-center',
							'rounded-full bg-orange px-8',
							'text-sm font-semibold uppercase',
							'tracking-[0.18em] text-ink',
							'transition duration-300 ease-out',
							'hover:bg-highlight',
							'hover:shadow-[0_0_24px_rgba(142,235,248,0.35)]',
							'focus-visible:outline-2',
							'focus-visible:outline-offset-4',
							'disabled:cursor-not-allowed',
							'disabled:opacity-60',
						].join(' ')}
					>
						{isSubmitting
							? copy.submitting
							: copy.submit}
					</button>

					{!hasServices ? (
						<p
							role="alert"
							className="mt-4 text-center text-sm text-orange"
						>
							{copy.noServices}
						</p>
					) : null}

					{saveError ? (
						<p
							role="alert"
							className="mt-4 text-center text-sm text-orange"
						>
							{saveError}
						</p>
					) : null}

					{isConfirmed ? (
						<div
							role="status"
							className={[
								'mt-6 rounded-2xl border border-highlight/30',
								'bg-ink/70 px-5 py-6 text-center',
							].join(' ')}
						>
							<p className="text-base font-semibold text-highlight">
								{copy.confirmedTitle}
							</p>
							<p className="mt-2 text-sm leading-6 text-white/75">
								{copy.confirmedBody}
							</p>
							<p className="mt-2 text-sm leading-6 text-white/75">
								{copy.confirmedThanks}
							</p>
							<Link
								href="/"
								className={[
									'mt-5 inline-flex min-h-11 items-center',
									'justify-center rounded-full',
									'border border-white/20 px-6',
									'text-sm font-semibold text-white',
									'focus-visible:outline-2',
									'focus-visible:outline-offset-4',
								].join(' ')}
							>
								{copy.backHome}
							</Link>
						</div>
					) : null}
				</form>
			{isSignedIn ? null : (
				<div
					className={[
						'fixed inset-0 z-40 flex items-center',
						'justify-center px-6',
					].join(' ')}
				>
					<button
						type="button"
						tabIndex={-1}
						aria-hidden="true"
						className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
					/>
					<div
						role="alertdialog"
						aria-modal="true"
						aria-labelledby="booking-auth-title"
						className={[
							'relative z-10 w-full max-w-sm',
							'rounded-2xl border border-white/15',
							'bg-surface px-6 py-7 text-center',
							'shadow-[0_24px_60px_rgba(0,0,0,0.45)]',
						].join(' ')}
					>
						<p
							id="booking-auth-title"
							className="text-base font-semibold leading-7 text-white"
						>
							{copy.signInRequired}
						</p>
						<div className="mt-6 flex flex-col gap-3">
							<Link
								href={'/login?next=' + authNext}
								className={[
									'inline-flex min-h-11 items-center',
									'justify-center rounded-full',
									'bg-gold px-5 text-xs font-semibold',
									'uppercase tracking-[0.16em] text-white',
									'focus-visible:outline-2',
									'focus-visible:outline-offset-4',
								].join(' ')}
							>
								{copy.goLogin}
							</Link>
							<Link
								href={'/sign-in?next=' + authNext}
								className={[
									'inline-flex min-h-11 items-center',
									'justify-center rounded-full',
									'border border-white/15 px-5',
									'text-xs font-semibold uppercase',
									'tracking-[0.16em] text-white',
									'focus-visible:outline-2',
									'focus-visible:outline-offset-4',
								].join(' ')}
							>
								{copy.goSignIn}
							</Link>
						</div>
					</div>
				</div>
			)}
			</div>
		</section>
	)
}
