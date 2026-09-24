'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { ADMIN_NAV_ITEMS } from '@/lib/admin/nav'

interface AdminShellProps {
	adminName: string
	adminEmail: string
	children: React.ReactNode
}

/**
 * Persistent admin portal chrome with collapsible sidebar.
 */
export function AdminShell ({
	adminName,
	adminEmail,
	children,
}: AdminShellProps) {
	const pathname = usePathname()
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [isMobileOpen, setIsMobileOpen] = useState(false)

	useEffect(() => {
		setIsMobileOpen(false)
	}, [pathname])

	const activeItem = ADMIN_NAV_ITEMS.find((item) => {
		if (item.href === '/admin') return pathname === '/admin'
		return pathname.startsWith(item.href)
	})
	const title = activeItem?.label ?? 'Admin Portal'

	return (
		<div className="admin-portal flex min-h-screen">
			<div className="hidden lg:block">
				<div className="sticky top-0 h-screen">
					<AdminSidebar
						isCollapsed={isCollapsed}
						onToggle={() => {
							setIsCollapsed((value) => !value)
						}}
					/>
				</div>
			</div>

			{isMobileOpen ? (
				<>
					<button
						type="button"
						aria-label="Close navigation"
						className="fixed inset-0 z-40 bg-[var(--admin-overlay)] lg:hidden"
						onClick={() => setIsMobileOpen(false)}
					/>
					<div className="fixed inset-y-0 start-0 z-50 lg:hidden">
						<AdminSidebar
							isCollapsed={false}
							onToggle={() => setIsMobileOpen(false)}
						/>
					</div>
				</>
			) : null}

			<div className="flex min-w-0 flex-1 flex-col">
				<AdminTopbar
					title={title}
					adminName={adminName}
					adminEmail={adminEmail}
					onOpenMobileNav={() => setIsMobileOpen(true)}
				/>
				<main
					id="main"
					className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8"
				>
					{children}
				</main>
			</div>
		</div>
	)
}
