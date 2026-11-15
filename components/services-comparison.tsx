'use client'

import { ScrollReveal } from '@/components/scroll-reveal'
import { useMarketingContent } from '@/hooks/use-marketing-content'

/**
 * Package comparison table and delivery details for services.
 */
export function ServicesComparison () {
	const copy = useMarketingContent().servicesPage

	return (
		<section
			aria-labelledby="comparison-heading"
			className="border-t border-white/10 bg-ink/35 py-20 sm:py-24"
		>
			<div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12">
				<ScrollReveal className="mx-auto max-w-2xl text-center">
					<p className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
						{copy.eyebrow}
					</p>
					<h2
						id="comparison-heading"
						className="mt-4 text-3xl font-semibold text-white sm:text-4xl"
					>
						{copy.comparisonTitle}
					</h2>
					<p className="mt-4 text-base text-white/65">
						{copy.comparisonDescription}
					</p>
				</ScrollReveal>

				<ScrollReveal className="mt-10 overflow-x-auto">
					<table className="site-card min-w-full border-collapse overflow-hidden rounded-2xl border border-white/10 bg-surface/80 text-sm">
						<thead>
							<tr className="border-b border-white/10 text-left text-white/70">
								<th className="px-4 py-4 font-medium">Feature</th>
								<th className="px-4 py-4 font-medium">Landing</th>
								<th className="px-4 py-4 font-medium">Static</th>
								<th className="px-4 py-4 font-medium">Personal</th>
							</tr>
						</thead>
						<tbody>
							{copy.comparison.map((row) => (
								<tr
									key={row.feature}
									className="border-b border-white/10 last:border-b-0"
								>
									<td className="px-4 py-3.5 text-white/80">
										{row.feature}
									</td>
									<td className="px-4 py-3.5 text-white/60">
										{row.landing}
									</td>
									<td className="px-4 py-3.5 text-white/60">
										{row.static}
									</td>
									<td className="px-4 py-3.5 text-white/60">
										{row.personal}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</ScrollReveal>

				<div className="mt-16">
					<ScrollReveal>
						<h3 className="text-center text-2xl font-semibold text-white">
							{copy.deliveryTitle}
						</h3>
					</ScrollReveal>
					<ul className="mt-8 grid gap-5 lg:grid-cols-3">
						{copy.deliveryItems.map((item, index) => (
							<ScrollReveal
								key={item.id}
								delayClass={`scroll-reveal-delay-${index + 1}`}
							>
								<li
									className={[
										'site-card h-full rounded-2xl',
										'border border-white/10 bg-surface/80 p-6',
									].join(' ')}
								>
									<h4 className="text-lg font-semibold text-white">
										{item.title}
									</h4>
									<p className="mt-3 text-sm text-orange">
										{item.estimate}
									</p>
									<p className="mt-1 text-sm text-white/55">
										{item.revisions}
									</p>
									<p className="mt-5 text-xs uppercase tracking-[0.16em] text-white/40">
										{copy.includedTitle}
									</p>
									<ul className="mt-3 space-y-2">
										{item.includes.map((line) => (
											<li
												key={line}
												className="text-sm text-white/70"
											>
												· {line}
											</li>
										))}
									</ul>
								</li>
							</ScrollReveal>
						))}
					</ul>
				</div>

				<div className="mt-16">
					<ScrollReveal>
						<h3 className="text-center text-2xl font-semibold text-white">
							{copy.faqTitle}
						</h3>
					</ScrollReveal>
					<ul className="mx-auto mt-8 max-w-3xl space-y-3">
						{copy.faq.map((item, index) => (
							<ScrollReveal
								key={item.question}
								delayClass={`scroll-reveal-delay-${(index % 3) + 1}`}
							>
								<li className="site-card rounded-2xl border border-white/10 bg-surface/80 p-5">
									<details>
										<summary className="cursor-pointer list-none text-base font-semibold text-white">
											{item.question}
										</summary>
										<p className="mt-3 text-sm leading-6 text-white/65">
											{item.answer}
										</p>
									</details>
								</li>
							</ScrollReveal>
						))}
					</ul>
				</div>
			</div>
		</section>
	)
}
