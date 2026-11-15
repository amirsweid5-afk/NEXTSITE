import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/site-footer'
import { SkipToContent } from '@/components/skip-to-content'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'

export default async function SiteLayout ({
	children,
}: {
	children: React.ReactNode
}) {
	const profile = await getCurrentProfile()

	return (
		<>
			<SkipToContent />
			<Navbar
				isAdmin={profile?.isAdmin === true}
				userName={profile?.name ?? null}
				userEmail={profile?.email ?? null}
				userPhone={profile?.phone ?? ''}
				userAvatar={profile?.avatar ?? null}
			/>
			<main id="main" className="page-enter flex flex-1 flex-col">
				{children}
			</main>
			<SiteFooter />
		</>
	)
}
