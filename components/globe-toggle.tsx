'use client'

import { useEffect, useState } from 'react'
import { useContent } from '@/components/language-provider'

const GLOBE_STORAGE_KEY = 'globe'

function GlobeIcon ({ hidden }: { hidden: boolean }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-4 w-4"
		>
			<circle
				cx="12"
				cy="12"
				r="7.25"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M12 4.75c2.2 2.1 3.3 4.5 3.3 7.25S14.2 17.15 12 19.25C9.8 17.15 8.7 14.75 8.7 12S9.8 6.85 12 4.75Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M5 12h14"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			{hidden ? (
				<path
					d="M6 6l12 12"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			) : null}
		</svg>
	)
}

/**
 * Shows or hides the background globe.
 */
export function GlobeToggle () {
	const content = useContent()
	const [hidden, setHidden] = useState(false)

	useEffect(() => {
		setHidden(
			document.documentElement.getAttribute('data-globe') === 'off',
		)
	}, [])

	function handleToggle () {
		const nextHidden = !hidden
		setHidden(nextHidden)
		document.documentElement.setAttribute(
			'data-globe',
			nextHidden ? 'off' : 'on',
		)
		window.localStorage.setItem(
			GLOBE_STORAGE_KEY,
			nextHidden ? 'off' : 'on',
		)
	}

	return (
		<button
			type="button"
			onClick={handleToggle}
			aria-pressed={hidden}
			aria-label={content.globeToggle}
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
			<GlobeIcon hidden={hidden} />
		</button>
	)
}
