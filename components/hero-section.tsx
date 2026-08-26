import Image from 'next/image'
import Link from 'next/link'

interface HeroSectionProps {
	eyebrow: string
	title: string
	description: string
	ctaLabel?: string
	ctaHref?: string
	backgroundSrc?: string
	backgroundAlt?: string
}

/**
 * Full-viewport hero used on each marketing page.
 */
export function HeroSection ({
	eyebrow,
	title,
	description,
	ctaLabel,
	ctaHref,
	backgroundSrc,
	backgroundAlt = '',
}: HeroSectionProps) {
	return (
		<section
			className={[
				'relative isolate flex min-h-[calc(100svh-4.5rem)]',
				'flex-col justify-end overflow-hidden',
				'px-6 pb-16 pt-24 sm:px-10',
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
						'right-[-0.1em] top-8 select-none',
						'text-[min(42vw,18rem)] font-semibold',
						'leading-none tracking-tighter',
						'text-wash',
					].join(' ')}
				>
					{eyebrow}
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
					{eyebrow}
				</p>
				<h1
					className={[
						'max-w-3xl text-4xl font-semibold',
						'leading-[1.05] tracking-tight',
						'text-highlight sm:text-6xl',
						'lg:text-7xl',
					].join(' ')}
				>
					{title}
				</h1>
				<p
					className={[
						'mt-6 max-w-xl text-base',
						'leading-7 text-gold',
						'sm:text-lg sm:leading-8',
					].join(' ')}
				>
					{description}
				</p>
				{ctaLabel && ctaHref ? (
					<Link
						href={ctaHref}
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
						{ctaLabel}
					</Link>
				) : null}
			</div>
		</section>
	)
}
