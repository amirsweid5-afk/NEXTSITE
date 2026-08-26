'use client'

import { useState, type FormEvent } from 'react'

const WHATSAPP_NUMBER = '96170552181'

interface FormErrors {
	fullName?: string
	websiteDescription?: string
}

function buildWhatsAppMessage (
	fullName: string,
	websiteDescription: string,
): string {
	return [
		'New Website Booking',
		'',
		`Full Name: ${fullName}`,
		'',
		`Website Description: ${websiteDescription}`,
	].join('\n')
}

function getWhatsAppUrl (message: string): string {
	return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

/**
 * Booking form that opens WhatsApp with the client's details.
 */
export function BookNowSection () {
	const [fullName, setFullName] = useState('')
	const [websiteDescription, setWebsiteDescription] = useState('')
	const [errors, setErrors] = useState<FormErrors>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isConfirmed, setIsConfirmed] = useState(false)

	function validateForm (): FormErrors {
		const nextErrors: FormErrors = {}
		const trimmedName = fullName.trim()
		const trimmedDescription = websiteDescription.trim()

		if (trimmedName === '') {
			nextErrors.fullName = 'Please enter your full name.'
		}

		if (trimmedDescription === '') {
			nextErrors.websiteDescription =
				'Please tell us about your website.'
		}

		return nextErrors
	}

	function handleSubmit (event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		if (isSubmitting) return

		const nextErrors = validateForm()
		setErrors(nextErrors)
		setIsConfirmed(false)

		if (Object.keys(nextErrors).length > 0) return

		setIsSubmitting(true)

		const trimmedName = fullName.trim()
		const trimmedDescription = websiteDescription.trim()
		const message = buildWhatsAppMessage(
			trimmedName,
			trimmedDescription,
		)
		const whatsAppUrl = getWhatsAppUrl(message)

		window.open(whatsAppUrl, '_blank', 'noopener,noreferrer')
		setIsConfirmed(true)

		window.setTimeout(() => {
			setIsSubmitting(false)
		}, 2000)
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
						Get Started
					</p>
					<h2
						id="book-now-heading"
						className={[
							'mt-4 text-3xl font-semibold',
							'tracking-tight text-white',
							'sm:text-4xl',
						].join(' ')}
					>
						Book Now
					</h2>
					<p className="mt-4 text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
						Tell us about your website and we&apos;ll get
						back to you to discuss the details.
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
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
							Full Name
						</label>
						<input
							id="full-name"
							name="fullName"
							type="text"
							required
							autoComplete="name"
							value={fullName}
							onChange={(event) => {
								setFullName(event.target.value)
								if (errors.fullName) {
									setErrors((prev) => ({
										...prev,
										fullName: undefined,
									}))
								}
							}}
							placeholder="Enter your full name"
							aria-invalid={errors.fullName ? true : undefined}
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
						/>
						{errors.fullName ? (
							<p
								id="full-name-error"
								role="alert"
								className="mt-2 text-sm text-orange"
							>
								{errors.fullName}
							</p>
						) : null}
					</div>

					<div className="mt-6">
						<label
							htmlFor="website-description"
							className="block text-sm font-medium text-white"
						>
							Tell us about your website
						</label>
						<textarea
							id="website-description"
							name="websiteDescription"
							required
							rows={6}
							value={websiteDescription}
							onChange={(event) => {
								setWebsiteDescription(event.target.value)
								if (errors.websiteDescription) {
									setErrors((prev) => ({
										...prev,
										websiteDescription: undefined,
									}))
								}
							}}
							placeholder="Describe the website you need, including its purpose, pages, features, or any ideas you have..."
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
						/>
						{errors.websiteDescription ? (
							<p
								id="website-description-error"
								role="alert"
								className="mt-2 text-sm text-orange"
							>
								{errors.websiteDescription}
							</p>
						) : null}
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
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
							? 'Opening WhatsApp...'
							: 'Submit Booking'}
					</button>

					{isConfirmed ? (
						<p
							role="status"
							className={[
								'mt-4 text-center text-sm',
								'leading-6 text-highlight',
							].join(' ')}
						>
							Your booking details are ready in WhatsApp.
							Please press Send to complete your request.
						</p>
					) : null}
				</form>
			</div>
		</section>
	)
}
