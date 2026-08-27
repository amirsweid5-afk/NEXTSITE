'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useContent } from '@/components/language-provider'

interface HeroSectionProps {
	backgroundSrc?: string
	backgroundAlt?: string
}

/**
 * Full-viewport hero used on the booking page.
 */
export function HeroSection ({
	backgroundSrc,
	backgroundAlt = '',
}: HeroSectionProps) {
	const hero = useContent().booking.hero

	return (
		<section
			className={[
				'relative isolate flex min-h-[calc(100svh-4.5rem)]',
				'flex-col justify-end overflow-hidden',
				'bg-ink px-6 pb-16 pt-24 sm:px-10',
				'lg:px-16',
			].join(' ')}
		>
			{backgroundSrc ? (
				<>
					<Image
						src={backgroundSrc}
						alt={backgroundAlt}
						fill
						preload
						sizes="100vw"
						className="object-cover object-center"
					/>
					<div
						aria-hidden="true"
						className={[
							'absolute inset-0 bg-linear-to-t',
							'from-ink via-ink/80 to-ink/40',
						].join(' ')}
					/>
				</>
			) : (
				<p
					aria-hidden="true"
					className={[
						'pointer-events-none absolute',
						'end-[-0.1em] top-8 select-none',
						'text-[min(42vw,18rem)] font-semibold',
						'leading-none tracking-tighter',
						'text-wash',
					].join(' ')}
				>
					{hero.eyebrow}
				</p>
			)}
			<div className="relative z-10 mx-auto w-full max-w-6xl">
				<p
					className={[
						'mb-4 text-xs font-medium',
						'uppercase tracking-[0.28em]',
						'text-gold',
					].join(' ')}
				>
					{hero.eyebrow}
				</p>
				<h1
					className={[
						'max-w-3xl text-4xl font-semibold',
						'leading-[1.05] tracking-tight',
						'text-highlight sm:text-6xl',
						'lg:text-7xl',
					].join(' ')}
				>
					{hero.title}
				</h1>
				<p
					className={[
						'mt-6 max-w-xl text-base',
						'leading-7 text-gold',
						'sm:text-lg sm:leading-8',
					].join(' ')}
				>
					{hero.description}
				</p>
				{hero.ctaLabel ? (
					<Link
						href="/booking"
						className={[
							'mt-10 inline-flex min-h-14',
							'items-center rounded-full',
							'bg-highlight px-10 text-base',
							'font-semibold uppercase',
							'tracking-[0.22em] text-ink',
							'focus-visible:outline-2',
							'focus-visible:outline-offset-4',
						].join(' ')}
					>
						{hero.ctaLabel}
					</Link>
				) : null}
			</div>
		</section>
	)
}
