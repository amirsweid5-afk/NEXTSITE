import { type ReactNode } from 'react'

interface AuthScreenProps {
	eyebrow: string
	title: string
	description: string
	children: ReactNode
}

export const AUTH_INPUT_CLASS = [
	'w-full rounded-xl border bg-ink/60',
	'px-4 py-3 text-sm text-white',
	'placeholder:text-white/35',
	'transition duration-300',
	'focus:border-orange/60 focus:bg-ink/80',
	'focus:outline-none',
].join(' ')

/**
 * Shared chrome for the login and sign-in screens.
 */
export function AuthScreen ({
	eyebrow,
	title,
	description,
	children,
}: AuthScreenProps) {
	return (
		<section
			className={[
				'relative isolate overflow-hidden',
				'bg-ink py-20 sm:py-24 lg:py-28',
			].join(' ')}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
			>
				<div className="absolute left-1/2 top-0 h-px w-[min(72%,40rem)] -translate-x-1/2 bg-linear-to-r from-transparent via-orange/40 to-transparent" />
				<div className="absolute -left-20 top-16 h-64 w-64 rounded-full bg-orange/10 blur-[100px]" />
				<div className="absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-gold/10 blur-[90px]" />
			</div>

			<div className="relative z-10 mx-auto max-w-lg px-6 sm:px-10">
				<div className="text-center">
					<p className="text-xs font-medium uppercase tracking-[0.28em] text-orange">
						{eyebrow}
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
					<p className="mt-4 text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
						{description}
					</p>
				</div>
				{children}
			</div>
		</section>
	)
}
