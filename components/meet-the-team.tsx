'use client'

import { ScrollReveal } from '@/components/scroll-reveal'
import { useMarketingContent } from '@/hooks/use-marketing-content'

/**
 * Team section with honest placeholders until real profiles exist.
 */
export function MeetTheTeam () {
	const copy = useMarketingContent().aboutTeam

	return (
		<section
			id="team"
			aria-labelledby="team-heading"
			className={[
				'relative isolate overflow-hidden',
				'border-t border-white/10 bg-ink/35',
				'py-20 sm:py-24',
			].join(' ')}
		>
			<div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 lg:px-12">
				<ScrollReveal className="mx-auto max-w-2xl text-center">
					<p className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
						{copy.eyebrow}
					</p>
					<h2
						id="team-heading"
						className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
					>
						{copy.title}
					</h2>
					<p className="mt-4 text-base leading-7 text-white/65">
						{copy.description}
					</p>
					<p className="mt-2 text-sm text-white/45">
						{copy.placeholderNote}
					</p>
				</ScrollReveal>

				<ul className="mt-12 grid gap-5 sm:grid-cols-3">
					{copy.members.map((member, index) => (
						<ScrollReveal
							key={member.id}
							delayClass={`scroll-reveal-delay-${index + 1}`}
						>
							<li
								className={[
									'site-card flex h-full flex-col',
									'rounded-2xl border border-white/10',
									'bg-surface/80 p-6',
								].join(' ')}
							>
								<div
									aria-hidden="true"
									className={[
										'mb-5 aspect-square w-full max-w-[8rem]',
										'rounded-2xl border border-dashed',
										'border-white/20 bg-ink/50',
									].join(' ')}
								/>
								<p className="text-xs uppercase tracking-[0.18em] text-orange">
									{member.role}
								</p>
								<h3 className="mt-2 text-lg font-semibold text-white/80">
									{member.namePlaceholder}
								</h3>
								<p className="mt-3 text-sm leading-6 text-white/55">
									{member.bioPlaceholder}
								</p>
							</li>
						</ScrollReveal>
					))}
				</ul>
			</div>
		</section>
	)
}
