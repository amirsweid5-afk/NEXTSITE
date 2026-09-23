import type { Metadata } from 'next'
import { Berkshire_Swash, Cairo, Emilys_Candy } from 'next/font/google'
import { cookies } from 'next/headers'
import { LanguageProvider } from '@/components/language-provider'
import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/site-footer'
import { SkipToContent } from '@/components/skip-to-content'
import { SplashCursorEffect } from '@/components/splash-cursor-effect'
import { DEFAULT_LANGUAGE, isLanguage } from '@/lib/language'
import './globals.css'

const emilysCandy = Emilys_Candy({
	variable: '--font-emilys-candy',
	subsets: ['latin'],
	weight: '400',
})

const cairo = Cairo({
	variable: '--font-cairo',
	subsets: ['arabic', 'latin'],
})

const berkshireSwash = Berkshire_Swash({
	variable: '--font-berkshire-swash',
	subsets: ['latin'],
	weight: '400',
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
			className={`${emilysCandy.variable} ${cairo.variable} ${berkshireSwash.variable} dark h-full bg-background text-foreground antialiased`}
		>
			<head>
				<script
					id="theme-init"
					dangerouslySetInnerHTML={{
						__html: BOOTSTRAP_SCRIPT,
					}}
				/>
			</head>
			<body className="flex min-h-full flex-col font-sans">
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
