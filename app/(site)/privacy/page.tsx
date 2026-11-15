'use client'

import { LegalPage } from '@/components/legal-page'
import { useMarketingContent } from '@/hooks/use-marketing-content'

export default function PrivacyPage () {
	const copy = useMarketingContent().privacy
	return (
		<LegalPage
			title={copy.title}
			updated={copy.updated}
			sections={copy.sections}
		/>
	)
}
