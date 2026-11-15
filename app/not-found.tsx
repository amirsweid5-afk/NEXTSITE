'use client'

import Link from 'next/link'
import { useMarketingContent } from '@/hooks/use-marketing-content'

/**
 * Branded 404 for unknown routes.
 */
export default function NotFound () {
	const copy = useMarketingContent().notFound

	return (
		<main className="flex min-h-[70vh] flex-1 flex-col items-center justify-center px-6 py-20 text-center">
			<p className="font-brand home-hero-brand text-5xl text-orange sm:text-6xl">
				NEXTSITE
			</p>
			<h1 className="mt-8 text-3xl font-semibold text-white sm:text-4xl">
				{copy.title}
			</h1>
			<p className="mt-4 max-w-md text-base text-white/60">
				{copy.description}
			</p>
			<div className="mt-10 flex flex-wrap items-center justify-center gap-3">
				<Link
					href="/"
					className={[
						'inline-flex min-h-12 items-center rounded-full',
						'bg-orange px-8 text-sm font-semibold text-ink',
					].join(' ')}
				>
					{copy.homeLabel}
				</Link>
				<Link
					href="/booking"
					className={[
						'inline-flex min-h-12 items-center rounded-full',
						'border border-white/20 px-8 text-sm font-semibold',
						'text-white hover:border-orange/50',
					].join(' ')}
				>
					{copy.bookingLabel}
				</Link>
			</div>
		</main>
	)
}
