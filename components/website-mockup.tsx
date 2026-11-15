'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMarketingContent } from '@/hooks/use-marketing-content'

/**
 * Interactive browser-frame mockup for the home hero.
 */
export function WebsiteMockup () {
	const copy = useMarketingContent().home.mockup
	const [activeTab, setActiveTab] = useState<
		'home' | 'work' | 'services'
	>('home')

	return (
		<div className="website-mockup group relative mx-auto w-full max-w-lg">
			<div
				className={[
					'site-card overflow-hidden rounded-2xl',
					'border border-white/15 bg-ink/90',
					'shadow-[0_30px_80px_rgba(0,0,0,0.55)]',
					'transition duration-500',
					'group-hover:-translate-y-1',
					'group-hover:border-orange/40',
				].join(' ')}
			>
				<div className="flex items-center gap-2 border-b border-white/10 bg-surface/80 px-4 py-3">
					<span className="h-2.5 w-2.5 rounded-full bg-white/25" />
					<span className="h-2.5 w-2.5 rounded-full bg-white/25" />
					<span className="h-2.5 w-2.5 rounded-full bg-white/25" />
					<div
						className={[
							'ms-2 flex-1 truncate rounded-full',
							'bg-ink/70 px-3 py-1 text-[0.65rem]',
							'tracking-wide text-white/50',
						].join(' ')}
					>
						{copy.url}
					</div>
				</div>

				<div className="border-b border-white/10 px-4 py-3">
					<div className="flex items-center justify-between gap-3">
						<p className="font-brand home-hero-brand text-sm text-orange">
							{copy.brand}
						</p>
						<nav className="flex gap-1 text-[0.65rem]">
							{(
								[
									['home', copy.navHome],
									['work', copy.navWork],
									['services', copy.navServices],
								] as const
							).map(([id, label]) => (
								<button
									key={id}
									type="button"
									onClick={() => setActiveTab(id)}
									className={[
										'rounded-full px-2.5 py-1 transition',
										activeTab === id
											? 'bg-orange/20 text-orange'
											: 'text-white/50 hover:text-white',
									].join(' ')}
								>
									{label}
								</button>
							))}
						</nav>
					</div>
				</div>

				<div className="space-y-4 p-5">
					{activeTab === 'home' ? (
						<>
							<div className="h-24 rounded-xl bg-linear-to-br from-orange/25 via-highlight/10 to-transparent" />
							<div className="space-y-2">
								<div className="h-3 w-2/3 rounded bg-white/20" />
								<div className="h-2 w-full rounded bg-white/10" />
								<div className="h-2 w-5/6 rounded bg-white/10" />
							</div>
							<Link
								href="/booking"
								className={[
									'inline-flex rounded-full bg-orange px-4 py-2',
									'text-xs font-semibold text-ink',
								].join(' ')}
							>
								{copy.cta}
							</Link>
						</>
					) : null}

					{activeTab === 'work' ? (
						<div className="grid grid-cols-2 gap-3">
							{[0, 1, 2, 3].map((item) => (
								<div
									key={item}
									className={[
										'aspect-4/3 rounded-xl border border-white/10',
										'bg-surface/80 transition',
										'hover:border-orange/40',
									].join(' ')}
								/>
							))}
						</div>
					) : null}

					{activeTab === 'services' ? (
						<ul className="space-y-2">
							{['Landing', 'Static', 'Personal'].map((label) => (
								<li
									key={label}
									className={[
										'flex items-center justify-between rounded-xl',
										'border border-white/10 bg-surface/60 px-3 py-2.5',
										'text-xs text-white/70 transition',
										'hover:border-orange/35',
									].join(' ')}
								>
									<span>{label}</span>
									<span className="text-orange">→</span>
								</li>
							))}
						</ul>
					) : null}
				</div>
			</div>
		</div>
	)
}
