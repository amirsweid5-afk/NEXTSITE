'use client'

import { useEffect, useState } from 'react'
import { useContent } from '@/components/language-provider'

const CURSOR_STORAGE_KEY = 'cursor-effect'

function CursorEffectIcon ({ off }: { off: boolean }) {
	return (
		<span
			className={[
				'relative inline-flex h-5 w-5',
				'items-center justify-center overflow-visible',
				off ? 'opacity-45' : '',
			].join(' ')}
		>
			<span
				aria-hidden="true"
				className="cursor-toggle-beam absolute size-1 rounded-full bg-highlight"
			/>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				className="cursor-toggle-pointer relative h-4 w-4"
			>
				<path
					d="M5.5 3.8l11.2 6.4-5.1 1.4 2.7 6.4-2.4 1-2.7-6.4-4.1 3.8V3.8Z"
					fill="currentColor"
					stroke="currentColor"
					strokeWidth="0.6"
					strokeLinejoin="round"
				/>
			</svg>
			{off ? (
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					fill="none"
					className="absolute inset-0 h-5 w-5"
				>
					<path
						d="M5 5l14 14"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</svg>
			) : null}
		</span>
	)
}

/**
 * Turns the chasing mouse cursor effect on or off.
 */
export function CursorEffectToggle () {
	const content = useContent()
	const [off, setOff] = useState(false)

	useEffect(() => {
		setOff(
			document.documentElement.getAttribute('data-cursor') === 'off',
		)
	}, [])

	function handleToggle () {
		const nextOff = !off
		setOff(nextOff)
		document.documentElement.setAttribute(
			'data-cursor',
			nextOff ? 'off' : 'on',
		)
		window.localStorage.setItem(
			CURSOR_STORAGE_KEY,
			nextOff ? 'off' : 'on',
		)
	}

	return (
		<button
			type="button"
			onClick={handleToggle}
			aria-pressed={off}
			aria-label={content.cursorToggle}
			className={[
				'inline-flex h-10 w-10',
				'shrink-0 items-center justify-center',
				'rounded-full border border-white/15',
				'bg-transparent text-white transition duration-300',
				'hover:border-orange/45 hover:text-orange',
				'focus-visible:outline-2',
				'focus-visible:outline-offset-4',
			].join(' ')}
		>
			<CursorEffectIcon off={off} />
		</button>
	)
}
