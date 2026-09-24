'use client'

import { useMemo, useState } from 'react'
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
}

interface BookingFormValues {
	fullName: string
	email: string
	countryCode: string
	phone: string
	serviceId: string
	websiteDescription: string
}

/**
 * Booking form that saves to the database and shows a confirmation.
 */
export function BookNowSection ({ services }: BookNowSectionProps) {
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
		})
	}, [
		copy.countryError,
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
			serviceId: '',
			websiteDescription: '',
		},
	})

	const isSubmitting = form.formState.isSubmitting
	const isValid = form.formState.isValid
	const errors = form.formState.errors
	const hasServices = services.length > 0
	const canSubmit = hasServices && isValid && !isSubmitting

	async function handleSubmit (values: BookingFormValues) {
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
		})
	}

	const inputClassName = [
		'w-full rounded-xl border bg-ink/60',
		'px-4 py-3 text-sm text-white',
		'placeholder:text-white/35',
		'transition duration-300',
		'focus:border-orange/60 focus:bg-ink/80',
		'focus:outline-none',
	].join(' ')

	return (
		<section
			id="book-now"
			aria-labelledby="book-now-heading"
			className={[
				'relative isolate overflow-hidden',
				'border-t border-white/10 bg-ink',
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
							'hover:shadow-[0_0_24px_rgba(209,172,44,0.35)]',
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
						<p
							role="status"
							className={[
								'mt-4 text-center text-sm',
								'leading-6 text-highlight',
							].join(' ')}
						>
							{copy.confirmed}
						</p>
					) : null}
				</form>
			</div>
		</section>
	)
}
