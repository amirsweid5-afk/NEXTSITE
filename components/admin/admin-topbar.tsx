'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

interface AdminTopbarProps {
	title: string
	adminName: string
	adminEmail: string
	onOpenMobileNav: () => void
}

/**
 * Top navigation bar for the admin portal.
 */
export function AdminTopbar ({
	title,
	adminName,
	adminEmail,
	onOpenMobileNav,
}: AdminTopbarProps) {
	return (
		<header className="flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-[var(--admin-topbar)] px-4 backdrop-blur-md sm:px-6">
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={onOpenMobileNav}
					aria-label="Open navigation"
					className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 lg:hidden"
				>
					<Menu className="h-4 w-4" />
				</button>
				<div>
					<p className="text-sm font-semibold text-white">
						{title}
					</p>
					<p className="hidden text-xs text-white/45 sm:block">
						Manage bookings, clients, and revenue
					</p>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<ThemeToggle />
				<span className="hidden rounded-full bg-violet-500/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-600 dark:text-violet-200 sm:inline-flex">
					Admin
				</span>
				<div className="text-end">
					<p className="text-sm font-medium text-white">
						{adminName}
					</p>
					<p className="max-w-[10rem] truncate text-xs text-white/45 sm:max-w-none">
						{adminEmail}
					</p>
				</div>
				<Link
					href="/admin/settings"
					className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/30 text-sm font-semibold text-violet-700 dark:text-violet-100"
					aria-label="Settings"
				>
					{adminName.slice(0, 1).toUpperCase()}
				</Link>
			</div>
		</header>
	)
}
