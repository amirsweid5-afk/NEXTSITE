'use client'

import {
	useState,
	type InputHTMLAttributes,
} from 'react'
import { AUTH_INPUT_CLASS } from '@/components/auth-screen'

interface PasswordFieldProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'type'
> {
	label: string
	error?: string
	errorId?: string
	showLabel: string
	hideLabel: string
}

function EyeIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-5 w-5"
		>
			<path
				d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
			<circle
				cx="12"
				cy="12"
				r="2.75"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
		</svg>
	)
}

function EyeOffIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-5 w-5"
		>
			<path
				d="M3 3l18 18M10.1 10.2a2.75 2.75 0 0 0 3.8 3.8M7.1 7.4C5.1 8.7 3.6 10.6 2.5 12c0 0 3.5 6.5 9.5 6.5 1.5 0 2.9-.4 4.1-1M16.6 15.3c1.5-1.1 2.7-2.6 3.9-3.3 0 0-3.5-6.5-9.5-6.5-1 0-1.9.2-2.8.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

/**
 * Password input with a show/hide visibility toggle.
 */
export function PasswordField ({
	id,
	label,
	error,
	errorId,
	showLabel,
	hideLabel,
	className,
	...inputProps
}: PasswordFieldProps) {
	const [isVisible, setIsVisible] = useState(false)

	function handleToggle () {
		setIsVisible((current) => !current)
	}

	return (
		<div>
			<label
				htmlFor={id}
				className="block text-sm font-medium text-white"
			>
				{label}
			</label>
			<div className="relative mt-2">
				<input
					id={id}
					{...inputProps}
					type={isVisible ? 'text' : 'password'}
					aria-invalid={error ? true : undefined}
					aria-describedby={
						error ? errorId : undefined
					}
					className={[
						AUTH_INPUT_CLASS,
						'pe-12',
						error
							? 'border-orange/70'
							: 'border-white/10',
						className,
					]
						.filter(Boolean)
						.join(' ')}
				/>
				<button
					type="button"
					onClick={handleToggle}
					aria-label={
						isVisible ? hideLabel : showLabel
					}
					aria-pressed={isVisible}
					className={[
						'absolute end-3 top-1/2',
						'-translate-y-1/2',
						'rounded-md p-1',
						'text-white/45',
						'transition duration-200',
						'hover:text-white/80',
						'focus-visible:outline-2',
						'focus-visible:outline-offset-2',
						'focus-visible:outline-orange/70',
					].join(' ')}
				>
					{isVisible ? <EyeOffIcon /> : <EyeIcon />}
				</button>
			</div>
			{error && errorId ? (
				<p
					id={errorId}
					role="alert"
					className="mt-2 text-sm text-orange"
				>
					{error}
				</p>
			) : null}
		</div>
	)
}
