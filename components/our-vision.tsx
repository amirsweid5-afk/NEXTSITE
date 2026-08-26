'use client'

import { useEffect, useRef, useState } from 'react'

interface VisionPoint {
	id: string
	number: string
	title: string
	description: string
	icon: 'grow' | 'improve' | 'digital'
}

const VISION_TRAITS = [
	'Modern',
	'Professional',
	'Fast',
	'Accessible',
	'Tailored to each client',
] as const

const VISION_POINTS: VisionPoint[] = [
	{
		id: 'grow-together',
		number: '01',
		title: 'Grow Together',
		description:
			'Build long-term relationships with clients and grow alongside their businesses.',
		icon: 'grow',
	},
	{
		id: 'keep-improving',
		number: '02',
		title: 'Keep Improving',
		description:
			'Continuously learn, improve our skills, and stay up to date with modern web technologies and design.',
		icon: 'improve',
	},
	{
		id: 'make-ideas-digital',
		number: '03',
		title: 'Make Ideas Digital',
		description:
			'Turn our clients\' ideas into professional websites that help them present themselves confidently online.',
		icon: 'digital',
	},
]

function VisionIcon ({ type }: { type: VisionPoint['icon'] }) {
	if (type === 'grow') {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				className="h-6 w-6"
			>
				<path
					d="M6 17l4-4 3 3 5-6"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M16 7h4v4"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		)
	}

	if (type === 'improve') {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				className="h-6 w-6"
			>
				<path
					d="M12 5v14M5 12h14"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
				<path
					d="M8 8l8 8"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					opacity="0.45"
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
			<rect
				x="4"
				y="5"
				width="16"
				height="12"
				rx="2"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M8 10h8M8 13h5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M9 19h6"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	)
}

/**
 * About Us vision statement and forward-looking goals.
 */
export function OurVision () {
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
			id="our-vision"
			aria-labelledby="our-vision-heading"
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
				<div className="absolute left-1/2 top-0 h-px w-[min(72%,40rem)] -translate-x-1/2 bg-linear-to-r from-transparent via-highlight/35 to-transparent" />
				<div className="absolute -right-24 top-12 h-72 w-72 rounded-full bg-highlight/10 blur-[110px]" />
				<div className="absolute -left-16 bottom-16 h-56 w-56 rounded-full bg-orange/10 blur-[90px]" />
			</div>

			<div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
				<div
					className={[
						'grid items-start gap-10',
						'lg:grid-cols-[0.9fr_1.1fr] lg:gap-16',
						'xl:gap-20',
					].join(' ')}
				>
					<div className="lg:pt-2">
						<p className={revealClass('our-story-delay-1')}>
							<span className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
								Looking Ahead
							</span>
						</p>
						<h2
							id="our-vision-heading"
							className={[
								revealClass('our-story-delay-2'),
								'mt-4 text-4xl font-semibold',
								'leading-[1.05] tracking-tight',
								'text-white sm:text-5xl',
								'lg:text-[3.25rem] xl:text-6xl',
							].join(' ')}
						>
							Our{' '}
							<span className="text-highlight">
								Vision
							</span>
						</h2>
					</div>

					<div>
						<p
							className={[
								revealClass('our-story-delay-3'),
								'text-base leading-7',
								'text-white/70 sm:text-lg',
								'sm:leading-8',
							].join(' ')}
						>
							Our vision is to become a trusted web
							development partner for businesses,
							professionals, and individuals who want to
							build a strong presence online.
						</p>
						<p
							className={[
								revealClass('our-story-delay-4'),
								'mt-4 text-base leading-7',
								'text-white/55 sm:text-lg',
								'sm:leading-8',
							].join(' ')}
						>
							We want to create websites that feel
							modern, professional, fast, and accessible
							— tailored to each client&apos;s identity
							and goals.
						</p>
						<ul
							className={[
								revealClass('our-story-delay-5'),
								'mt-6 flex flex-wrap gap-2',
							].join(' ')}
						>
							{VISION_TRAITS.map((trait) => (
								<li
									key={trait}
									className={[
										'rounded-full border',
										'border-white/10 bg-surface/70',
										'px-3.5 py-1.5 text-xs',
										'text-white/70',
									].join(' ')}
								>
									{trait}
								</li>
							))}
						</ul>
						<p
							className={[
								revealClass('our-story-delay-6'),
								'mt-6 text-sm leading-6',
								'text-white/50 sm:text-base',
								'sm:leading-7',
							].join(' ')}
						>
							As we grow, we want to keep improving our
							skills, adopting better technologies, and
							creating better digital experiences for
							every client.
						</p>
					</div>
				</div>

				<ul
					className={[
						'mt-16 grid gap-6',
						'md:grid-cols-3 lg:mt-20 lg:gap-7',
					].join(' ')}
				>
					{VISION_POINTS.map((point, index) => (
						<li
							key={point.id}
							className={revealClass(
								`our-story-delay-${index + 7}`,
							)}
						>
							<article
								className={[
									'group relative flex h-full',
									'flex-col overflow-hidden',
									'rounded-2xl border border-white/10',
									'bg-surface/70 p-7',
									'transition duration-300 ease-out',
									'hover:-translate-y-1',
									'hover:border-highlight/40',
									'hover:shadow-[0_20px_50px_rgba(209,172,44,0.1)]',
								].join(' ')}
							>
								<span
									aria-hidden="true"
									className={[
										'absolute right-5 top-4',
										'text-4xl font-semibold',
										'leading-none tracking-tight',
										'text-white/6',
									].join(' ')}
								>
									{point.number}
								</span>
								<div
									className={[
										'inline-flex h-11 w-11 items-center',
										'justify-center rounded-xl',
										'border border-highlight/30',
										'bg-highlight/10 text-highlight',
										'transition duration-300',
										'group-hover:border-highlight/55',
										'group-hover:bg-highlight/15',
									].join(' ')}
								>
									<VisionIcon type={point.icon} />
								</div>
								<p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-orange">
									{point.number}
								</p>
								<h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
									{point.title}
								</h3>
								<p className="mt-3 text-sm leading-6 text-white/60">
									{point.description}
								</p>
							</article>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
