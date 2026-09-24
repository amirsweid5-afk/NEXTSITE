'use client'

import { useEffect, useId, useRef, useState } from 'react'
import {
	DEFAULT_PHONE_COUNTRY,
	PHONE_COUNTRIES,
	getPhoneCountry,
	type PhoneCountry,
} from '@/lib/phone/countries'

interface PhoneCountryFieldProps {
	label: string
	countryLabel: string
	phonePlaceholder: string
	countryCode: string
	phoneValue: string
	countryError?: string
	phoneError?: string
	onCountryChange: (code: string) => void
	onPhoneChange: (value: string) => void
	onPhoneBlur: () => void
}

/**
 * Phone input with a country flag dial-code picker.
 */
export function PhoneCountryField ({
	label,
	countryLabel,
	phonePlaceholder,
	countryCode,
	phoneValue,
	countryError,
	phoneError,
	onCountryChange,
	onPhoneChange,
	onPhoneBlur,
}: PhoneCountryFieldProps) {
	const listId = useId()
	const rootRef = useRef<HTMLDivElement>(null)
	const [isOpen, setIsOpen] = useState(false)

	const selected =
		getPhoneCountry(countryCode) ?? DEFAULT_PHONE_COUNTRY

	useEffect(() => {
		if (!isOpen) return

		function handlePointerDown (event: MouseEvent) {
			if (!rootRef.current?.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		function handleKeyDown (event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setIsOpen(false)
			}
		}

		window.addEventListener('mousedown', handlePointerDown)
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('mousedown', handlePointerDown)
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen])

	function handleSelect (country: PhoneCountry) {
		onCountryChange(country.code)
		setIsOpen(false)
	}

	const hasError = Boolean(countryError || phoneError)
	const inputClassName = [
		'w-full rounded-xl border bg-ink/60',
		'px-4 py-3 text-sm text-white',
		'placeholder:text-white/35',
		'transition duration-300',
		'focus:border-orange/60 focus:bg-ink/80',
		'focus:outline-none',
		hasError ? 'border-orange/70' : 'border-white/10',
	].join(' ')

	return (
		<div ref={rootRef}>
			<label
				htmlFor="phone"
				className="block text-sm font-medium text-white"
			>
				{label}
			</label>
			<div className="relative mt-2 flex gap-2">
				<button
					type="button"
					aria-label={countryLabel}
					aria-haspopup="listbox"
					aria-expanded={isOpen}
					aria-controls={listId}
					onClick={() => setIsOpen((open) => !open)}
					className={[
						'inline-flex min-h-[2.875rem] shrink-0',
						'items-center gap-2 rounded-xl border',
						'bg-ink/60 px-3 text-sm text-white',
						'transition duration-300',
						'hover:border-orange/40',
						'focus-visible:outline-2',
						'focus-visible:outline-offset-2',
						countryError
							? 'border-orange/70'
							: 'border-white/10',
					].join(' ')}
				>
					<span aria-hidden="true" className="text-base">
						{selected.flag}
					</span>
					<span className="font-medium tracking-wide">
						+{selected.dialCode}
					</span>
					<span
						aria-hidden="true"
						className="text-white/45"
					>
						▾
					</span>
				</button>

				<input
					id="phone"
					type="tel"
					inputMode="numeric"
					autoComplete="tel-national"
					placeholder={phonePlaceholder}
					value={phoneValue}
					aria-invalid={phoneError ? true : undefined}
					aria-describedby={
						phoneError ? 'phone-error' : undefined
					}
					onChange={(event) => {
						const digits = event.target.value
							.replace(/\D/g, '')
							.slice(0, 15)
						onPhoneChange(digits)
					}}
					onBlur={onPhoneBlur}
					className={inputClassName}
				/>

				{isOpen ? (
					<ul
						id={listId}
						role="listbox"
						aria-label={countryLabel}
						className={[
							'absolute start-0 top-full z-20 mt-2',
							'max-h-60 w-[min(100%,18rem)]',
							'overflow-y-auto rounded-xl border',
							'border-white/10 bg-surface p-1',
							'shadow-[0_16px_40px_rgba(0,0,0,0.45)]',
						].join(' ')}
					>
						{PHONE_COUNTRIES.map((country) => {
							const isSelected =
								country.code === selected.code
							return (
								<li key={country.code} role="option"
									aria-selected={isSelected}
								>
									<button
										type="button"
										onClick={() => handleSelect(country)}
										className={[
											'flex w-full items-center gap-3',
											'rounded-lg px-3 py-2 text-start',
											'text-sm text-white/85',
											'transition duration-200',
											isSelected
												? 'bg-orange/15 text-orange'
												: 'hover:bg-white/5',
										].join(' ')}
									>
										<span aria-hidden="true">
											{country.flag}
										</span>
										<span className="flex-1 truncate">
											{country.name}
										</span>
										<span className="text-white/50">
											+{country.dialCode}
										</span>
									</button>
								</li>
							)
						})}
					</ul>
				) : null}
			</div>
			{countryError ? (
				<p
					role="alert"
					className="mt-2 text-sm text-orange"
				>
					{countryError}
				</p>
			) : null}
			{phoneError ? (
				<p
					id="phone-error"
					role="alert"
					className="mt-2 text-sm text-orange"
				>
					{phoneError}
				</p>
			) : null}
		</div>
	)
}
