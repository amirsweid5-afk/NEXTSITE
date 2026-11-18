export interface AdminNavItem {
	href: string
	label: string
	icon:
		| 'layout-dashboard'
		| 'calendar'
		| 'users'
		| 'bell'
		| 'folder-kanban'
		| 'wallet'
		| 'chart-column'
		| 'settings'
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
	{ href: '/admin', label: 'Dashboard', icon: 'layout-dashboard' },
	{ href: '/admin/bookings', label: 'Bookings', icon: 'calendar' },
	{
		href: '/admin/client-managing',
		label: 'Client Managing',
		icon: 'users',
	},
	{ href: '/admin/notifications', label: 'Notifications', icon: 'bell' },
	{ href: '/admin/projects', label: 'Projects', icon: 'folder-kanban' },
	{ href: '/admin/revenue', label: 'Revenue', icon: 'wallet' },
	{ href: '/admin/analytics', label: 'Analytics', icon: 'chart-column' },
	{ href: '/admin/settings', label: 'Settings', icon: 'settings' },
]
