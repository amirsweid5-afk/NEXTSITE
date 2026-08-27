import type { Metadata } from 'next'
import { Cairo, Geist, Geist_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import Script from 'next/script'
import { LanguageProvider } from '@/components/language-provider'
import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/site-footer'
import { SkipToContent } from '@/components/skip-to-content'
import { SplashCursorEffect } from '@/components/splash-cursor-effect'
import { DEFAULT_LANGUAGE, isLanguage } from '@/lib/language'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

const cairo = Cairo({
	variable: '--font-cairo',
	subsets: ['arabic', 'latin'],
})

export const metadata: Metadata = {
	title: {
		default: 'NEXTSITE',
		template: '%s · NEXTSITE',
	},
	description:
		'A small house for slow mornings, shared tables, and easy stays.',
}

const BOOTSTRAP_SCRIPT = `(function () {
	try {
		var t = localStorage.getItem('theme');
		if (t === 'light' || t === 'dark') {
			document.documentElement.setAttribute('data-theme', t);
			document.documentElement.classList.toggle('dark', t === 'dark');
		}
		var l = localStorage.getItem('lang');
		if (l === 'ar' || l === 'en') {
			document.documentElement.setAttribute('data-lang', l);
			document.documentElement.lang = l;
			document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
		}
	} catch (err) {}
})();`

export default async function RootLayout ({
	children,
}: LayoutProps<"/">) {
	const cookieStore = await cookies()
	const langCookie = cookieStore.get('lang')?.value
	const language = isLanguage(langCookie)
		? langCookie
		: DEFAULT_LANGUAGE

	return (
		<html
			lang={language}
			dir={language === 'ar' ? 'rtl' : 'ltr'}
			data-lang={language}
			data-theme="dark"
			suppressHydrationWarning
			className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} dark h-full bg-background text-foreground antialiased`}
		>
			<body className="flex min-h-full flex-col font-sans">
				<Script
					id="theme-init"
					strategy="beforeInteractive"
				>
					{BOOTSTRAP_SCRIPT}
				</Script>
				<LanguageProvider initialLanguage={language}>
					<SplashCursorEffect />
					<SkipToContent />
					<Navbar />
					<main id="main" className="flex flex-1 flex-col">
						{children}
					</main>
					<SiteFooter />
				</LanguageProvider>
			</body>
		</html>
	)
}
