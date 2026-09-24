export interface AdminNavItem {
	href: string
	label: string
	icon:
		| 'layout-dashboard'
		| 'calendar'
		| 'users'
		| 'folder-kanban'
		| 'wallet'
		| 'chart-column'
		| 'settings'
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
	{ href: '/admin', label: 'Dashboard', icon: 'layout-dashboard' },
	{ href: '/admin/bookings', label: 'Bookings', icon: 'calendar' },
	{ href: '/admin/clients', label: 'Clients', icon: 'users' },
	{ href: '/admin/projects', label: 'Projects', icon: 'folder-kanban' },
	{ href: '/admin/revenue', label: 'Revenue', icon: 'wallet' },
	{ href: '/admin/analytics', label: 'Analytics', icon: 'chart-column' },
	{ href: '/admin/settings', label: 'Settings', icon: 'settings' },
]
