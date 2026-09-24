import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { requireAdmin } from '@/lib/admin/require-admin'

export const metadata = {
	title: 'Settings',
}

export default async function AdminSettingsPage () {
	const profile = await requireAdmin()

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
					Settings
				</h1>
				<p className="mt-1 text-sm text-white/50">
					Admin profile and portal preferences.
				</p>
			</div>

			<section className="rounded-2xl border border-white/10 bg-[var(--admin-surface)] p-6">
				<h2 className="text-sm font-semibold text-white">
					Admin Profile
				</h2>
				<dl className="mt-5 grid gap-4 sm:grid-cols-2">
					<div>
						<dt className="text-xs uppercase tracking-[0.14em] text-white/40">
							Name
						</dt>
						<dd className="mt-2 text-sm text-white">
							{profile.name}
						</dd>
					</div>
					<div>
						<dt className="text-xs uppercase tracking-[0.14em] text-white/40">
							Email
						</dt>
						<dd className="mt-2 break-all text-sm text-white">
							{profile.email}
						</dd>
					</div>
					<div>
						<dt className="text-xs uppercase tracking-[0.14em] text-white/40">
							Role
						</dt>
						<dd className="mt-2">
							<span className="inline-flex rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-200">
								{profile.role}
							</span>
						</dd>
					</div>
				</dl>
			</section>

			<section className="rounded-2xl border border-white/10 bg-[var(--admin-surface)] p-6">
				<h2 className="text-sm font-semibold text-white">
					Portal Preferences
				</h2>
				<div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm text-white/70">Language</p>
						<p className="mt-1 text-xs text-white/40">
							Controls public site copy when you leave the portal
						</p>
						<div className="mt-3">
							<LanguageToggle />
						</div>
					</div>
					<div>
						<p className="text-sm text-white/70">Theme</p>
						<p className="mt-1 text-xs text-white/40">
							Light or dark appearance
						</p>
						<div className="mt-3">
							<ThemeToggle />
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
