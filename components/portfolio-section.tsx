'use client'

import { useContent } from '@/components/language-provider'

/**
 * Concept project directions. Not presented as real client work.
 */
export function PortfolioSection () {
	const copy = useContent().home.portfolio

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
				<div className="mx-auto max-w-2xl text-center">
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
				</div>
				<ul className="mt-12 grid gap-6 md:grid-cols-3">
					{copy.items.map((item) => (
						<li key={item.id}>
							<article
								className={[
									'flex h-full flex-col rounded-2xl',
									'border border-white/10 bg-surface/80 p-6',
								].join(' ')}
							>
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
					))}
				</ul>
			</div>
		</section>
	)
}
