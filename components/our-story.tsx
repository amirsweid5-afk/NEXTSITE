'use client'

import { useEffect, useRef, useState } from 'react'
import { useContent } from '@/components/language-provider'

function StoryVisual ({
	isVisible,
}: {
	isVisible: boolean
}) {
	const copy = useContent().about.story
	return (
		<div
			className={[
				'our-story-reveal our-story-delay-2',
				isVisible ? 'is-visible' : '',
			].join(' ')}
		>
			<div
				aria-hidden="true"
				className={[
					'relative mx-auto w-full max-w-md',
					'lg:max-w-none',
				].join(' ')}
			>
				<div className="absolute -left-6 top-8 h-40 w-40 rounded-full bg-orange/15 blur-[80px]" />
				<div className="absolute -right-4 bottom-6 h-36 w-36 rounded-full bg-gold/15 blur-[70px]" />

				<div
					className={[
						'relative overflow-hidden rounded-2xl',
						'border border-white/10 bg-surface/90',
						'shadow-[0_24px_60px_rgba(0,0,0,0.45)]',
					].join(' ')}
				>
					<div className="border-b border-white/10 px-6 py-5">
						<p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
							{copy.journeyEyebrow}
						</p>
						<p className="mt-2 text-sm text-white/55">
							{copy.journeyCaption}
						</p>
					</div>

					<ol className="space-y-0 px-6 py-2">
						{copy.steps.map((item, index) => (
							<li
								key={item.step}
								className={[
									'relative flex gap-4 py-5',
									index < 2
										? 'border-b border-white/10'
										: '',
								].join(' ')}
							>
								{index < 2 ? (
									<span
										aria-hidden="true"
										className={[
											'absolute start-[1.15rem] top-[3.1rem]',
											'h-[calc(100%-1.5rem)] w-px',
											'bg-linear-to-b from-orange/50',
											'to-white/10',
										].join(' ')}
									/>
								) : null}
								<span
									className={[
										'relative z-10 flex h-9 w-9',
										'shrink-0 items-center justify-center',
										'rounded-full border border-orange/35',
										'bg-orange/10 text-xs font-semibold',
										'text-orange',
									].join(' ')}
								>
									{item.step}
								</span>
								<div>
									<p className="text-sm font-medium text-white">
										{item.label}
									</p>
									<p className="mt-1 text-xs leading-5 text-white/50">
										{item.detail}
									</p>
								</div>
							</li>
						))}
					</ol>

					<div
						className={[
							'mx-6 mb-6 rounded-xl border',
							'border-gold/25 bg-gold/8 p-4',
						].join(' ')}
					>
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-highlight">
							{copy.todayTitle}
						</p>
						<ul className="mt-3 flex flex-wrap gap-2">
							{copy.specialties.map((specialty) => (
								<li
									key={specialty}
									className={[
										'rounded-full border border-white/10',
										'bg-ink/60 px-3 py-1.5',
										'text-xs text-white/70',
									].join(' ')}
								>
									{specialty}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

/**
 * Personal About Us story section with scroll-triggered reveal.
 */
export function OurStory () {
	const copy = useContent().about.story
	const sectionRef = useRef<HTMLElement>(null)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const section = sectionRef.current
		if (!section) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setIsVisible(true)
					observer.disconnect()
				}
			},
			{ threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
		)

		observer.observe(section)
		return () => observer.disconnect()
	}, [])

	const revealClass = (delay: string) =>
		[
			'our-story-reveal',
			delay,
			isVisible ? 'is-visible' : '',
		].join(' ')

	return (
		<section
			ref={sectionRef}
			id="our-story"
			aria-labelledby="our-story-heading"
			className={[
				'relative isolate overflow-hidden',
				'border-t border-white/10 bg-ink',
				'py-20 sm:py-24 lg:py-28',
			].join(' ')}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
			>
				<div className="absolute left-1/2 top-0 h-px w-[min(72%,40rem)] -translate-x-1/2 bg-linear-to-r from-transparent via-gold/30 to-transparent" />
				<div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-gold/10 blur-[100px]" />
				<div className="absolute -left-16 bottom-12 h-56 w-56 rounded-full bg-orange/10 blur-[90px]" />
			</div>

			<div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
				<div
					className={[
						'grid items-center gap-12',
						'lg:grid-cols-2 lg:gap-16 xl:gap-20',
					].join(' ')}
				>
					<div>
						<p
							className={revealClass('our-story-delay-1')}
						>
							<span className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
								{copy.eyebrow}
							</span>
						</p>
						<h2
							id="our-story-heading"
							className={[
								revealClass('our-story-delay-2'),
								'mt-4 text-3xl font-semibold',
								'tracking-tight text-white',
								'sm:text-4xl lg:text-5xl',
							].join(' ')}
						>
							{copy.title}
						</h2>
						<p
							className={[
								revealClass('our-story-delay-3'),
								'mt-5 text-base leading-7',
								'text-white/65 sm:text-lg',
								'sm:leading-8',
							].join(' ')}
						>
							{copy.intro}
						</p>

						<div
							className={[
								revealClass('our-story-delay-4'),
								'mt-8 rounded-2xl border',
								'border-white/10 bg-surface/70 p-6',
							].join(' ')}
						>
							<h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
								{copy.whoTitle}
							</h3>
							<p className="mt-3 text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
								{copy.whoBody}
							</p>
							<ul className="mt-4 space-y-2">
								{copy.specialties.map((specialty) => (
									<li
										key={specialty}
										className={[
											'flex items-center gap-3',
											'text-sm text-white/75',
										].join(' ')}
									>
										<span
											aria-hidden="true"
											className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange shadow-[0_0_8px_#e87812]"
										/>
										{specialty}
									</li>
								))}
							</ul>
						</div>

						<div className="mt-8 space-y-8">
							{copy.blocks.map((block, index) => (
								<article
									key={block.id}
									className={revealClass(
										`our-story-delay-${index + 5}`,
									)}
								>
									<h3 className="text-lg font-semibold tracking-tight text-white">
										{block.title}
									</h3>
									<p className="mt-3 text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
										{block.description}
									</p>
								</article>
							))}
						</div>
					</div>

					<StoryVisual isVisible={isVisible} />
				</div>
			</div>
		</section>
	)
}
