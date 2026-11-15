'use client'

import { useLanguage } from '@/components/language-provider'
import {
	MARKETING_CONTENT,
	type MarketingContent,
} from '@/lib/marketing-content'

/**
 * Returns bilingual marketing copy for upgraded pages.
 */
export function useMarketingContent (): MarketingContent {
	const { language } = useLanguage()
	return MARKETING_CONTENT[language]
}
