'use client'

import { useContent } from '@/components/language-provider'

const THEME_STORAGE_KEY = 'theme'

function SunIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="theme-icon-sun h-4 w-4"
		>
			<circle
				cx="12"
				cy="12"
				r="3.5"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M12 4.5v-1.5M12 21v-1.5M19.5 12h1.5M3 12h1.5M17.3 6.7l1.1-1.1M5.6 18.4l1.1-1.1M17.3 17.3l1.1 1.1M5.6 5.6l1.1 1.1"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	)
}

function MoonIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="theme-icon-moon h-4 w-4"
		>
			<path
				d="M16.8 4.4A8 8 0 1 0 20 15.4 6.4 6.4 0 0 1 16.8 4.4Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

/**
 * Switches the site between dark and light color themes.
 */
export function ThemeToggle () {
	const content = useContent()

	function handleToggleTheme () {
		const root = document.documentElement
		const isLight = root.getAttribute('data-theme') === 'light'
		const nextTheme = isLight ? 'dark' : 'light'
		root.setAttribute('data-theme', nextTheme)
		root.classList.toggle('dark', nextTheme === 'dark')
		window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
	}

	return (
		<button
			type="button"
			onClick={handleToggleTheme}
			aria-label={content.themeToggle}
			className={[
				'inline-flex h-10 w-10',
				'shrink-0 items-center justify-center',
				'rounded-full border border-white/15',
				'text-white transition duration-300',
				'hover:border-orange/45 hover:text-orange',
				'focus-visible:outline-2',
				'focus-visible:outline-offset-4',
			].join(' ')}
		>
			<SunIcon />
			<MoonIcon />
		</button>
	)
}
