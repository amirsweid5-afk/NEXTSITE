'use client'

import Link from 'next/link'
import { BookingCta } from '@/components/booking-cta'
import { PortfolioSection } from '@/components/portfolio-section'
import { useMarketingContent } from '@/hooks/use-marketing-content'

export default function PortfolioPage () {
	const copy = useMarketingContent().portfolioPage

	return (
		<>
			<section className="border-b border-white/10 px-6 py-10 sm:px-10 lg:px-12">
				<div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4">
					<div>
						<p className="text-xs uppercase tracking-[0.28em] text-orange">
							{copy.eyebrow}
						</p>
						<h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
							{copy.title}
						</h1>
						<p className="mt-3 max-w-xl text-sm text-white/55">
							{copy.description}
						</p>
						<p className="mt-2 text-xs text-white/40">
							{copy.emptyNote}
						</p>
					</div>
					<Link
						href="/booking"
						className={[
							'inline-flex min-h-11 items-center rounded-full',
							'bg-orange px-6 text-sm font-semibold text-ink',
						].join(' ')}
					>
						{copy.ctaLabel}
					</Link>
				</div>
			</section>
			<PortfolioSection />
			<BookingCta />
		</>
	)
}
