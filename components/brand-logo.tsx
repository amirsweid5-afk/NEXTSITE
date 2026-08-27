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
				'relative inline-flex h-9 w-9',
				'shrink-0 items-center justify-center',
				'overflow-visible rounded-full',
				'bg-ink ring-1 ring-white/15',
				'origin-center transition-transform',
				'duration-500 ease-out',
				isEnlarged ? 'scale-[1.50]' : 'scale-100',
			].join(' ')}
		>
			<span className="relative h-full w-full overflow-hidden rounded-full">
				<Image
					src="/ns-logo.jpg"
					alt="NS"
					fill
					sizes="36px"
					priority
					className="object-contain object-center scale-[0.78]"
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
