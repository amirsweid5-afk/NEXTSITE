'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const BirthCanvas = dynamic(
	() => import('@/components/birth-canvas').then(
		(module) => module.BirthCanvas,
	),
	{ ssr: false },
)

/**
 * Mounts the 3D birth scene, or a still frame when motion is reduced.
 */
export function HomeScrollScene () {
	const [reduced, setReduced] = useState(false)
	const [ready, setReady] = useState(false)
	const [shardCount, setShardCount] = useState(720)
	const [dpr, setDpr] = useState(1.25)

	useEffect(() => {
		const media = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		)
		const sync = () => {
			const narrow = window.innerWidth < 768
			setReduced(media.matches)
			setShardCount(narrow ? 240 : 1100)
			setDpr(narrow ? 1 : Math.min(window.devicePixelRatio, 1.5))
			setReady(true)
		}

		sync()
		media.addEventListener('change', sync)
		window.addEventListener('resize', sync)

		return () => {
			media.removeEventListener('change', sync)
			window.removeEventListener('resize', sync)
		}
	}, [])

	return (
		<div className="birth-stage" aria-hidden="true">
			{ready && !reduced ? (
				<BirthCanvas shardCount={shardCount} dpr={dpr} />
			) : (
				<div className="birth-still" />
			)}
			<div className="birth-veil" />
		</div>
	)
}
