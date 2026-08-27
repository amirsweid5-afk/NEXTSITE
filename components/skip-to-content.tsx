'use client'

import { useContent } from '@/components/language-provider'

/**
 * Skip link that follows the active language.
 */
export function SkipToContent () {
	const content = useContent()

	return (
		<a
			href="#main"
			className={[
				'sr-only focus:not-sr-only',
				'focus:absolute focus:start-4',
				'focus:top-4 focus:z-[60]',
				'focus:bg-highlight',
				'focus:px-3 focus:py-2',
				'focus:text-ink',
			].join(' ')}
		>
			{content.skipToContent}
		</a>
	)
}
