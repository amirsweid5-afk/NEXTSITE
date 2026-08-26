import Link from 'next/link'

interface FloatingCard {
	label: string
	className: string
	delayClass: string
}

const FLOATING_CARDS: FloatingCard[] = [
	{
		label: 'Business Websites',
		className: 'left-0 top-[8%] hidden sm:flex',
		delayClass: 'about-hero-delay-3',
	},
	{
		label: 'E-Commerce',
		className: 'right-0 top-[4%] hidden md:flex',
		delayClass: 'about-hero-delay-4',
	},
	{
		label: 'Custom Design',
		className: 'bottom-[18%] left-[-2%] hidden lg:flex',
		delayClass: 'about-hero-delay-4',
	},
	{
		label: 'Responsive Design',
		className: 'bottom-[8%] right-[-2%] sm:bottom-[12%]',
		delayClass: 'about-hero-delay-5',
	},
]

/**
 * Premium agency-style hero for the About Us page.
 */
export function AboutHero () {
	return (
		<section
			className={[
				'relative isolate overflow-hidden',
				'min-h-[calc(100svh-4.5rem)]',
				'bg-ink text-white',
			].join(' ')}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
			>
				<div
					className={[
						'about-hero-glow absolute -left-24 top-16',
						'h-72 w-72 rounded-full',
						'bg-orange/25 blur-[100px]',
					].join(' ')}
				/>
				<div
					className={[
						'about-hero-drift absolute -right-10 top-24',
						'h-80 w-80 rounded-full',
						'bg-gold/20 blur-[110px]',
					].join(' ')}
				/>
				<div
					className={[
						'absolute bottom-0 left-1/3 h-64 w-64',
						'rounded-full bg-highlight/10 blur-[90px]',
					].join(' ')}
				/>
				<svg
					className="absolute inset-0 h-full w-full opacity-40"
					viewBox="0 0 1200 800"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						className="about-hero-line"
						d="M80 620 C 260 480, 420 720, 620 520 S 980 280, 1140 360"
						stroke="url(#aboutCurve)"
						strokeWidth="1.2"
						strokeDasharray="6 10"
					/>
					<path
						d="M40 180 C 220 80, 480 220, 720 140 S 1040 40, 1180 120"
						stroke="rgba(232,120,18,0.25)"
						strokeWidth="1"
					/>
					<path
						d="M160 760 C 380 640, 560 780, 820 660 S 1080 540, 1200 600"
						stroke="rgba(209,172,44,0.2)"
						strokeWidth="1"
					/>
					<defs>
						<linearGradient
							id="aboutCurve"
							x1="0"
							y1="0"
							x2="1"
							y2="0"
						>
							<stop
								offset="0%"
								stopColor="#e87812"
								stopOpacity="0"
							/>
							<stop
								offset="50%"
								stopColor="#e87812"
								stopOpacity="0.8"
							/>
							<stop
								offset="100%"
								stopColor="#d3ac2c"
								stopOpacity="0"
							/>
						</linearGradient>
					</defs>
					{[
						[180, 140],
						[340, 260],
						[520, 110],
						[760, 210],
						[940, 90],
						[1080, 280],
						[260, 520],
						[640, 640],
						[900, 480],
					].map(([x, y]) => (
						<circle
							key={`${x}-${y}`}
							cx={x}
							cy={y}
							r="1.8"
							fill="#e87812"
							opacity="0.55"
						/>
					))}
				</svg>
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
							'about-hero-animate about-hero-delay-1',
							'inline-flex items-center gap-2',
							'rounded-full border border-orange/35',
							'bg-orange/10 px-3 py-1.5',
							'text-[0.7rem] font-medium uppercase',
							'tracking-[0.22em] text-orange',
						].join(' ')}
					>
						<span
							aria-hidden="true"
							className="h-1.5 w-1.5 rounded-full bg-orange shadow-[0_0_10px_#e87812]"
						/>
						Digital Studio
					</p>

					<h1
						className={[
							'about-hero-animate about-hero-delay-2',
							'mt-6 text-4xl font-semibold',
							'leading-[1.08] tracking-tight',
							'text-white sm:text-5xl',
							'lg:text-[3.4rem] xl:text-6xl',
						].join(' ')}
					>
						Build Your{' '}
						<span className="text-orange drop-shadow-[0_0_24px_rgba(232,120,18,0.45)]">
							Digital Presence.
						</span>
					</h1>

					<p
						className={[
							'about-hero-animate about-hero-delay-3',
							'mt-6 max-w-md text-base',
							'leading-7 text-white/70',
							'sm:text-lg sm:leading-8',
						].join(' ')}
					>
						We craft modern, fast, high-quality websites for
						businesses that want to look premium online — and
						convert visitors into clients.
					</p>

					<div
						className={[
							'about-hero-animate about-hero-delay-4',
							'mt-9 flex flex-wrap gap-3',
						].join(' ')}
					>
						<Link
							href="/booking"
							className={[
								'inline-flex min-h-12 items-center',
								'justify-center rounded-full',
								'bg-orange px-7 text-sm font-semibold',
								'tracking-wide text-ink',
								'shadow-[0_0_28px_rgba(232,120,18,0.35)]',
								'transition duration-300',
								'hover:bg-highlight hover:shadow-[0_0_36px_rgba(209,172,44,0.45)]',
								'focus-visible:outline-2',
								'focus-visible:outline-offset-4',
							].join(' ')}
						>
							Book a Consultation
						</Link>
						<Link
							href="/"
							className={[
								'inline-flex min-h-12 items-center',
								'justify-center rounded-full',
								'border border-white/20 bg-white/5',
								'px-7 text-sm font-semibold',
								'tracking-wide text-white',
								'backdrop-blur-sm transition',
								'duration-300 hover:border-orange/50',
								'hover:bg-orange/10 hover:text-orange',
								'focus-visible:outline-2',
								'focus-visible:outline-offset-4',
							].join(' ')}
						>
							View Our Work
						</Link>
					</div>

					<p
						className={[
							'about-hero-animate about-hero-delay-5',
							'mt-8 text-xs font-medium',
							'uppercase tracking-[0.18em]',
							'text-white/45',
						].join(' ')}
					>
						Professional · Fast · Modern · Responsive
					</p>
				</div>

				<div
					className={[
						'about-hero-animate about-hero-delay-3',
						'relative mx-auto w-full',
						'max-w-[34rem] lg:max-w-none',
					].join(' ')}
				>
					<svg
						aria-hidden="true"
						className={[
							'pointer-events-none absolute',
							'inset-0 hidden h-full w-full',
							'lg:block',
						].join(' ')}
						viewBox="0 0 560 480"
						fill="none"
					>
						<path
							className="about-hero-line"
							d="M70 90 C 140 120, 180 160, 220 190"
							stroke="#e87812"
							strokeWidth="1"
							strokeDasharray="4 8"
							opacity="0.55"
						/>
						<path
							className="about-hero-line"
							d="M490 70 C 430 110, 390 150, 350 180"
							stroke="#d3ac2c"
							strokeWidth="1"
							strokeDasharray="4 8"
							opacity="0.45"
						/>
						<path
							className="about-hero-line"
							d="M80 360 C 150 330, 190 300, 240 280"
							stroke="#e87812"
							strokeWidth="1"
							strokeDasharray="4 8"
							opacity="0.4"
						/>
						<path
							className="about-hero-line"
							d="M500 390 C 430 350, 390 310, 340 290"
							stroke="#d3ac2c"
							strokeWidth="1"
							strokeDasharray="4 8"
							opacity="0.4"
						/>
					</svg>

					<div
						aria-hidden="true"
						className={[
							'about-hero-glow absolute',
							'bottom-6 left-1/2 h-28 w-[70%]',
							'-translate-x-1/2 rounded-full',
							'bg-orange/40 blur-[48px]',
						].join(' ')}
					/>

					<div className="about-hero-float relative z-10">
						<div
							className={[
								'overflow-hidden rounded-2xl',
								'border border-white/10',
								'bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.55)]',
							].join(' ')}
						>
							<div
								className={[
									'flex items-center gap-2',
									'border-b border-white/10',
									'bg-ink/80 px-4 py-3',
								].join(' ')}
							>
								<span className="h-2.5 w-2.5 rounded-full bg-stone" />
								<span className="h-2.5 w-2.5 rounded-full bg-stone" />
								<span className="h-2.5 w-2.5 rounded-full bg-orange/80" />
								<div
									className={[
										'ml-3 flex-1 rounded-md',
										'bg-white/5 px-3 py-1.5',
										'text-[0.65rem] tracking-wide',
										'text-white/40',
									].join(' ')}
								>
									lumen.studio/preview
								</div>
							</div>

							<div className="space-y-4 bg-ink p-4 sm:p-5">
								<div
									className={[
										'flex items-center justify-between',
										'border-b border-white/10 pb-3',
									].join(' ')}
								>
									<span className="text-xs font-semibold tracking-[0.2em] text-orange">
										LUMEN
									</span>
									<div className="hidden gap-3 text-[0.65rem] uppercase tracking-[0.16em] text-white/40 sm:flex">
										<span>Work</span>
										<span>Services</span>
										<span className="text-orange">
											Contact
										</span>
									</div>
								</div>

								<div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
									<div className="space-y-3">
										<div className="h-2.5 w-28 rounded-full bg-orange/80" />
										<div className="h-3 w-[80%] max-w-[14rem] rounded-full bg-white/85" />
										<div className="h-2 w-full rounded-full bg-white/20" />
										<div className="h-2 w-[83%] rounded-full bg-white/15" />
										<div className="mt-4 inline-flex rounded-full bg-orange px-3 py-1.5 text-[0.65rem] font-semibold text-ink">
											Start Project
										</div>
									</div>
									<div
										className={[
											'relative min-h-28 overflow-hidden',
											'rounded-xl border border-orange/25',
											'bg-linear-to-br from-orange/30',
											'via-gold/20 to-ink',
										].join(' ')}
									>
										<div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-highlight/30 blur-2xl" />
										<div className="absolute bottom-3 left-3 right-3 h-8 rounded-lg bg-white/10" />
									</div>
								</div>

								<div className="grid grid-cols-3 gap-2">
									{[1, 2, 3].map((item) => (
										<div
											key={item}
											className={[
												'rounded-lg border border-white/10',
												'bg-surface/80 p-2.5',
											].join(' ')}
										>
											<div className="mb-2 h-1.5 w-8 rounded-full bg-orange/60" />
											<div className="h-1.5 w-full rounded-full bg-white/15" />
											<div className="mt-1 h-1.5 w-[66%] rounded-full bg-white/10" />
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{FLOATING_CARDS.map((card) => (
						<div
							key={card.label}
							className={[
								'about-hero-animate about-hero-float-soft',
								'absolute z-20',
								card.className,
								card.delayClass,
							].join(' ')}
						>
							<div
								className={[
									'rounded-xl border border-orange/30',
									'bg-ink/85 px-3.5 py-2.5',
									'text-xs font-medium tracking-wide',
									'text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)]',
									'backdrop-blur-md transition',
									'duration-300 hover:-translate-y-1',
									'hover:border-orange hover:shadow-[0_0_24px_rgba(232,120,18,0.25)]',
								].join(' ')}
							>
								<span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-orange shadow-[0_0_8px_#e87812]" />
								{card.label}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
