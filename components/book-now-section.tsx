'use client'

import {
	useEffect,
	useMemo,
	useState,
	type ChangeEvent,
	type FocusEvent,
} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { ClientBookingsList } from '@/components/client-bookings-list'
import { useContent } from '@/components/language-provider'
import { PhoneCountryField } from '@/components/phone-country-field'
import { createBooking } from '@/lib/bookings/create-booking'
import {
	createBookingSchema,
	type BookingServiceOption,
} from '@/lib/bookings/booking-schema'
import { type ClientBooking } from '@/lib/bookings/client-booking-types'
import {
	formatDeadlineInput,
	isDeadlineWarningNeeded,
	normalizeDeadlineToIso,
	padDeadlineInput,
	toDeadlineDisplay,
} from '@/lib/bookings/deadline'
import { deleteMyBooking } from '@/lib/bookings/delete-my-booking'
import { updateBooking } from '@/lib/bookings/update-booking'
import { useMarketingContent } from '@/hooks/use-marketing-content'
import { DEFAULT_PHONE_COUNTRY } from '@/lib/phone/countries'

interface BookNowSectionProps {
	services: BookingServiceOption[]
	initialServiceId?: string
	isSignedIn?: boolean
	accountName?: string
	accountEmail?: string
	returnPath?: string
	myBookings?: ClientBooking[]
	hideBookingsList?: boolean
	initialEditingBookingId?: string | null
	onBookingsChange?: (bookings: ClientBooking[]) => void
	onEditingChange?: (bookingId: string | null) => void
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
	accountName = '',
	accountEmail = '',
	returnPath = '/booking',
	myBookings = [],
	hideBookingsList = false,
	initialEditingBookingId = null,
	onBookingsChange,
	onEditingChange,
}: BookNowSectionProps) {
	const router = useRouter()
	const copy = useContent().booking.form
	const extras = useMarketingContent().bookingExtras
	const [isConfirmed, setIsConfirmed] = useState(false)
	const [saveError, setSaveError] = useState<string | null>(null)
	const serverStamp = myBookings.map((booking) => {
		return [
			booking.bookingId,
			booking.status,
			booking.websiteProgress,
			booking.progressSetByAdmin ? '1' : '0',
			booking.statusUpdatedAt ?? '',
			booking.progressUpdatedAt ?? '',
			booking.websiteDescription,
			booking.deadline,
			String(booking.editCount),
		].join(':')
	}).join('|')
	const [seenStamp, setSeenStamp] = useState(serverStamp)
	const [bookings, setBookings] = useState(myBookings)
	const [budgetRangeId, setBudgetRangeId] = useState('unsure')
	const [editingBookingId, setEditingBookingId] = useState<string | null>(
		initialEditingBookingId,
	)
	const [didOpenInitialEdit, setDidOpenInitialEdit] = useState(false)
	if (seenStamp !== serverStamp) {
		setSeenStamp(serverStamp)
		setBookings(myBookings)
	}

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
			fullName: accountName,
			email: accountEmail,
			countryCode: DEFAULT_PHONE_COUNTRY.code,
			phone: '',
			serviceId: initialServiceId,
			websiteDescription: '',
			budget: '',
			deadline: '',
		},
	})

	const isSubmitting = form.formState.isSubmitting
	const errors = form.formState.errors
	const hasServices = services.length > 0
	const canSubmit = !isSubmitting && hasServices
	const deadlineValue = form.watch('deadline')
	const showDeadlineWarning = isDeadlineWarningNeeded(deadlineValue ?? '')
	const isEditing = editingBookingId !== null
	const {
		onChange: onDeadlineChange,
		onBlur: onDeadlineBlur,
		...deadlineField
	} = form.register('deadline')

	function handleDeadlineChange (
		event: ChangeEvent<HTMLInputElement>,
	) {
		const next = formatDeadlineInput(event.target.value)
		event.target.value = next
		void onDeadlineChange(event)
	}

	function handleDeadlineBlur (
		event: FocusEvent<HTMLInputElement>,
	) {
		const next = padDeadlineInput(event.target.value)
		event.target.value = next
		void onDeadlineChange(event)
		void onDeadlineBlur(event)
	}

	function resetFormValues (values?: Partial<BookingFormValues>) {
		form.reset({
			fullName: values?.fullName ?? accountName,
			email: values?.email ?? accountEmail,
			countryCode: values?.countryCode
				?? DEFAULT_PHONE_COUNTRY.code,
			phone: values?.phone ?? '',
			serviceId: values?.serviceId ?? '',
			websiteDescription: values?.websiteDescription ?? '',
			budget: values?.budget ?? '',
			deadline: values?.deadline ?? '',
		})
	}

	useEffect(() => {
		onBookingsChange?.(bookings)
	}, [bookings, onBookingsChange])

	useEffect(() => {
		onEditingChange?.(editingBookingId)
	}, [editingBookingId, onEditingChange])

	useEffect(() => {
		if (didOpenInitialEdit) return
		if (!initialEditingBookingId) return
		const match = bookings.find((booking) => {
			return booking.bookingId === initialEditingBookingId
		})
		if (!match) return
		setDidOpenInitialEdit(true)
		handleEditBooking(match)
	}, [bookings, didOpenInitialEdit, initialEditingBookingId])

	function handleEditBooking (booking: ClientBooking) {
		setEditingBookingId(booking.bookingId)
		setIsConfirmed(false)
		setSaveError(null)
		resetFormValues({
			fullName: booking.fullName,
			email: booking.email,
			countryCode: booking.countryCode,
			phone: booking.localPhone,
			serviceId: booking.serviceId,
			websiteDescription: booking.websiteDescription,
			budget: booking.budget,
			deadline: toDeadlineDisplay(booking.deadline),
		})
		document.getElementById('book-now-heading')
			?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}

	async function handleDeleteBooking (bookingId: string) {
		const result = await deleteMyBooking(bookingId)
		if (!result.ok) return result

		setBookings((current) => {
			return current.filter((booking) => {
				return booking.bookingId !== bookingId
			})
		})
		if (editingBookingId === bookingId) {
			setEditingBookingId(null)
			resetFormValues()
		}
		return result
	}

	function handleCancelEdit () {
		setEditingBookingId(null)
		setSaveError(null)
		resetFormValues({ serviceId: initialServiceId })
	}

	async function handleSubmit (values: BookingFormValues) {
		if (editingBookingId && !isSignedIn) {
			setSaveError(copy.signInRequired)
			return
		}
		if (isDeadlineWarningNeeded(values.deadline)) {
			setSaveError(copy.deadlineWarning)
			return
		}
		setIsConfirmed(false)
		setSaveError(null)

		const deadlineIso = normalizeDeadlineToIso(values.deadline)
		if (deadlineIso === null) {
			setSaveError(copy.deadlineError)
			return
		}
		const honeypot = (
			document.getElementById('company-website') as HTMLInputElement | null
		)?.value ?? ''
		const payload = {
			...values,
			deadline: deadlineIso,
			website: honeypot,
		}

		if (editingBookingId) {
			const result = await updateBooking(editingBookingId, payload)
			if (!result.ok) {
				setSaveError(result.error ?? copy.saveError)
				return
			}

			setBookings((current) => {
				return current.map((booking) => {
					if (booking.bookingId !== editingBookingId) {
						return booking
					}
					const service = services.find((item) => {
						return item.serviceId === values.serviceId
					})
					return {
						...booking,
						fullName: values.fullName,
						email: values.email,
						countryCode: values.countryCode,
						localPhone: values.phone,
						serviceId: values.serviceId,
						serviceName: service?.name ?? booking.serviceName,
						websiteDescription: values.websiteDescription,
						budget: values.budget,
						deadline: deadlineIso,
						editCount: booking.editCount + 1,
						wasEdited: true,
						lastEditedAt: new Date().toISOString(),
					}
				})
			})
			setEditingBookingId(null)
			setIsConfirmed(true)
			resetFormValues()
			router.refresh()
			return
		}

		const result = await createBooking(payload)

		if (!result.ok) {
			setSaveError(result.error ?? copy.saveError)
			return
		}

		const service = services.find((item) => {
			return item.serviceId === values.serviceId
		})
		if (isSignedIn && result.bookingId && service) {
			setBookings((current) => [{
				bookingId: result.bookingId as string,
				fullName: values.fullName,
				email: values.email,
				phone: values.phone,
				countryCode: values.countryCode,
				localPhone: values.phone,
				serviceId: values.serviceId,
				serviceName: service.name,
				websiteDescription: values.websiteDescription,
				budget: values.budget,
				deadline: deadlineIso,
				status: 'pending',
				createdAt: new Date().toISOString(),
				priceUsd: service.price,
				amountPaid: 0,
				remainingBalance: service.price,
				paymentStatus: 'unpaid',
				editCount: 0,
				wasEdited: false,
				lastEditedAt: null,
				websiteProgress: 'not_started',
			}, ...current])
		}

		setIsConfirmed(true)
		setBudgetRangeId('unsure')
		resetFormValues()
		router.refresh()
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

			{isSignedIn && !hideBookingsList ? (
				<div className="relative z-10">
					<ClientBookingsList
						bookings={bookings}
						editingBookingId={editingBookingId}
						onEdit={handleEditBooking}
						onDelete={handleDeleteBooking}
					/>
				</div>
			) : null}

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
						{isEditing ? copy.editBooking : copy.title}
					</h2>
					<p className="mt-4 text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
						{copy.description}
					</p>
					{!isSignedIn ? (
						<p className="mt-3 text-sm text-highlight/90">
							{extras.guestHint}
						</p>
					) : null}
					{isEditing ? (
						<button
							type="button"
							onClick={handleCancelEdit}
							className="mt-3 text-sm text-highlight hover:text-orange"
						>
							{copy.cancelEdit}
						</button>
					) : null}
				</div>

				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					noValidate
					className={[
						'site-card relative mt-12 rounded-2xl',
						'border border-white/10 bg-surface/80 p-6 sm:p-8',
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
							{extras.projectType}
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

					<div
						className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
						aria-hidden="true"
					>
						<label htmlFor="company-website">
							{extras.honeypotLabel}
						</label>
						<input
							id="company-website"
							type="text"
							name="website"
							tabIndex={-1}
							autoComplete="off"
						/>
					</div>

					<div className="mt-6">
						<p className="block text-sm font-medium text-white">
							{extras.budgetRange}
						</p>
						<div className="mt-3 grid gap-2 sm:grid-cols-2">
							{extras.budgetRanges.map((range) => (
								<button
									key={range.id}
									type="button"
									onClick={() => {
										setBudgetRangeId(range.id)
										form.setValue('budget', range.value, {
											shouldValidate: true,
											shouldDirty: true,
										})
									}}
									className={[
										'rounded-xl border px-4 py-3 text-start',
										'text-sm transition',
										budgetRangeId === range.id
											? 'border-orange/50 bg-orange/10 text-white'
											: 'border-white/10 bg-ink/40 text-white/70 hover:border-orange/30',
									].join(' ')}
								>
									{range.label}
								</button>
							))}
						</div>
						<label
							htmlFor="budget"
							className="mt-4 block text-xs text-white/45"
						>
							{extras.budgetCustom}
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
								setBudgetRangeId('custom')
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

					<div className="mt-6">
						<label
							htmlFor="deadline"
							className="block text-sm font-medium text-white"
						>
							{copy.deadline}
						</label>
						<input
							id="deadline"
							type="text"
							inputMode="numeric"
							autoComplete="off"
							placeholder={copy.deadlinePlaceholder}
							aria-invalid={
								errors.deadline
									|| showDeadlineWarning
									? true
									: undefined
							}
							aria-describedby={
								errors.deadline
									|| showDeadlineWarning
									? 'deadline-error'
									: undefined
							}
							className={[
								inputClassName,
								'mt-2 border-white/10',
								showDeadlineWarning
									? 'border-orange/70'
									: '',
							].join(' ')}
							{...deadlineField}
							onChange={handleDeadlineChange}
							onBlur={handleDeadlineBlur}
						/>
						{errors.deadline ? (
							<p
								id="deadline-error"
								role="alert"
								className="mt-2 text-sm text-orange"
							>
								{errors.deadline.message}
							</p>
						) : showDeadlineWarning ? (
							<p
								id="deadline-error"
								role="alert"
								className="mt-2 text-sm text-orange"
							>
								{copy.deadlineWarning}
							</p>
						) : null}
					</div>

					<button
						type="submit"
						disabled={!canSubmit || showDeadlineWarning}
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
							? (
								isEditing
									? copy.updateSubmitting
									: copy.submitting
							)
							: (
								isEditing
									? copy.updateSubmit
									: copy.submit
							)}
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

				<div
					className={[
						'mx-auto mt-10 max-w-md rounded-2xl',
						'border border-orange/40 bg-ink/80',
						'px-6 py-5 text-center',
						'shadow-[0_12px_36px_rgba(0,0,0,0.3)]',
					].join(' ')}
				>
					<p className="text-lg font-semibold tracking-wide text-white">
						WISH : 76/722/832
					</p>
				</div>
			</div>
		</section>
	)
}
