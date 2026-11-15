'use client'

import { ScrollReveal } from '@/components/scroll-reveal'

interface LegalSection {
	heading: string
	body: string
}

interface LegalPageProps {
	title: string
	updated: string
	sections: LegalSection[]
}

/**
 * Shared layout for Privacy and Terms pages.
 */
export function LegalPage ({
	title,
	updated,
	sections,
}: LegalPageProps) {
	return (
		<section className="relative isolate py-16 sm:py-20 lg:py-24">
			<div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-12">
				<ScrollReveal>
					<h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
						{title}
					</h1>
					<p className="mt-3 text-sm text-white/45">{updated}</p>
				</ScrollReveal>

				<div className="mt-10 space-y-8">
					{sections.map((section, index) => (
						<ScrollReveal
							key={section.heading}
							delayClass={`scroll-reveal-delay-${(index % 4) + 1}`}
						>
							<article className="site-card rounded-2xl border border-white/10 bg-surface/70 p-6">
								<h2 className="text-lg font-semibold text-white">
									{section.heading}
								</h2>
								<p className="mt-3 text-sm leading-7 text-white/65">
									{section.body}
								</p>
							</article>
						</ScrollReveal>
					))}
				</div>
			</div>
		</section>
	)
}
