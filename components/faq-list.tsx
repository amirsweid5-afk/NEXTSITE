'use client'

import { ScrollReveal } from '@/components/scroll-reveal'
import { type FaqItem } from '@/lib/marketing-content'

interface FaqListProps {
	items: FaqItem[]
}

/**
 * Accessible FAQ accordion list.
 */
export function FaqList ({ items }: FaqListProps) {
	return (
		<ul className="mx-auto max-w-3xl space-y-3">
			{items.map((item, index) => (
				<ScrollReveal
					key={item.question}
					delayClass={`scroll-reveal-delay-${(index % 4) + 1}`}
				>
					<li className="site-card rounded-2xl border border-white/10 bg-surface/80 p-5">
						<details>
							<summary className="cursor-pointer list-none text-base font-semibold text-white marker:content-none">
								<span className="flex items-start justify-between gap-4">
									{item.question}
									<span aria-hidden="true" className="text-orange">
										+
									</span>
								</span>
							</summary>
							<p className="mt-3 text-sm leading-7 text-white/65">
								{item.answer}
							</p>
						</details>
					</li>
				</ScrollReveal>
			))}
		</ul>
	)
}
