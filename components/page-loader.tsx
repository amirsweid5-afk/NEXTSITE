'use client'

import { useMarketingContent } from '@/hooks/use-marketing-content'

/**
 * Professional branded loading screen for route transitions.
 */
export function PageLoader () {
	const copy = useMarketingContent().loading

	return (
		<div
			className={[
				'fixed inset-0 z-50 flex items-center justify-center',
				'bg-ink/90 backdrop-blur-md',
			].join(' ')}
			role="status"
			aria-live="polite"
			aria-label={copy.label}
		>
			<div className="flex flex-col items-center gap-5">
				<p className="font-brand home-hero-brand text-3xl text-orange sm:text-4xl">
					NEXTSITE
				</p>
				<div
					className={[
						'h-1 w-40 overflow-hidden rounded-full',
						'bg-white/10',
					].join(' ')}
				>
					<div className="page-loader-bar h-full w-1/3 rounded-full bg-orange" />
				</div>
				<p className="text-xs uppercase tracking-[0.22em] text-white/45">
					{copy.label}
				</p>
			</div>
		</div>
	)
}
