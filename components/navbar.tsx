'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
	href: string
	label: string
}

const NAV_ITEMS: NavItem[] = [
	{ href: '/', label: 'Home' },
	{ href: '/about-us', label: 'About Us' },
	{ href: '/booking', label: 'Booking' },
]

/**
 * Site-wide navigation with a compact mobile menu.
 */
export function Navbar () {
	const pathname = usePathname()
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	useEffect(() => {
		setIsMenuOpen(false)
	}, [pathname])

	function handleToggleMenu () {
		setIsMenuOpen((isOpen) => !isOpen)
	}

	return (
		<header
			className={[
				'relative sticky top-0 z-50 border-b',
				'border-[color:var(--line)]',
				'bg-[color:var(--background)]/90',
				'backdrop-blur-md',
			].join(' ')}
		>
			<div
				className={[
					'mx-auto flex h-[4.5rem]',
					'max-w-6xl items-center',
					'justify-between gap-6 px-6',
					'sm:px-10',
				].join(' ')}
			>
				<Link
					href="/"
					className={[
						'font-semibold tracking-[0.18em]',
						'text-sm uppercase',
						'focus-visible:outline-2',
						'focus-visible:outline-offset-4',
					].join(' ')}
				>
					Lumen
				</Link>
				<button
					type="button"
					className={[
						'inline-flex items-center',
						'justify-center rounded-sm',
						'px-3 py-2 text-xs',
						'font-medium uppercase',
						'tracking-[0.16em] md:hidden',
						'focus-visible:outline-2',
						'focus-visible:outline-offset-4',
					].join(' ')}
					aria-expanded={isMenuOpen}
					aria-controls="site-nav"
					onClick={handleToggleMenu}
				>
					{isMenuOpen ? 'Close' : 'Menu'}
				</button>
				<nav
					id="site-nav"
					aria-label="Primary"
					className={[
						isMenuOpen
							? 'absolute inset-x-0 top-[4.5rem] block'
							: 'hidden',
						'border-b border-[color:var(--line)]',
						'bg-[color:var(--background)]',
						'md:static md:block md:border-0',
						'md:bg-transparent',
					].join(' ')}
				>
					<ul
						className={[
							'flex flex-col gap-1 px-6 py-4',
							'md:flex-row md:items-center',
							'md:gap-8 md:px-0 md:py-0',
						].join(' ')}
					>
						{NAV_ITEMS.map((item) => {
							const isActive = pathname === item.href
							return (
								<li key={item.href}>
									<Link
										href={item.href}
										aria-current={
											isActive
												? 'page'
												: undefined
										}
										className={[
											'block py-2 text-xs',
											'font-medium uppercase',
											'tracking-[0.2em]',
											'focus-visible:outline-2',
											'focus-visible:outline-offset-4',
											isActive
												? 'text-[color:var(--accent)]'
												: 'text-[color:var(--muted)] hover:text-[color:var(--foreground)]',
										].join(' ')}
									>
										{item.label}
									</Link>
								</li>
							)
						})}
					</ul>
				</nav>
			</div>
		</header>
	)
}
