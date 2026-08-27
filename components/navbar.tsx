'use client'

import { useEffect, useState } from 'react'
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
 * Site-wide navigation with a mobile sidebar menu.
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

	useEffect(() => {
		if (!isMenuOpen) return

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		function handleKeyDown (event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setIsMenuOpen(false)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			document.body.style.overflow = previousOverflow
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isMenuOpen])

	function handleToggleMenu () {
		setIsMenuOpen((isOpen) => !isOpen)
	}

	function handleCloseMenu () {
		setIsMenuOpen(false)
	}

	const navItems: NavItem[] = [
		{ href: '/', label: content.nav.home },
		{ href: '/about-us', label: content.nav.aboutUs },
		{ href: '/booking', label: content.nav.booking },
	]

	return (
		<>
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
						<div className="hidden md:block">
							<LanguageToggle />
						</div>
						<nav
							id="site-nav"
							aria-label={content.nav.primary}
							className="hidden md:block"
						>
							<ul
								className={[
									'flex flex-row items-center',
									'gap-8',
								].join(' ')}
							>
								{navItems.map((item) => {
									const isActive =
										pathname === item.href
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
						<div className="hidden md:block">
							<ThemeToggle />
						</div>
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
							aria-controls="site-nav-sidebar"
							onClick={handleToggleMenu}
						>
							{isMenuOpen
								? content.nav.close
								: content.nav.menu}
						</button>
					</div>
				</div>
			</header>

			<button
				type="button"
				tabIndex={isMenuOpen ? 0 : -1}
				aria-label={content.nav.close}
				onClick={handleCloseMenu}
				className={[
					'fixed inset-x-0 bottom-0 top-[4.5rem]',
					'z-40 bg-ink/70 backdrop-blur-sm',
					'transition-opacity duration-300',
					'md:hidden',
					isMenuOpen
						? 'opacity-100'
						: 'pointer-events-none opacity-0',
				].join(' ')}
			/>

			<aside
				id="site-nav-sidebar"
				aria-label={content.nav.primary}
				aria-hidden={!isMenuOpen}
				inert={isMenuOpen ? undefined : true}
				className={[
					'fixed bottom-0 start-0 top-[4.5rem] z-[45]',
					'flex w-[min(19rem,86vw)] flex-col',
					'border-e border-white/10 bg-surface',
					'shadow-[16px_0_40px_rgba(0,0,0,0.35)]',
					'transition-transform duration-300',
					'ease-out md:hidden',
					isMenuOpen
						? 'translate-x-0'
						: '-translate-x-full rtl:translate-x-full',
				].join(' ')}
			>
				<nav className="flex flex-1 flex-col px-6 py-8">
					<ul className="flex flex-col gap-1">
						{navItems.map((item) => {
							const isActive = pathname === item.href
							return (
								<li key={item.href}>
									<Link
										href={item.href}
										onClick={handleCloseMenu}
										aria-current={
											isActive
												? 'page'
												: undefined
										}
										className={[
											'block rounded-lg px-3 py-3',
											'text-sm font-medium uppercase',
											'tracking-[0.18em]',
											'focus-visible:outline-2',
											'focus-visible:outline-offset-4',
											isActive
												? 'bg-orange/10 text-orange'
												: 'text-white/70 hover:bg-white/5 hover:text-orange',
										].join(' ')}
									>
										{item.label}
									</Link>
								</li>
							)
						})}
					</ul>
					<div
						className={[
							'mt-8 space-y-5 border-t',
							'border-white/10 pt-6',
						].join(' ')}
					>
						<div>
							<p
								className={[
									'mb-3 text-xs font-medium',
									'uppercase tracking-[0.18em]',
									'text-white/40',
								].join(' ')}
							>
								{content.nav.toggleLanguage}
							</p>
							<LanguageToggle />
						</div>
						<div
							className={[
								'flex items-center',
								'justify-between gap-3',
							].join(' ')}
						>
							<p
								className={[
									'text-xs font-medium uppercase',
									'tracking-[0.18em] text-white/40',
								].join(' ')}
							>
								{content.themeToggle}
							</p>
							<ThemeToggle />
						</div>
					</div>
					<Link
						href="/booking"
						onClick={handleCloseMenu}
						className={[
							'mt-auto inline-flex min-h-11',
							'items-center justify-center',
							'rounded-full bg-orange px-5',
							'text-xs font-semibold uppercase',
							'tracking-[0.18em] text-ink',
							'transition duration-300',
							'hover:bg-highlight',
							'focus-visible:outline-2',
							'focus-visible:outline-offset-4',
						].join(' ')}
					>
						{content.nav.bookNow}
					</Link>
				</nav>
			</aside>
		</>
	)
}
