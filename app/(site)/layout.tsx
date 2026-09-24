import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/site-footer'
import { SkipToContent } from '@/components/skip-to-content'
import { SplashCursorEffect } from '@/components/splash-cursor-effect'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'

export default async function SiteLayout ({
	children,
}: {
	children: React.ReactNode
}) {
	const profile = await getCurrentProfile()

	return (
		<>
			<SplashCursorEffect />
			<SkipToContent />
			<Navbar isAdmin={profile?.isAdmin === true} />
			<main id="main" className="flex flex-1 flex-col">
				{children}
			</main>
			<SiteFooter />
		</>
	)
}
