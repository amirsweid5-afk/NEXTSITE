'use client'

import { useLanguage } from '@/components/language-provider'

/**
 * Icon control that switches site copy between English and Arabic.
 */
export function LanguageToggle () {
	const { language, content, setLanguage } = useLanguage()

	function handleToggleLanguage () {
		setLanguage(language === 'en' ? 'ar' : 'en')
	}

	return (
		<button
			type="button"
			onClick={handleToggleLanguage}
			aria-label={content.nav.toggleLanguage}
			title={
				language === 'en'
					? content.nav.arabic
					: content.nav.english
			}
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
			<span className="sr-only">
				{language === 'en'
					? content.nav.arabic
					: content.nav.english}
			</span>
			<span
				aria-hidden="true"
				className={[
					'text-sm font-semibold leading-none',
					'tracking-tight',
				].join(' ')}
			>
				{language === 'en' ? 'ع' : 'E'}
			</span>
		</button>
	)
}
