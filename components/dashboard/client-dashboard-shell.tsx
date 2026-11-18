'use client'

import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { CursorEffectToggle } from '@/components/cursor-effect-toggle'
import { GlobeToggle } from '@/components/globe-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'

interface ClientDashboardShellProps {
	clientName: string
	children: React.ReactNode
}

/**
 * Compact portal chrome for the signed-in client dashboard.
 */
export function ClientDashboardShell ({
	clientName,
	children,
}: ClientDashboardShellProps) {
	return (
		<div className="relative isolate min-h-screen overflow-hidden bg-ink text-white">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
			>
				<div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-orange/15 blur-[110px]" />
				<div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" />
				<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange/40 to-transparent" />
			</div>

			<header className="relative z-10 border-b border-white/10 bg-ink/70 backdrop-blur-md">
				<div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
					<div className="flex items-center gap-3">
						<BrandLogo />
						<span
							aria-hidden="true"
							className="hidden h-6 w-px bg-white/20 sm:block"
						/>
						<p className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange sm:flex">
							<LayoutDashboard className="h-3.5 w-3.5" />
							Dashboard
						</p>
					</div>
					<div className="flex items-center gap-2 sm:gap-3">
						<p className="hidden text-sm text-white/55 md:block">
							{clientName}
						</p>
						<LanguageToggle />
						<CursorEffectToggle />
						<GlobeToggle />
						<ThemeToggle />
						<Link
							href="/"
							className={[
								'inline-flex min-h-9 shrink-0 items-center',
								'rounded-full border border-orange/40',
								'bg-orange px-3 text-xs font-semibold',
								'uppercase tracking-[0.12em] text-ink',
								'hover:bg-highlight',
							].join(' ')}
						>
							Back to site
						</Link>
					</div>
				</div>
			</header>

			<main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
				{children}
			</main>
		</div>
	)
}
