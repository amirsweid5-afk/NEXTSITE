import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: {
		default: 'Lumen',
		template: '%s · Lumen',
	},
	description:
		'A small house for slow mornings, shared tables, and easy stays.',
}

export default function RootLayout ({
	children,
}: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full bg-background text-foreground antialiased`}
		>
			<body className="flex min-h-full flex-col font-sans">
				<a
					href="#main"
					className={[
						'sr-only focus:not-sr-only',
						'focus:absolute focus:left-4',
						'focus:top-4 focus:z-[60]',
						'focus:bg-highlight',
						'focus:px-3 focus:py-2',
						'focus:text-ink',
					].join(' ')}
				>
					Skip to content
				</a>
				<Navbar />
				<main id="main" className="flex flex-1 flex-col">
					{children}
				</main>
				<SiteFooter />
			</body>
		</html>
	)
}
