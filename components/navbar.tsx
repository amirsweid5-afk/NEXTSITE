'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BrandLogo } from '@/components/brand-logo'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { useContent } from '@/components/language-provider'

interface NavItem {
	href: string
	label: string
}

/**
 * Site-wide navigation with a compact mobile menu.
 */
export function Navbar () {
	const pathname = usePathname()
	const content = useContent()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [menuPathname, setMenuPathname] = useState(pathname)

	if (pathname !== menuPathname) {
		setMenuPathname(pathname)
		setIsMenuOpen(false)
	}

	function handleToggleMenu () {
		setIsMenuOpen((isOpen) => !isOpen)
	}

	const navItems: NavItem[] = [
		{ href: '/', label: content.nav.home },
		{ href: '/about-us', label: content.nav.aboutUs },
		{ href: '/booking', label: content.nav.booking },
	]

	return (
		<header
			className={[
				'relative sticky top-0 z-50 border-b',
				'border-line bg-ink/90',
				'backdrop-blur-md',
			].join(' ')}
		>
			<div
				className={[
					'mx-auto flex h-[4.5rem]',
					'max-w-7xl items-center',
					'justify-between gap-4 px-6',
					'sm:px-10 lg:px-12',
				].join(' ')}
			>
				<BrandLogo />

				<div className="flex items-center gap-3 md:flex-1 md:justify-end md:gap-8">
					<LanguageToggle />
					<nav
						id="site-nav"
						aria-label={content.nav.primary}
						className={[
							isMenuOpen
								? 'absolute inset-x-0 top-[4.5rem] block'
								: 'hidden',
							'border-b border-line bg-surface',
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
							{navItems.map((item) => {
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
													? 'text-orange'
													: 'text-white/55 hover:text-orange',
											].join(' ')}
										>
											{item.label}
										</Link>
									</li>
								)
							})}
							<li className="pt-2 md:hidden">
								<Link
									href="/booking"
									className={[
										'inline-flex min-h-11 w-full',
										'items-center justify-center',
										'rounded-full bg-orange px-5',
										'text-xs font-semibold uppercase',
										'tracking-[0.18em] text-ink',
									].join(' ')}
								>
									{content.nav.bookNow}
								</Link>
							</li>
						</ul>
					</nav>

					<Link
						href="/booking"
						className={[
							'hidden min-h-10 items-center',
							'rounded-full bg-orange px-5',
							'text-xs font-semibold uppercase',
							'tracking-[0.18em] text-ink',
							'shadow-[0_0_20px_rgba(232,120,18,0.35)]',
							'transition duration-300',
							'hover:bg-highlight',
							'hover:shadow-[0_0_28px_rgba(209,172,44,0.4)]',
							'focus-visible:outline-2',
							'focus-visible:outline-offset-4',
							'md:inline-flex',
						].join(' ')}
					>
						{content.nav.bookNow}
					</Link>
					<ThemeToggle />
					<button
						type="button"
						className={[
							'inline-flex items-center',
							'justify-center rounded-sm',
							'px-3 py-2 text-xs',
							'font-medium uppercase',
							'tracking-[0.16em] text-orange',
							'md:hidden',
							'focus-visible:outline-2',
							'focus-visible:outline-offset-4',
						].join(' ')}
						aria-expanded={isMenuOpen}
						aria-controls="site-nav"
						onClick={handleToggleMenu}
					>
						{isMenuOpen
							? content.nav.close
							: content.nav.menu}
					</button>
				</div>
			</div>
		</header>
	)
}
