'use client'

import { useEffect, useState } from 'react'
import { useContent } from '@/components/language-provider'

const CLIP_MS = 5000
const SCROLL_DELTA = 8

type Tone = 'plain' | 'keyword' | 'name' | 'string' | 'punct'

interface CodeToken {
	text: string
	tone: Tone
}

const CODE: CodeToken[][] = [
	[
		{ text: 'export ', tone: 'keyword' },
		{ text: 'function ', tone: 'keyword' },
		{ text: 'HomePage', tone: 'name' },
		{ text: ' () {', tone: 'punct' },
	],
	[
		{ text: '  return (', tone: 'punct' },
	],
	[
		{ text: '    <section className=', tone: 'plain' },
		{ text: '"bg-ink"', tone: 'string' },
		{ text: '>', tone: 'punct' },
	],
	[
		{ text: '      <h1>', tone: 'plain' },
		{ text: 'NEXTSITE', tone: 'name' },
		{ text: '</h1>', tone: 'plain' },
	],
	[
		{ text: '      <p>', tone: 'plain' },
		{ text: 'Built around your idea.', tone: 'string' },
		{ text: '</p>', tone: 'plain' },
	],
	[
		{ text: '    </section>', tone: 'plain' },
	],
	[
		{ text: '  )', tone: 'punct' },
	],
	[
		{ text: '}', tone: 'punct' },
	],
]

const TONE_CLASS: Record<Tone, string> = {
	plain: 'text-white',
	keyword: 'text-orange',
	name: 'text-highlight',
	string: 'text-gold',
	punct: 'text-white',
}

const TOTAL_CHARS = CODE.reduce((sum, line) => {
	const lineLength = line.reduce((count, token) => {
		return count + token.text.length
	}, 0)
	return sum + lineLength + 1
}, 0)

/**
 * Returns the code tokens visible after a character count.
 */
function sliceCode (count: number) {
	let remaining = count
	const lines: CodeToken[][] = []

	for (const line of CODE) {
		const parts: CodeToken[] = []

		for (const token of line) {
			if (remaining <= 0) break
			const text = token.text.slice(0, remaining)
			remaining -= text.length
			if (text !== '') {
				parts.push({ text, tone: token.tone })
			}
		}

		lines.push(parts)
		if (remaining <= 0) break
		remaining -= 1
	}

	return lines
}

/**
 * Cursor-style editor sitting behind the home page.
 * Opens while scrolling down and fades out while scrolling up.
 */
export function AiTypingClip () {
	const label = useContent().home.aiClip.label
	const [isOpen, setIsOpen] = useState(false)
	const [elapsed, setElapsed] = useState(0)
	const [reducedMotion, setReducedMotion] = useState(false)

	useEffect(() => {
		const media = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		)
		const syncMotion = () => {
			setReducedMotion(media.matches)
		}

		syncMotion()
		media.addEventListener('change', syncMotion)

		let lastY = window.scrollY
		let direction: 'down' | 'up' | null = null

		function handleScroll () {
			const nextY = window.scrollY
			const delta = nextY - lastY
			lastY = nextY

			if (delta > SCROLL_DELTA && direction !== 'down') {
				direction = 'down'
				setIsOpen(true)
				return
			}

			if (delta < -SCROLL_DELTA && direction !== 'up') {
				direction = 'up'
				setIsOpen(false)
			}
		}

		window.addEventListener('scroll', handleScroll, {
			passive: true,
		})

		return () => {
			media.removeEventListener('change', syncMotion)
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	useEffect(() => {
		if (!isOpen || reducedMotion) return

		setElapsed(0)
		let frameId = 0
		let start = 0

		function tick (now: number) {
			if (start === 0) start = now
			const next = Math.min(now - start, CLIP_MS)
			setElapsed(next)
			if (next < CLIP_MS) {
				frameId = window.requestAnimationFrame(tick)
			}
		}

		frameId = window.requestAnimationFrame(tick)

		return () => {
			window.cancelAnimationFrame(frameId)
		}
	}, [isOpen, reducedMotion])

	const progress = reducedMotion ? 1 : elapsed / CLIP_MS
	const typed = Math.floor(progress * TOTAL_CHARS)
	const lines = sliceCode(typed)
	const isTyping = isOpen && !reducedMotion && elapsed < CLIP_MS

	return (
		<div
			aria-hidden="true"
			className={[
				'pointer-events-none fixed inset-0 z-0',
				'transition-opacity',
				'ease-[cubic-bezier(0.22,1,0.36,1)]',
				reducedMotion
					? 'duration-0'
					: isOpen
						? 'duration-700'
						: 'duration-[2400ms]',
				isOpen ? 'opacity-100' : 'opacity-0',
			].join(' ')}
		>
			<div className="flex h-full bg-ink text-white">
				<aside
					className={[
						'hidden w-14 shrink-0 flex-col items-center',
						'gap-4 border-e border-white/10 bg-surface',
						'py-4 sm:flex',
					].join(' ')}
				>
					<span className="h-3 w-3 rounded-sm bg-orange" />
					<span className="h-3 w-3 rounded-sm bg-white/20" />
					<span className="h-3 w-3 rounded-sm bg-white/15" />
					<span className="mt-auto h-3 w-3 rounded-sm bg-gold/70" />
				</aside>

				<aside
					className={[
						'hidden w-52 shrink-0 border-e',
						'border-white/10 bg-surface/80 py-4 lg:block',
					].join(' ')}
				>
					<p
						className={[
							'px-4 text-[11px] uppercase',
							'tracking-[0.16em] text-white/40',
						].join(' ')}
					>
						Explorer
					</p>
					<p className="mt-4 px-4 text-sm text-white/45">
						app
					</p>
					<p className="mt-1 bg-white/5 px-6 py-1 text-sm text-highlight">
						page.tsx
					</p>
					<p className="mt-1 px-6 py-1 text-sm text-white/40">
						layout.tsx
					</p>
				</aside>

				<div className="flex min-w-0 flex-1 flex-col">
					<div
						className={[
							'flex items-center gap-3 border-b',
							'border-white/10 bg-surface/60 px-4 py-2',
						].join(' ')}
					>
						<p className="text-sm text-white">page.tsx</p>
						<p className="ms-auto text-xs text-gold">
							{label}
						</p>
					</div>

					<div className="min-h-0 flex-1 overflow-hidden px-4 py-8 sm:px-10">
						<pre
							className={[
								'font-[ui-monospace,SFMono-Regular,Menlo,monospace]',
								'text-lg leading-9 sm:text-xl sm:leading-10',
								'lg:text-2xl lg:leading-[2.75rem]',
							].join(' ')}
						>
							{lines.map((line, index) => (
								<div key={index} className="flex">
									<span
										className={[
											'me-6 w-6 shrink-0',
											'text-end text-white/25',
										].join(' ')}
									>
										{index + 1}
									</span>
									<span>
										{line.map((token, tokenIndex) => (
											<span
												key={tokenIndex}
												className={TONE_CLASS[token.tone]}
											>
												{token.text}
											</span>
										))}
										{index === lines.length - 1 && isTyping ? (
											<span className="ai-typing-caret" />
										) : null}
									</span>
								</div>
							))}
						</pre>
					</div>
				</div>
			</div>
		</div>
	)
}
