'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	CalendarDays,
	ChartColumn,
	ChevronLeft,
	ChevronRight,
	FolderKanban,
	LayoutDashboard,
	Settings,
	Users,
	Wallet,
	type LucideIcon,
} from 'lucide-react'
import { ADMIN_NAV_ITEMS } from '@/lib/admin/nav'

const ICONS: Record<string, LucideIcon> = {
	'layout-dashboard': LayoutDashboard,
	calendar: CalendarDays,
	users: Users,
	'folder-kanban': FolderKanban,
	wallet: Wallet,
	'chart-column': ChartColumn,
	settings: Settings,
}

interface AdminSidebarProps {
	isCollapsed: boolean
	onToggle: () => void
}

/**
 * Collapsible left sidebar for the admin portal.
 */
export function AdminSidebar ({
	isCollapsed,
	onToggle,
}: AdminSidebarProps) {
	const pathname = usePathname()

	return (
		<aside
			className={[
				'flex h-full flex-col border-e border-white/10',
				'bg-[var(--admin-chrome)] transition-[width] duration-300',
				isCollapsed ? 'w-[4.5rem]' : 'w-64',
			].join(' ')}
		>
			<div className="flex h-16 items-center justify-between gap-2 border-b border-white/10 px-4">
				{isCollapsed ? (
					<span className="mx-auto text-sm font-semibold text-violet-500">
						N
					</span>
				) : (
					<div>
						<p className="text-sm font-semibold tracking-wide text-white">
							NEXTSITE
						</p>
						<p className="text-[0.65rem] uppercase tracking-[0.18em] text-violet-500/90">
							Admin Portal
						</p>
					</div>
				)}
				<button
					type="button"
					onClick={onToggle}
					aria-label={
						isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
					}
					className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
				>
					{isCollapsed ? (
						<ChevronRight className="h-4 w-4" />
					) : (
						<ChevronLeft className="h-4 w-4" />
					)}
				</button>
			</div>

			<nav
				aria-label="Admin"
				className="flex flex-1 flex-col gap-1 p-3"
			>
				{ADMIN_NAV_ITEMS.map((item) => {
					const Icon = ICONS[item.icon]
					const isActive = item.href === '/admin'
						? pathname === '/admin'
						: pathname.startsWith(item.href)

					return (
						<Link
							key={item.href}
							href={item.href}
							title={item.label}
							aria-current={isActive ? 'page' : undefined}
							className={[
								'flex items-center gap-3 rounded-xl px-3 py-2.5',
								'text-sm font-medium transition duration-200',
								isCollapsed ? 'justify-center' : '',
								isActive
									? 'bg-violet-500/20 text-violet-600 dark:text-violet-600 dark:text-violet-200'
									: 'text-white/60 hover:bg-white/5 hover:text-white',
							].join(' ')}
						>
							{Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
							{isCollapsed ? null : <span>{item.label}</span>}
						</Link>
					)
				})}
			</nav>

			<div className="border-t border-white/10 p-3">
				<Link
					href="/"
					className={[
						'flex items-center rounded-xl px-3 py-2.5',
						'text-sm text-white/50 hover:bg-white/5 hover:text-white',
						isCollapsed ? 'justify-center' : '',
					].join(' ')}
				>
					{isCollapsed ? '←' : '← Back to site'}
				</Link>
			</div>
		</aside>
	)
}
