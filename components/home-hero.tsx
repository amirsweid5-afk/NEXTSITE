'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useContent } from '@/components/language-provider'

const TYPE_DELAY_MS = 180
const TYPE_INTERVAL_MS = 110

/**
 * Types the brand word letter by letter on first view.
 */
function useTypedBrand (brand: string) {
	const [typedBrand, setTypedBrand] = useState('')
	const [isTyping, setIsTyping] = useState(true)

	useEffect(() => {
		const media = window.matchMedia('(prefers-reduced-motion: reduce)')

		if (media.matches) {
			setTypedBrand(brand)
			setIsTyping(false)
			return
		}

		setTypedBrand('')
		setIsTyping(true)
		let index = 0
		let intervalId = 0

		const timeoutId = window.setTimeout(() => {
			intervalId = window.setInterval(() => {
				index += 1
				setTypedBrand(brand.slice(0, index))

				if (index >= brand.length) {
					window.clearInterval(intervalId)
					setIsTyping(false)
				}
			}, TYPE_INTERVAL_MS)
		}, TYPE_DELAY_MS)

		return () => {
			window.clearTimeout(timeoutId)
			window.clearInterval(intervalId)
		}
	}, [brand])

	return { typedBrand, isTyping }
}

/**
 * Cinematic brand-first hero for the home page.
 */
export function HomeHero () {
	const copy = useContent().home.hero
	const { typedBrand, isTyping } = useTypedBrand(copy.brand)

	return (
		<section
			className={[
				'relative isolate flex overflow-hidden',
				'bg-transparent text-white',
				'sm:min-h-[calc(100svh-4.5rem)] sm:items-end',
			].join(' ')}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
			>
				<div
					className={[
						'absolute inset-0',
						'bg-[radial-gradient(ellipse_80%_55%_at_50%_115%,rgba(232,120,18,0.38),transparent_55%),radial-gradient(ellipse_60%_40%_at_80%_10%,rgba(209,172,44,0.16),transparent_50%),radial-gradient(ellipse_50%_35%_at_12%_20%,rgba(177,108,4,0.14),transparent_55%)]',
					].join(' ')}
				/>
				<div className="home-hero-vignette absolute inset-0" />
				<svg
					className="home-hero-grid absolute inset-x-0 bottom-0 h-[58%] w-full opacity-70"
					viewBox="0 0 1440 520"
					preserveAspectRatio="none"
					fill="none"
				>
					<defs>
						<linearGradient
							id="homeGridFade"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop
								offset="0%"
								stopColor="#e87812"
								stopOpacity="0"
							/>
							<stop
								offset="35%"
								stopColor="#e87812"
								stopOpacity="0.35"
							/>
							<stop
								offset="100%"
								stopColor="#d3ac2c"
								stopOpacity="0.08"
							/>
						</linearGradient>
						<linearGradient
							id="homeHorizon"
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
								stopOpacity="0.9"
							/>
							<stop
								offset="100%"
								stopColor="#d3ac2c"
								stopOpacity="0"
							/>
						</linearGradient>
					</defs>
					{[
						120, 240, 360, 480, 600, 720, 840, 960, 1080,
						1200, 1320,
					].map((x) => (
						<path
							key={x}
							d={`M720 0 L${x} 520`}
							stroke="url(#homeGridFade)"
							strokeWidth="1"
						/>
					))}
					{[80, 160, 250, 350, 460].map((y) => (
						<path
							key={y}
							d={`M0 ${y} H1440`}
							stroke="#e87812"
							strokeOpacity={0.12 + y / 2000}
							strokeWidth="1"
						/>
					))}
					<path
						className="home-hero-horizon"
						d="M80 2 H1360"
						stroke="url(#homeHorizon)"
						strokeWidth="1.5"
					/>
				</svg>
				<div
					className={[
						'home-hero-beam absolute left-1/2 bottom-0',
						'h-[72%] w-[min(42rem,90vw)] -translate-x-1/2',
						'bg-[linear-gradient(to_top,rgba(232,120,18,0.22),rgba(209,172,44,0.06)_45%,transparent_78%)]',
						'blur-2xl',
					].join(' ')}
				/>
				<div
					className={[
						'home-hero-orb absolute -end-16 top-10',
						'h-72 w-72 rounded-full',
						'bg-gold/20 blur-[100px]',
					].join(' ')}
				/>
				<div
					className={[
						'home-hero-orb-soft absolute -start-20 top-32',
						'h-64 w-64 rounded-full',
						'bg-orange/15 blur-[90px]',
					].join(' ')}
				/>
			</div>

			<div
				className={[
					'relative z-10 mx-auto w-full max-w-6xl',
					'px-6 py-16 sm:px-10 sm:pb-20 sm:pt-20',
					'lg:px-12 lg:pb-24',
				].join(' ')}
			>
				<h1
					dir="ltr"
					className={[
						'relative max-w-5xl font-brand home-hero-brand',
						'leading-[1.05] tracking-normal',
						'text-[clamp(3.25rem,11vw,8.5rem)]',
					].join(' ')}
				>
					<span className="sr-only">{copy.brand}</span>
					<span className="invisible select-none" aria-hidden="true">
						{copy.brand}
					</span>
					<span
						aria-hidden="true"
						className="absolute inset-0"
					>
						<span
							className={[
								'home-hero-title text-transparent',
								'bg-clip-text',
							].join(' ')}
						>
							{typedBrand}
						</span>
						{isTyping ? (
							<span className="home-hero-caret" />
						) : null}
					</span>
				</h1>

				<p
					className={[
						'home-hero-animate home-hero-delay-2',
						'mt-6 max-w-xl text-2xl font-medium',
						'sm:mt-8',
						'leading-snug tracking-tight text-white',
						'sm:text-3xl lg:text-[2rem]',
					].join(' ')}
				>
					{copy.title}
				</p>

				<p
					className={[
						'home-hero-animate home-hero-delay-3',
						'mt-5 max-w-lg text-base leading-7',
						'text-white/65 sm:text-lg sm:leading-8',
					].join(' ')}
				>
					{copy.description}
				</p>

				<div
					className={[
						'home-hero-animate home-hero-delay-4',
						'mt-9 flex flex-wrap items-center gap-3',
					].join(' ')}
				>
					<Link
						href="/booking"
						className={[
							'inline-flex min-h-12 items-center',
							'justify-center rounded-full',
							'bg-orange px-8 text-sm font-semibold',
							'uppercase tracking-[0.18em] text-ink',
							'shadow-[0_0_32px_rgba(232,120,18,0.4)]',
							'transition duration-300',
							'hover:bg-highlight',
							'hover:shadow-[0_0_40px_rgba(209,172,44,0.45)]',
							'focus-visible:outline-2',
							'focus-visible:outline-offset-4',
						].join(' ')}
					>
						{copy.ctaLabel}
					</Link>
					<Link
						href="/#services"
						className={[
							'inline-flex min-h-12 items-center',
							'justify-center rounded-full',
							'border border-white/20 bg-white/5',
							'px-8 text-sm font-semibold',
							'uppercase tracking-[0.18em] text-white',
							'backdrop-blur-sm transition duration-300',
							'hover:border-orange/50 hover:bg-orange/10',
							'hover:text-orange',
							'focus-visible:outline-2',
							'focus-visible:outline-offset-4',
						].join(' ')}
					>
						{copy.secondaryCtaLabel}
					</Link>
				</div>
			</div>
		</section>
	)
}
