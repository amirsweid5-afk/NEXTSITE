'use client'

import Link from 'next/link'
import { useContent } from '@/components/language-provider'

const SOCIAL_LINKS = [
	{
		href: 'https://instagram.com/',
		label: 'Instagram',
	},
]

const CONTACT = {
	phone: '+961 70 552 181',
	phoneHref: 'tel:+96170552181',
	email: 'amirsweid5@gmail.com',
	emailHref: 'mailto:amirsweid5@gmail.com',
}

function SocialIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-4 w-4"
		>
			<rect
				x="3.5"
				y="3.5"
				width="17"
				height="17"
				rx="4"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<circle
				cx="12"
				cy="12"
				r="3.75"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<circle
				cx="17.25"
				cy="6.75"
				r="0.9"
				fill="currentColor"
			/>
		</svg>
	)
}

function PhoneIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-4 w-4 shrink-0"
		>
			<path
				d="M8.5 4.5h2.2l1 4.2-1.6 1c1.2 2.4 3.1 4.3 5.5 5.5l1-1.6 4.2 1v2.2c0 .6-.5 1.1-1.1 1.1A13.4 13.4 0 0 1 5.4 5.6c0-.6.5-1.1 1.1-1.1Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function EmailIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-4 w-4 shrink-0"
		>
			<rect
				x="3.5"
				y="5.5"
				width="17"
				height="13"
				rx="2"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M4.5 7.5 12 12.5l7.5-5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

/**
 * Site-wide footer with brand, contact, nav, and booking CTA.
 */
export function SiteFooter () {
	const copy = useContent().footer

	return (
		<footer
			className={[
				'relative isolate mt-auto overflow-hidden',
				'border-t border-white/10 bg-ink',
			].join(' ')}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
			>
				<div className="absolute left-1/2 top-0 h-px w-[min(70%,32rem)] -translate-x-1/2 bg-linear-to-r from-transparent via-gold/30 to-transparent" />
				<div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-orange/10 blur-[90px]" />
				<div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-gold/10 blur-[100px]" />
			</div>

			<div className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
				<div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
					<div className="sm:col-span-2 lg:col-span-4">
						<Link
							href="/"
							className={[
								'font-semibold tracking-[0.18em]',
								'text-sm uppercase text-orange',
								'focus-visible:outline-2',
								'focus-visible:outline-offset-4',
							].join(' ')}
						>
							NEXTSITE
						</Link>
						<p className="mt-4 max-w-xs text-sm leading-6 text-white/55">
							{copy.tagline}
						</p>
						<Link
							href="/booking"
							className={[
								'mt-8 inline-flex min-h-11',
								'items-center justify-center',
								'rounded-full bg-orange px-6',
								'text-xs font-semibold uppercase',
								'tracking-[0.18em] text-ink',
								'transition duration-300',
								'hover:bg-highlight',
								'hover:shadow-[0_0_24px_rgba(209,172,44,0.3)]',
								'focus-visible:outline-2',
								'focus-visible:outline-offset-4',
							].join(' ')}
						>
							{copy.bookNow}
						</Link>
					</div>

					<div className="lg:col-span-2">
						<p className="text-xs font-medium uppercase tracking-[0.22em] text-white/40">
							{copy.navigate}
						</p>
						<ul className="mt-5 space-y-3">
							{copy.nav.map((item) => (
								<li key={item.label}>
									<Link
										href={item.href}
										className={[
											'text-sm text-white/60',
											'transition duration-300',
											'hover:text-orange',
											'focus-visible:outline-2',
											'focus-visible:outline-offset-4',
										].join(' ')}
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="lg:col-span-3">
						<p className="text-xs font-medium uppercase tracking-[0.22em] text-white/40">
							{copy.services}
						</p>
						<ul className="mt-5 space-y-3">
							{copy.serviceLinks.map((item) => (
								<li key={item.label}>
									<Link
										href={item.href}
										className={[
											'text-sm text-white/60',
											'transition duration-300',
											'hover:text-orange',
											'focus-visible:outline-2',
											'focus-visible:outline-offset-4',
										].join(' ')}
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="lg:col-span-3">
						<p className="text-xs font-medium uppercase tracking-[0.22em] text-white/40">
							{copy.contact}
						</p>
						<ul className="mt-5 space-y-4">
							<li>
								<a
									href={CONTACT.phoneHref}
									className={[
										'inline-flex items-center gap-3',
										'text-sm text-white/60',
										'transition duration-300',
										'hover:text-orange',
										'focus-visible:outline-2',
										'focus-visible:outline-offset-4',
									].join(' ')}
								>
									<span className="text-orange/80">
										<PhoneIcon />
									</span>
									{CONTACT.phone}
								</a>
							</li>
							<li>
								<a
									href={CONTACT.emailHref}
									className={[
										'inline-flex items-center gap-3',
										'text-sm text-white/60',
										'transition duration-300',
										'hover:text-orange',
										'focus-visible:outline-2',
										'focus-visible:outline-offset-4',
									].join(' ')}
								>
									<span className="text-orange/80">
										<EmailIcon />
									</span>
									{CONTACT.email}
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="relative z-10 border-t border-white/10">
				<div
					className={[
						'mx-auto flex max-w-7xl',
						'flex-col items-center gap-4',
						'px-6 py-6 sm:px-10 lg:px-12',
					].join(' ')}
				>
					{SOCIAL_LINKS.map((social) => (
						<a
							key={social.label}
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.label}
							className={[
								'inline-flex h-10 w-10',
								'items-center justify-center',
								'rounded-full border border-white/10',
								'text-white/55 transition duration-300',
								'hover:border-orange/45 hover:text-orange',
								'focus-visible:outline-2',
								'focus-visible:outline-offset-4',
							].join(' ')}
						>
							<SocialIcon />
						</a>
					))}
					<p className="text-center text-xs tracking-wide text-white/40">
						{copy.rights}
					</p>
				</div>
			</div>
		</footer>
	)
}
