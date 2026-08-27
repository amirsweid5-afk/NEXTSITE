'use client'

import { useEffect, useRef, useState } from 'react'
import { useContent } from '@/components/language-provider'

interface CoreValueIcon {
	id: string
	icon: 'quality' | 'personalization' | 'simplicity' | 'satisfaction'
}

const VALUE_ICONS: CoreValueIcon[] = [
	{ id: 'quality', icon: 'quality' },
	{ id: 'personalization', icon: 'personalization' },
	{ id: 'simplicity', icon: 'simplicity' },
	{ id: 'satisfaction', icon: 'satisfaction' },
]

function ValueIcon ({ type }: { type: CoreValueIcon['icon'] }) {
	if (type === 'quality') {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				className="h-6 w-6"
			>
				<path
					d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5L12 14.8 7.5 16.7l.9-5L4.8 8.2l5-.7L12 3Z"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinejoin="round"
				/>
			</svg>
		)
	}

	if (type === 'personalization') {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				className="h-6 w-6"
			>
				<path
					d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					d="M5 19c1.6-3.2 4-4.5 7-4.5s5.4 1.3 7 4.5"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
				<path
					d="M16.5 6.5l1.5 1.5"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>
		)
	}

	if (type === 'simplicity') {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				className="h-6 w-6"
			>
				<rect
					x="4"
					y="5"
					width="16"
					height="14"
					rx="2"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					d="M8 10h8M8 14h5"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>
		)
	}

	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-6 w-6"
		>
			<path
				d="M8.5 11.5c1.4 0 2.5-1.3 2.5-3S9.9 5.5 8.5 5.5 6 6.8 6 8.5s1.1 3 2.5 3Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M15.5 11.5c1.4 0 2.5-1.3 2.5-3S16.9 5.5 15.5 5.5 13 6.8 13 8.5s1.1 3 2.5 3Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M4.5 18.5c.8-2.4 2.6-3.5 4-3.5s3.2 1.1 4 3.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M11.5 18.5c.8-2.4 2.6-3.5 4-3.5s3.2 1.1 4 3.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	)
}

/**
 * About Us mission statement and core values section.
 */
export function OurMission () {
	const copy = useContent().about.mission
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
			{ threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
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
			id="our-mission"
			aria-labelledby="our-mission-heading"
			className={[
				'relative isolate overflow-hidden',
				'border-t border-white/10 bg-surface',
				'py-20 sm:py-24 lg:py-28',
			].join(' ')}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
			>
				<div className="absolute left-1/2 top-0 h-px w-[min(72%,40rem)] -translate-x-1/2 bg-linear-to-r from-transparent via-orange/35 to-transparent" />
				<div className="absolute -left-20 top-16 h-64 w-64 rounded-full bg-orange/10 blur-[100px]" />
				<div className="absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-gold/10 blur-[90px]" />
			</div>

			<div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
				<div className="mx-auto max-w-3xl text-center">
					<p
						className={revealClass('our-story-delay-1')}
					>
						<span className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
							{copy.eyebrow}
						</span>
					</p>
					<h2
						id="our-mission-heading"
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
							'mt-6 text-base leading-7',
							'text-white/65 sm:text-lg',
							'sm:leading-8',
						].join(' ')}
					>
						{copy.paragraphOne}
					</p>
					<p
						className={[
							revealClass('our-story-delay-4'),
							'mt-4 text-base leading-7',
							'text-white/55 sm:text-lg',
							'sm:leading-8',
						].join(' ')}
					>
						{copy.paragraphTwo}
					</p>
				</div>

				<ul
					className={[
						'mt-14 grid gap-6',
						'sm:grid-cols-2 lg:mt-16',
						'lg:grid-cols-4 lg:gap-7',
					].join(' ')}
				>
					{copy.values.map((value, index) => {
						const icon = VALUE_ICONS.find(
							(item) => item.id === value.id,
						)?.icon ?? 'quality'

						return (
							<li
								key={value.id}
								className={revealClass(
									`our-story-delay-${index + 5}`,
								)}
							>
								<article
									className={[
										'group flex h-full flex-col',
										'rounded-2xl border border-white/10',
										'bg-ink/60 p-7',
										'shadow-[0_20px_50px_rgba(0,0,0,0.35)]',
										'transition duration-300 ease-out',
										'hover:-translate-y-1.5',
										'hover:border-orange/45',
										'hover:shadow-[0_24px_60px_rgba(232,120,18,0.12)]',
									].join(' ')}
								>
									<div
										className={[
											'inline-flex h-12 w-12 items-center',
											'justify-center rounded-xl',
											'border border-orange/30 bg-orange/10',
											'text-orange transition duration-300',
											'group-hover:border-orange/60',
											'group-hover:bg-orange/15',
											'group-hover:shadow-[0_0_24px_rgba(232,120,18,0.25)]',
										].join(' ')}
									>
										<ValueIcon type={icon} />
									</div>

									<h3 className="mt-6 text-lg font-semibold tracking-tight text-white">
										{value.title}
									</h3>
									<p className="mt-3 flex-1 text-sm leading-6 text-white/60">
										{value.description}
									</p>
								</article>
							</li>
						)
					})}
				</ul>
			</div>
		</section>
	)
}
