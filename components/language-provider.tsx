'use client'

import {
	createContext,
	useContext,
	useState,
	type ReactNode,
} from 'react'
import {
	applyLanguage,
	type Language,
} from '@/lib/language'
import { SITE_CONTENT, type SiteContent } from '@/lib/site-content'

interface LanguageContextValue {
	language: Language
	content: SiteContent
	setLanguage: (language: Language) => void
}

interface LanguageProviderProps {
	children: ReactNode
	initialLanguage: Language
}

const LanguageContext = createContext<LanguageContextValue | null>(
	null,
)

/**
 * Provides the active language and bilingual site content.
 */
export function LanguageProvider ({
	children,
	initialLanguage,
}: LanguageProviderProps) {
	const [language, setLanguageState] = useState<Language>(
		initialLanguage,
	)

	function setLanguage (nextLanguage: Language) {
		setLanguageState(nextLanguage)
		applyLanguage(nextLanguage)
	}

	const value: LanguageContextValue = {
		language,
		content: SITE_CONTENT[language],
		setLanguage,
	}

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	)
}

/**
 * Reads the current language, content, and language setter.
 */
export function useLanguage (): LanguageContextValue {
	const context = useContext(LanguageContext)
	if (!context) {
		throw new Error(
			'useLanguage must be used within LanguageProvider',
		)
	}
	return context
}

/**
 * Returns the site copy for the active language.
 */
export function useContent (): SiteContent {
	return useLanguage().content
}
