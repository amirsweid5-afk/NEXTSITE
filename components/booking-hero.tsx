'use client'

import { useContent } from '@/components/language-provider'
import { type BookingHeroStep } from '@/lib/site-content'

interface StepLayout {
	className: string
	delayClass: string
}

const STEP_LAYOUTS: Record<string, StepLayout> = {
	'01': {
		className: 'left-0 top-[8%] hidden sm:flex',
		delayClass: 'booking-hero-delay-3',
	},
	'02': {
		className: 'right-0 top-[4%] hidden sm:flex',
		delayClass: 'booking-hero-delay-4',
	},
	'03': {
		className: 'bottom-[10%] right-[-2%] hidden sm:flex',
		delayClass: 'booking-hero-delay-5',
	},
}

const SPARKS: [number, number][] = [
	[90, 120],
	[160, 70],
	[240, 150],
	[320, 48],
	[400, 110],
	[470, 180],
	[80, 280],
	[200, 340],
	[360, 310],
	[480, 360],
	[140, 400],
	[430, 430],
]

/**
 * Glowing threshold that marks the start of a booking.
 */
function PortalGlyph () {
	return (
		<div className="relative mx-auto aspect-square w-full max-w-[28rem]">
			<div
				aria-hidden="true"
				className={[
					'booking-hero-breathe absolute',
					'left-1/2 top-1/2 h-[72%] w-[72%]',
					'-translate-x-1/2 -translate-y-1/2',
					'rounded-full bg-orange/30 blur-[70px]',
				].join(' ')}
			/>
			<div
				aria-hidden="true"
				className={[
					'booking-hero-orbit absolute',
					'-left-6 top-8 h-32 w-32',
					'rounded-full bg-gold/20 blur-[50px]',
				].join(' ')}
			/>
			<div
				aria-hidden="true"
				className={[
					'booking-hero-rise absolute bottom-0 left-1/2',
					'h-[70%] w-24 -translate-x-1/2',
					'bg-[linear-gradient(to_top,rgba(232,120,18,0.35),rgba(209,172,44,0.08)_55%,transparent)]',
					'blur-xl',
				].join(' ')}
			/>

			<svg
				aria-hidden="true"
				className="relative z-10 h-full w-full"
				viewBox="0 0 560 560"
				fill="none"
			>
				<defs>
					<radialGradient
						id="bookingPortalCore"
						cx="50%"
						cy="50%"
						r="50%"
					>
						<stop
							offset="0%"
							stopColor="#d3ac2c"
							stopOpacity="0.95"
						/>
						<stop
							offset="42%"
							stopColor="#e87812"
							stopOpacity="0.55"
						/>
						<stop
							offset="100%"
							stopColor="#e87812"
							stopOpacity="0"
						/>
					</radialGradient>
					<linearGradient
						id="bookingPortalRing"
						x1="0"
						y1="0"
						x2="1"
						y2="1"
					>
						<stop
							offset="0%"
							stopColor="#e87812"
							stopOpacity="0"
						/>
						<stop
							offset="50%"
							stopColor="#e87812"
							stopOpacity="0.9"
						/>
						<stop
							offset="100%"
							stopColor="#d3ac2c"
							stopOpacity="0"
						/>
					</linearGradient>
				</defs>

				<circle
					className="booking-hero-ring"
					cx="280"
					cy="280"
					r="210"
					stroke="url(#bookingPortalRing)"
					strokeWidth="1"
					strokeDasharray="8 14"
				/>
				<circle
					className="booking-hero-spin"
					cx="280"
					cy="280"
					r="168"
					stroke="#e87812"
					strokeOpacity="0.45"
					strokeWidth="1.2"
					strokeDasharray="3 10"
				/>
				<circle
					cx="280"
					cy="280"
					r="118"
					stroke="#d3ac2c"
					strokeOpacity="0.28"
					strokeWidth="1"
				/>
				<circle
					className="booking-hero-breathe"
					cx="280"
					cy="280"
					r="78"
					fill="url(#bookingPortalCore)"
				/>
				<circle
					cx="280"
					cy="280"
					r="18"
					fill="#f7f4ef"
					fillOpacity="0.9"
				/>
				<circle
					cx="280"
					cy="280"
					r="7"
					fill="#e87812"
				/>

				<path
					className="booking-hero-ring"
					d="M80 300 C 160 220, 240 380, 280 280 S 420 160, 500 240"
					stroke="#e87812"
					strokeWidth="1"
					strokeDasharray="6 10"
					opacity="0.45"
				/>
				<path
					className="booking-hero-ring"
					d="M70 220 C 180 140, 260 90, 360 130 S 490 210, 510 300"
					stroke="#d3ac2c"
					strokeWidth="1"
					strokeDasharray="5 12"
					opacity="0.35"
				/>

				{SPARKS.map(([x, y], index) => (
					<circle
						key={`${x}-${y}`}
						className="booking-hero-spark"
						cx={x}
						cy={y}
						r="1.8"
						fill="#d3ac2c"
						style={{
							animationDelay: `${index * 0.22}s`,
						}}
					/>
				))}
			</svg>
		</div>
	)
}

interface StepChipProps {
	step: BookingHeroStep
}

/**
 * Compact step label that orbits the booking portal.
 */
