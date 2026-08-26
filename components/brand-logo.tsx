'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface BrandLogoProps {
	asLink?: boolean
	className?: string
}

/**
 * NEXTSITE wordmark with circular NS monogram.
 */
export function BrandLogo ({
	asLink = true,
	className = '',
}: BrandLogoProps) {
	const [isEnlarged, setIsEnlarged] = useState(false)

	function handleLogoClick () {
		setIsEnlarged(true)
		window.setTimeout(() => setIsEnlarged(false), 550)
	}

	const logoMark = (
		<span
			className={[
				'relative inline-flex h-[1.35em]',
				'w-[1.35em] shrink-0 items-center',
				'justify-center overflow-visible',
				'rounded-full ring-1 ring-white/15',
				'origin-center transition-transform',
				'duration-500 ease-out',
				isEnlarged ? 'scale-[2.4]' : 'scale-100',
			].join(' ')}
		>
			<span className="relative h-full w-full overflow-hidden rounded-full">
				<Image
					src="/nextsite-logo.jpg"
					alt=""
					fill
					sizes="24px"
					className={[
						'object-contain object-center',
						'scale-[0.62] mix-blend-screen',
					].join(' ')}
				/>
			</span>
		</span>
	)

	const content = (
		<span
			className={[
				'inline-flex items-center gap-2.5',
				'text-sm font-semibold uppercase',
				'tracking-[0.18em] text-orange',
				className,
			].join(' ')}
		>
			{logoMark}
			<span>NEXTSITE</span>
		</span>
	)

	if (!asLink) return content

	return (
		<Link
			href="/"
			onClick={handleLogoClick}
			className={[
				'focus-visible:outline-2',
				'focus-visible:outline-offset-4',
			].join(' ')}
		>
			{content}
		</Link>
	)
}
