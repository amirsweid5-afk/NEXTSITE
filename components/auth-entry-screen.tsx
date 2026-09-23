'use client'

import { useContent } from '@/components/language-provider'

interface AuthEntryScreenProps {
	mode: 'login' | 'signIn'
}

/**
 * Destination screen for navbar Login and Sign in actions.
 */
export function AuthEntryScreen ({ mode }: AuthEntryScreenProps) {
	const copy = useContent().nav
	const title = mode === 'login' ? copy.login : copy.signIn

	return (
		<section
			className={[
				'relative isolate overflow-hidden',
				'bg-ink py-20 sm:py-24 lg:py-28',
			].join(' ')}
		>
			<div className="relative z-10 mx-auto max-w-lg px-6 text-center sm:px-10">
				<p className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
					NEXTSITE
				</p>
				<h1
					className={[
						'mt-4 text-3xl font-semibold',
						'tracking-tight text-white',
						'sm:text-4xl',
					].join(' ')}
				>
					{title}
				</h1>
			</div>
		</section>
	)
}
