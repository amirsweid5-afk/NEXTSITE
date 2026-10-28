'use client'

import Link from 'next/link'
import { useContent } from '@/components/language-provider'

/**
 * Four-step process and a booking call to action.
 */
export function HowWeWork () {
	const copy = useContent().about.process

	return (
		<section
			id="how-we-work"
			aria-labelledby="how-we-work-heading"
			className={[
				'relative isolate overflow-hidden',
				'border-t border-white/10 bg-ink/45',
				'py-20 sm:py-24 lg:py-28',
			].join(' ')}
		>
			<div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 lg:px-12">
				<div className="mx-auto max-w-2xl text-center">
					<p className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
						{copy.eyebrow}
					</p>
					<h2
						id="how-we-work-heading"
						className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
					>
						{copy.title}
					</h2>
					<p className="mt-4 text-base leading-7 text-white/65">
						{copy.description}
					</p>
				</div>
				<ol className="mt-12 grid gap-5 sm:grid-cols-2">
					{copy.steps.map((step) => (
						<li
							key={step.step}
							className={[
								'rounded-2xl border border-white/10',
								'bg-surface/80 p-6',
							].join(' ')}
						>
							<p className="text-sm font-semibold text-orange">
								{step.step}
							</p>
							<h3 className="mt-2 text-lg font-semibold text-white">
								{step.title}
							</h3>
							<p className="mt-2 max-w-prose text-sm leading-6 text-white/70">
								{step.description}
							</p>
						</li>
					))}
				</ol>
				<div className="mt-12 text-center">
					<Link
						href="/booking"
						className={[
							'inline-flex min-h-12 items-center',
							'justify-center rounded-full bg-orange px-8',
							'text-sm font-semibold text-ink',
							'focus-visible:outline-2',
							'focus-visible:outline-offset-4',
						].join(' ')}
					>
						{copy.ctaLabel}
					</Link>
				</div>
			</div>
		</section>
	)
}
