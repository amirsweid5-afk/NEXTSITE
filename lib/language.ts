export type Language = 'en' | 'ar'

export const LANGUAGE_STORAGE_KEY = 'lang'
export const DEFAULT_LANGUAGE: Language = 'en'

/**
 * Returns true when the value is a supported site language.
 */
export function isLanguage (value: unknown): value is Language {
	return value === 'en' || value === 'ar'
}

/**
 * Applies language, direction, and persistence on the document.
 */
export function applyLanguage (language: Language) {
	const root = document.documentElement
	root.lang = language
	root.dir = language === 'ar' ? 'rtl' : 'ltr'
	root.setAttribute('data-lang', language)
	document.cookie =
		`${LANGUAGE_STORAGE_KEY}=${language}; path=/; ` +
		'max-age=31536000; SameSite=Lax'
	window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
}
