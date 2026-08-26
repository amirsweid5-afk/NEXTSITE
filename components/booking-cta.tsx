import Link from 'next/link'

/**
 * Final homepage CTA that links visitors straight to booking.
 */
export function BookingCta () {
	return (
		<section
			id="book"
			aria-labelledby="booking-cta-heading"
			className={[
				'relative isolate overflow-hidden',
				'border-t border-white/10',
				'bg-surface py-24 sm:py-28 lg:py-32',
			].join(' ')}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
			>
				<div className="absolute inset-0 bg-linear-to-b from-ink/40 via-transparent to-ink/60" />
				<div className="absolute left-1/2 top-0 h-px w-[min(80%,36rem)] -translate-x-1/2 bg-linear-to-r from-transparent via-orange/50 to-transparent" />
				<div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/15 blur-[120px]" />
				<div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-gold/10 blur-[100px]" />
				<div className="absolute -right-12 top-10 h-48 w-48 rounded-full bg-highlight/10 blur-[90px]" />
			</div>

			<div className="relative z-10 mx-auto max-w-3xl px-6 text-center sm:px-10">
				<p className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
					Next Step
				</p>
				<h2
					id="booking-cta-heading"
					className={[
						'mt-5 text-3xl font-semibold tracking-tight',
						'text-white sm:text-4xl lg:text-5xl',
						'lg:leading-[1.1]',
					].join(' ')}
				>
					Ready to Build Your Website?
				</h2>
				<p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
					Let’s bring your idea to life with a modern website
					designed for you.
				</p>
				<Link
					href="/booking"
					className={[
						'mt-10 inline-flex min-h-14 w-full',
						'max-w-xs items-center justify-center',
						'sm:w-auto sm:min-w-[14rem]',
						'rounded-full bg-orange px-10',
						'text-sm font-semibold uppercase',
						'tracking-[0.22em] text-ink',
						'shadow-[0_0_0_0_rgba(232,120,18,0)]',
						'transition duration-300 ease-out',
						'hover:-translate-y-0.5 hover:bg-highlight',
						'hover:shadow-[0_12px_40px_rgba(209,172,44,0.35)]',
						'active:translate-y-0',
						'focus-visible:outline-2',
						'focus-visible:outline-offset-4',
					].join(' ')}
				>
					Book Now
				</Link>
			</div>
		</section>
	)
}