function StepChip ({ step }: StepChipProps) {
	return (
		<div
			className={[
				'rounded-xl border border-orange/30',
				'bg-ink/85 px-3.5 py-2.5',
				'shadow-[0_12px_40px_rgba(0,0,0,0.45)]',
				'backdrop-blur-md transition duration-300',
				'hover:-translate-y-1 hover:border-orange',
				'hover:shadow-[0_0_24px_rgba(232,120,18,0.25)]',
			].join(' ')}
		>
			<p className="text-[0.65rem] font-medium tracking-[0.2em] text-orange">
				{step.mark}
			</p>
			<p className="mt-1 text-xs font-medium tracking-wide text-white">
				{step.title}
			</p>
			<p className="mt-0.5 text-[0.7rem] leading-5 text-white/50">
				{step.detail}
			</p>
		</div>
	)
}

/**
 * Cinematic booking hero that feels like an opening doorway.
 */
export function BookingHero () {
	const copy = useContent().booking.hero

	return (
		<section
			className={[
				'relative isolate overflow-hidden',
				'min-h-[calc(100svh-4.5rem)]',
				'bg-transparent text-white',
			].join(' ')}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
			>
				<div
					className={[
						'booking-hero-breathe absolute -left-24 top-10',
						'h-80 w-80 rounded-full',
						'bg-orange/25 blur-[110px]',
					].join(' ')}
				/>
				<div
					className={[
						'booking-hero-orbit absolute -right-10 top-24',
						'h-96 w-96 rounded-full',
						'bg-gold/20 blur-[120px]',
					].join(' ')}
				/>
				<div
					className={[
						'absolute bottom-0 left-1/2 h-72 w-72',
						'-translate-x-1/2 rounded-full',
						'bg-highlight/10 blur-[100px]',
					].join(' ')}
				/>
			</div>

			<div
				className={[
					'relative z-10 mx-auto grid',
					'max-w-7xl items-center gap-12',
					'px-6 py-16 sm:px-10',
					'lg:grid-cols-2 lg:gap-10',
					'lg:px-12 lg:py-20',
					'xl:gap-16',
				].join(' ')}
			>
				<div className="max-w-xl">
					<p
						className={[
							'booking-hero-animate booking-hero-delay-1',
							'inline-flex items-center gap-2',
							'rounded-full border border-orange/35',
							'bg-orange/10 px-3 py-1.5',
							'text-[0.7rem] font-medium uppercase',
							'tracking-[0.22em] text-orange',
						].join(' ')}
					>
						<span
							aria-hidden="true"
							className={[
								'h-1.5 w-1.5 rounded-full bg-orange',
								'shadow-[0_0_10px_#e87812]',
							].join(' ')}
						/>
						{copy.eyebrow}
					</p>

					<h1
						className={[
							'booking-hero-animate booking-hero-delay-2',
							'mt-6 text-4xl font-semibold',
							'leading-[1.08] tracking-tight',
							'text-white sm:text-5xl',
							'lg:text-[3.4rem] xl:text-6xl',
						].join(' ')}
					>
						{copy.titleLead}{' '}
						<span
							className={[
								'text-orange',
								'drop-shadow-[0_0_24px_rgba(232,120,18,0.45)]',
							].join(' ')}
						>
							{copy.titleAccent}
						</span>
					</h1>

					<p
						className={[
							'booking-hero-animate booking-hero-delay-3',
							'mt-6 max-w-md text-base',
							'leading-7 text-white/70',
							'sm:text-lg sm:leading-8',
						].join(' ')}
					>
						{copy.description}
					</p>

					<div
						className={[
							'booking-hero-animate booking-hero-delay-4',
							'mt-9 flex flex-wrap items-center gap-4',
						].join(' ')}
					>
						<a
							href="#book-now"
							className={[
								'inline-flex min-h-12 items-center',
								'justify-center rounded-full',
								'bg-orange px-7 text-sm font-semibold',
								'tracking-wide text-ink',
								'shadow-[0_0_28px_rgba(232,120,18,0.35)]',
								'transition duration-300',
								'hover:bg-highlight',
								'hover:shadow-[0_0_36px_rgba(209,172,44,0.45)]',
								'focus-visible:outline-2',
								'focus-visible:outline-offset-4',
							].join(' ')}
						>
							{copy.ctaLabel}
						</a>
						<p
							className={[
								'text-xs font-medium uppercase',
								'tracking-[0.18em] text-white/45',
							].join(' ')}
						>
							{copy.scrollHint}
						</p>
					</div>

					<p
						className={[
							'booking-hero-animate booking-hero-delay-5',
							'mt-8 text-xs font-medium',
							'uppercase tracking-[0.18em]',
							'text-white/45',
						].join(' ')}
					>
						{copy.promise}
					</p>
				</div>

				<div
					className={[
						'booking-hero-animate booking-hero-delay-3',
						'relative mx-auto w-full',
						'max-w-[34rem] lg:max-w-none',
					].join(' ')}
				>
					<PortalGlyph />

					<ol className="mt-8 space-y-3 sm:hidden">
						{copy.steps.map((step) => (
							<li key={step.mark}>
								<StepChip step={step} />
							</li>
						))}
					</ol>

					{copy.steps.map((step) => {
						const layout = STEP_LAYOUTS[step.mark]
						if (!layout) {
							return null
						}

						return (
							<div
								key={step.mark}
								className={[
									'booking-hero-animate',
									'booking-hero-orbit absolute z-20',
									layout.className,
									layout.delayClass,
								].join(' ')}
							>
								<StepChip step={step} />
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
