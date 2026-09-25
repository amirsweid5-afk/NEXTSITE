'use client'

import { useEffect, useRef } from 'react'

const CODE_LINES = [
	[
		{ text: 'export ', tone: 'keyword' },
		{ text: 'function ', tone: 'keyword' },
		{ text: 'compose', tone: 'name' },
		{ text: '() {', tone: 'plain' },
	],
	[
		{ text: '  const ', tone: 'keyword' },
		{ text: 'site', tone: 'name' },
		{ text: ' = ', tone: 'plain' },
		{ text: 'await idea()', tone: 'name' },
	],
	[
		{ text: '  return (', tone: 'plain' },
	],
	[
		{ text: '    <page tone=', tone: 'plain' },
		{ text: '"gold"', tone: 'string' },
		{ text: '>', tone: 'plain' },
	],
	[
		{ text: '      <hero>', tone: 'plain' },
		{ text: 'NEXTSITE', tone: 'name' },
		{ text: '</hero>', tone: 'plain' },
	],
	[
		{ text: '      <services />', tone: 'plain' },
	],
	[
		{ text: '      <proof />', tone: 'plain' },
	],
	[
		{ text: '      <invite />', tone: 'plain' },
	],
	[
		{ text: '    </page>', tone: 'plain' },
	],
	[
		{ text: '  )', tone: 'plain' },
	],
	[
		{ text: '}', tone: 'plain' },
	],
] as const

const TONE_CLASS = {
	plain: 'text-white/90',
	keyword: 'text-orange',
	name: 'text-highlight',
	string: 'text-gold',
} as const

/**
 * Reads how far the home journey has been scrolled, from 0 to 1.
 */
function readBuildProgress (journey: HTMLElement) {
	const start = journey.offsetTop
	const max = journey.offsetHeight - window.innerHeight
	if (max <= 0) return 1

	const traveled = window.scrollY - start
	return Math.min(1, Math.max(0, traveled / max))
}

/**
 * Scroll-scrubbed drafting scene behind the homepage.
 * Every move is a function of scroll position, so it rewinds exactly.
 */
export function HomeScrollScene () {
	const sceneRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const scene = sceneRef.current
		const journey = document.getElementById('home-journey')
		if (!scene || !journey) return

		const media = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		)
		let frame = 0

		function apply (value: number) {
			scene?.style.setProperty('--build', value.toFixed(4))
		}

		function update () {
			frame = 0
			if (!scene || !journey) return
			if (media.matches) {
				apply(0.5)
				return
			}
			apply(readBuildProgress(journey))
		}

		function requestUpdate () {
			if (frame !== 0) return
			frame = window.requestAnimationFrame(update)
		}

		update()
		window.addEventListener('scroll', requestUpdate, {
			passive: true,
		})
		window.addEventListener('resize', requestUpdate)
		media.addEventListener('change', requestUpdate)

		return () => {
			window.cancelAnimationFrame(frame)
			window.removeEventListener('scroll', requestUpdate)
			window.removeEventListener('resize', requestUpdate)
			media.removeEventListener('change', requestUpdate)
		}
	}, [])

	return (
		<div
			ref={sceneRef}
			className="scroll-build"
			aria-hidden="true"
		>
			<div className="scroll-build-glow" />
			<svg
				className="scroll-build-grid"
				viewBox="0 0 1440 900"
				preserveAspectRatio="xMidYMid slice"
			>
				{[160, 320, 480, 640, 800, 960, 1120, 1280].map((x) => (
					<line
						key={x}
						x1={720}
						y1={40}
						x2={x}
						y2={900}
					/>
				))}
			</svg>

			<div className="scroll-build-plate scroll-build-plate-1">
				<div className="scroll-build-plate-bar" />
				<div className="scroll-build-plate-hero" />
				<span />
				<span />
			</div>
			<div className="scroll-build-plate scroll-build-plate-2">
				<div className="scroll-build-plate-bar" />
				<div className="scroll-build-plate-split">
					<span />
					<span />
				</div>
			</div>
			<div className="scroll-build-plate scroll-build-plate-3">
				<div className="scroll-build-plate-bar" />
				<div className="scroll-build-plate-stack">
					<span />
					<span />
					<span />
				</div>
			</div>

			<div className="scroll-build-code" dir="ltr">
				<div className="scroll-build-code-window">
					<pre>
						{CODE_LINES.map((line, index) => (
							<div key={index}>
								<span>
									{String(index + 1).padStart(2, '0')}
								</span>
								<p>
									{line.map((token) => (
										<span
											key={token.text}
											className={TONE_CLASS[token.tone]}
										>
											{token.text}
										</span>
									))}
								</p>
							</div>
						))}
					</pre>
					<span className="scroll-build-caret" />
				</div>
			</div>

			<svg
				className="scroll-build-filament"
				viewBox="0 0 1200 800"
				preserveAspectRatio="none"
			>
				<defs>
					<linearGradient
						id="scroll-build-filament"
						x1="0"
						y1="1"
						x2="1"
						y2="0"
					>
						<stop offset="0%" stopColor="var(--orange)" />
						<stop offset="100%" stopColor="var(--highlight)" />
					</linearGradient>
				</defs>
				<path
					d={[
						'M40 740 C 220 740, 160 520, 360 470',
						'S 620 360, 560 240 S 470 90, 820 130',
						'S 1080 180, 1160 48',
					].join(' ')}
					pathLength="1"
				/>
			</svg>
			<div className="scroll-build-aperture" />
			<div className="scroll-build-veil" />
		</div>
	)
}
