interface WhyChooseFeature {
	id: string
	title: string
	description: string
	icon: 'design' | 'responsive' | 'fast' | 'support'
}

const FEATURES: WhyChooseFeature[] = [
	{
		id: 'custom-designs',
		title: 'Built for Your Brand',
		description:
			'Every website is designed specifically for your brand, goals, and style — never just a generic template.',
		icon: 'design',
	},
	{
		id: 'fully-responsive',
		title: 'Looks Great Everywhere',
		description:
			'Every website is optimized to work smoothly and look great on phones, tablets, and desktops.',
		icon: 'responsive',
	},
	{
		id: 'fast-modern',
		title: 'Fast. Clean. Professional.',
		description:
			'Modern, lightweight websites built with a focus on fast loading speeds and a smooth user experience.',
		icon: 'fast',
	},
	{
		id: 'personal-support',
		title: 'We’re Here for You',
		description:
			'Clear communication and personal support throughout the project, from the first idea to the final website.',
		icon: 'support',
	},
]

function FeatureIcon ({ type }: { type: WhyChooseFeature['icon'] }) {
	if (type === 'design') {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				className="h-6 w-6"
			>
				<path
					d="M12 3l1.8 4.6L18.5 9.4l-4.2 3.2 1.4 4.9L12 14.8 8.3 17.5l1.4-4.9L5.5 9.4l4.7-1.8L12 3Z"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinejoin="round"
				/>
				<path
					d="M4 20h16"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>
		)
	}

	if (type === 'responsive') {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				className="h-6 w-6"
			>
				<rect
					x="3"
					y="5"
					width="12"
					height="14"
					rx="1.5"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<rect
					x="17"
					y="9"
					width="4"
					height="10"
					rx="1"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					d="M18.5 17.5h1"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>
		)
	}

	if (type === 'fast') {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				className="h-6 w-6"
			>
				<path
					d="M13 3L5.5 13.5H11l-.5 7.5L18.5 10.5H13L13 3Z"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinejoin="round"
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
 * Home-page trust section highlighting four reasons to choose the studio.
 */
export function WhyChooseUs () {
	return (
		<section
			id="why-choose-us"
			aria-labelledby="why-choose-us-heading"
			className="relative isolate overflow-hidden bg-ink py-20 sm:py-24 lg:py-28"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
			>
				<div className="absolute left-1/2 top-0 h-px w-[min(72%,40rem)] -translate-x-1/2 bg-linear-to-r from-transparent via-gold/35 to-transparent" />
				<div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-gold/10 blur-[110px]" />
				<div className="absolute -left-20 bottom-8 h-64 w-64 rounded-full bg-orange/10 blur-[100px]" />
			</div>

			<div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
				<div className="mx-auto max-w-2xl text-center">
					<p className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
						Why Us
					</p>
					<h2
						id="why-choose-us-heading"
						className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
					>
						Why Choose Us?
					</h2>
					<p className="mt-4 text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
						More than just a website — we build a digital
						presence designed around you.
					</p>
				</div>

				<ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-7">
					{FEATURES.map((feature, index) => (
						<li
							key={feature.id}
							className={[
								'why-choose-animate',
								`why-choose-delay-${index + 1}`,
							].join(' ')}
						>
							<article
								className={[
									'group flex h-full flex-col',
									'rounded-2xl border border-white/10',
									'bg-surface/80 p-7',
									'shadow-[0_20px_50px_rgba(0,0,0,0.35)]',
									'transition duration-300 ease-out',
									'hover:-translate-y-1.5',
									'hover:border-gold/45',
									'hover:shadow-[0_24px_60px_rgba(209,172,44,0.12)]',
								].join(' ')}
							>
								<div
									className={[
										'inline-flex h-12 w-12 items-center',
										'justify-center rounded-xl',
										'border border-gold/30 bg-gold/10',
										'text-highlight transition duration-300',
										'group-hover:border-gold/60',
										'group-hover:bg-gold/15',
										'group-hover:shadow-[0_0_24px_rgba(209,172,44,0.25)]',
									].join(' ')}
								>
									<FeatureIcon type={feature.icon} />
								</div>

								<h3 className="mt-6 text-lg font-semibold tracking-tight text-white sm:text-xl">
									{feature.title}
								</h3>
								<p className="mt-3 flex-1 text-sm leading-6 text-white/60">
									{feature.description}
								</p>
							</article>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
