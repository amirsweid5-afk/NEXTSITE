'use client'

import Link from 'next/link'
import { useContent } from '@/components/language-provider'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useMarketingContent } from '@/hooks/use-marketing-content'

/**
 * Concept project directions. Not presented as real client work.
 */
export function PortfolioSection () {
	const copy = useContent().home.portfolio
	const marketing = useMarketingContent()

	return (
		<section
			id="work"
			aria-labelledby="portfolio-heading"
			className={[
				'relative isolate overflow-hidden',
				'border-t border-white/10 bg-ink/40',
				'py-20 sm:py-24 lg:py-28',
			].join(' ')}
		>
			<div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
				<ScrollReveal className="mx-auto max-w-2xl text-center">
					<p className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
						{copy.eyebrow}
					</p>
					<h2
						id="portfolio-heading"
						className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
					>
						{copy.title}
					</h2>
					<p className="mt-4 text-base leading-7 text-white/65 sm:text-lg">
						{copy.description}
					</p>
				</ScrollReveal>
				<ul className="mt-12 grid gap-6 md:grid-cols-3">
					{copy.items.map((item, index) => (
						<ScrollReveal
							key={item.id}
							delayClass={`scroll-reveal-delay-${index + 1}`}
						>
							<li>
								<article
									className={[
										'site-card flex h-full flex-col',
										'rounded-2xl border border-white/10',
										'bg-surface/80 p-6',
									].join(' ')}
								>
									<div
										aria-hidden="true"
										className={[
											'mb-5 aspect-16/10 rounded-xl',
											'border border-white/10',
											'bg-linear-to-br from-orange/20 via-surface to-ink',
										].join(' ')}
									/>
									<p className="text-xs font-medium uppercase tracking-[0.18em] text-orange">
										{copy.conceptLabel}
									</p>
									<h3 className="mt-3 text-xl font-semibold text-white">
										{item.name}
									</h3>
									<p className="mt-1 text-sm text-white/50">
										{item.category}
									</p>
									<p className="mt-4 text-sm leading-6 text-white/70">
										{item.description}
									</p>
								</article>
							</li>
						</ScrollReveal>
					))}
				</ul>
				<ScrollReveal className="mt-10 text-center">
					<Link
						href="/portfolio"
						className={[
							'inline-flex min-h-11 items-center rounded-full',
							'border border-white/20 px-6 text-sm font-semibold',
							'text-white transition hover:border-orange/45',
							'hover:text-orange',
						].join(' ')}
					>
						{marketing.home.portfolioCta}
					</Link>
				</ScrollReveal>
			</div>
		</section>
	)
}
