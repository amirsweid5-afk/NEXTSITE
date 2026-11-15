'use client'

import { FaqList } from '@/components/faq-list'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useMarketingContent } from '@/hooks/use-marketing-content'

export default function FaqPage () {
	const copy = useMarketingContent().faqPage

	return (
		<section className="relative isolate py-16 sm:py-20 lg:py-24">
			<div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12">
				<ScrollReveal className="mx-auto max-w-2xl text-center">
					<p className="text-xs uppercase tracking-[0.28em] text-orange">
						{copy.eyebrow}
					</p>
					<h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
						{copy.title}
					</h1>
					<p className="mt-4 text-base text-white/65">
						{copy.description}
					</p>
				</ScrollReveal>
				<div className="mt-12">
					<FaqList items={copy.items} />
				</div>
			</div>
		</section>
	)
}
