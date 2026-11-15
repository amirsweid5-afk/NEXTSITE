'use client'

import {
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from 'react'

interface ScrollRevealProps {
	children: ReactNode
	className?: string
	delayClass?: string
}

/**
 * Adds a scroll-triggered fade/rise once the block enters view.
 */
export function ScrollReveal ({
	children,
	className = '',
	delayClass = '',
}: ScrollRevealProps) {
	const ref = useRef<HTMLDivElement>(null)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const node = ref.current
		if (!node) return

		const media = window.matchMedia('(prefers-reduced-motion: reduce)')
		if (media.matches) {
			setIsVisible(true)
			return
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setIsVisible(true)
						observer.disconnect()
					}
				}
			},
			{ threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
		)

		observer.observe(node)
		return () => observer.disconnect()
	}, [])

	return (
		<div
			ref={ref}
			className={[
				'scroll-reveal',
				delayClass,
				isVisible ? 'is-visible' : '',
				className,
			].join(' ')}
		>
			{children}
		</div>
	)
}
