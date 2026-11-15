'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useMarketingContent } from '@/hooks/use-marketing-content'

/**
 * Home-page process steps with booking CTA.
 */
export function HowItWorksSection () {
	const copy = useMarketingContent().home.howItWorks

	return (
		<section
			id="how-it-works"
			aria-labelledby="how-it-works-heading"
			className={[
				'relative isolate overflow-hidden',
				'border-t border-white/10 bg-ink/40',
				'py-20 sm:py-24 lg:py-28',
			].join(' ')}
		>
			<div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 lg:px-12">
				<ScrollReveal className="mx-auto max-w-2xl text-center">
					<p className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
						{copy.eyebrow}
					</p>
					<h2
						id="how-it-works-heading"
						className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
					>
						{copy.title}
					</h2>
					<p className="mt-4 text-base leading-7 text-white/65">
						{copy.description}
					</p>
				</ScrollReveal>

				<ol className="mt-12 grid gap-5 sm:grid-cols-2">
					{copy.steps.map((step, index) => (
						<ScrollReveal
							key={step.step}
							delayClass={`scroll-reveal-delay-${index + 1}`}
						>
							<li
								className={[
									'site-card h-full rounded-2xl',
									'border border-white/10 bg-surface/80 p-6',
								].join(' ')}
							>
								<p className="text-sm font-semibold text-orange">
									{step.step}
								</p>
								<h3 className="mt-2 text-lg font-semibold text-white">
									{step.title}
								</h3>
								<p className="mt-2 text-sm leading-6 text-white/70">
									{step.description}
								</p>
							</li>
						</ScrollReveal>
					))}
				</ol>

				<ScrollReveal className="mt-12 text-center">
					<Link
						href="/booking"
						className={[
							'inline-flex min-h-12 items-center justify-center',
							'rounded-full bg-orange px-8 text-sm font-semibold',
							'text-ink shadow-[0_0_28px_rgba(46,196,222,0.35)]',
							'transition hover:bg-highlight',
							'focus-visible:outline-2 focus-visible:outline-offset-4',
						].join(' ')}
					>
						{copy.ctaLabel}
					</Link>
				</ScrollReveal>
			</div>
		</section>
	)
}
