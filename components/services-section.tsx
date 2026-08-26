import Link from 'next/link'

interface ServiceOffer {
	id: string
	title: string
	description: string
	priceLabel: string
	icon: 'landing' | 'static' | 'personal'
}

const SERVICES: ServiceOffer[] = [
	{
		id: 'landing-page',
		title: 'Landing Page',
		description:
			'A focused, high-converting single-page site for businesses, products, or campaigns — clean, modern, and fully responsive.',
		priceLabel: 'Starting from $200',
		icon: 'landing',
	},
	{
		id: 'static-website',
		title: 'Static Website',
		description:
			'A professional multi-page website for businesses, portfolios, or organizations — fast, modern, and built to last.',
		priceLabel: 'Starting from $300',
		icon: 'static',
	},
	{
		id: 'personal-website',
		title: 'Personal Website',
		description:
			'A personalized site for creators and professionals — designed to showcase your work, skills, and personal brand.',
		priceLabel: 'Starting from $250',
		icon: 'personal',
	},
]

function ServiceIcon ({ type }: { type: ServiceOffer['icon'] }) {
	if (type === 'landing') {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				className="h-6 w-6"
			>
				<rect
					x="3"
					y="4"
					width="18"
					height="16"
					rx="2"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					d="M3 9h18"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					d="M7 14h6"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>
		)
	}

	if (type === 'static') {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				className="h-6 w-6"
			>
				<path
					d="M4 7h7v10H4V7Z"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					d="M13 7h7v4h-7V7Z"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					d="M13 13h7v4h-7v-4Z"
					stroke="currentColor"
					strokeWidth="1.5"
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
			<circle
				cx="12"
				cy="8"
				r="3"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	)
}

/**
 * Home-page services grid with booking CTAs.
 */
export function ServicesSection () {
	return (
		<section
			id="services"
			aria-labelledby="services-heading"
			className="relative isolate overflow-hidden bg-ink py-20 sm:py-24 lg:py-28"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
			>
				<div className="absolute left-1/2 top-0 h-px w-[min(72%,40rem)] -translate-x-1/2 bg-linear-to-r from-transparent via-orange/40 to-transparent" />
				<div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-orange/10 blur-[100px]" />
				<div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-gold/10 blur-[110px]" />
			</div>

			<div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
				<div className="mx-auto max-w-2xl text-center">
					<p className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
						Services
					</p>
					<h2
						id="services-heading"
						className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
					>
						What I Offer
					</h2>
					<p className="mt-4 text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
						Professional websites designed to bring your ideas
						to life.
					</p>
				</div>

				<ul className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-7">
					{SERVICES.map((service) => (
						<li key={service.id}>
							<article
								className={[
									'group flex h-full flex-col',
									'rounded-2xl border border-white/10',
									'bg-surface/80 p-7',
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
									<ServiceIcon type={service.icon} />
								</div>

								<h3 className="mt-6 text-xl font-semibold tracking-tight text-white">
									{service.title}
								</h3>
								<p className="mt-3 flex-1 text-sm leading-6 text-white/60">
									{service.description}
								</p>
								<p className="mt-6 text-sm font-medium tracking-wide text-orange">
									{service.priceLabel}
								</p>
								<Link
									href="/booking"
									className={[
										'mt-5 inline-flex min-h-11',
										'items-center justify-center',
										'rounded-full bg-orange px-5',
										'text-xs font-semibold uppercase',
										'tracking-[0.18em] text-ink',
										'transition duration-300',
										'hover:bg-highlight',
										'hover:shadow-[0_0_24px_rgba(209,172,44,0.35)]',
										'focus-visible:outline-2',
										'focus-visible:outline-offset-4',
									].join(' ')}
								>
									Book Now
								</Link>
							</article>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
