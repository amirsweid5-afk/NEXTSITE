'use client'

import { useLanguage } from '@/components/language-provider'
import { type Language } from '@/lib/language'

/**
 * Switches site copy between English and Arabic.
 */
export function LanguageToggle () {
	const { language, content, setLanguage } = useLanguage()

	function handleSelectLanguage (nextLanguage: Language) {
		if (nextLanguage === language) return
		setLanguage(nextLanguage)
	}

	return (
		<div
			role="group"
			aria-label={content.nav.toggleLanguage}
			className="inline-flex items-center gap-1"
		>
			<button
				type="button"
				onClick={() => handleSelectLanguage('en')}
				aria-pressed={language === 'en'}
				className={[
					'rounded-sm px-1.5 py-1 text-xs',
					'font-medium tracking-[0.16em]',
					'focus-visible:outline-2',
					'focus-visible:outline-offset-4',
					language === 'en'
						? 'text-orange'
						: 'text-white/45 hover:text-orange',
				].join(' ')}
			>
				{content.nav.english}
			</button>
			<span aria-hidden="true" className="text-white/25">
				|
			</span>
			<button
				type="button"
				onClick={() => handleSelectLanguage('ar')}
				aria-pressed={language === 'ar'}
				className={[
					'rounded-sm px-1.5 py-1 text-xs',
					'font-medium tracking-[0.16em]',
					'focus-visible:outline-2',
					'focus-visible:outline-offset-4',
					language === 'ar'
						? 'text-orange'
						: 'text-white/45 hover:text-orange',
				].join(' ')}
			>
				{content.nav.arabic}
			</button>
		</div>
	)
}
