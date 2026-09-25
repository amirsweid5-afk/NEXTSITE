'use client'

import { useEffect, useState, type ComponentType } from 'react'

interface StageCanvasProps {
	shardCount: number
	dpr: number
}

interface ScrollStageProps {
	CanvasView: ComponentType<StageCanvasProps>
	desktopCount?: number
	mobileCount?: number
}

/**
 * Mounts a scroll scene, or a still frame when motion is reduced.
 */
export function ScrollStage ({
	CanvasView,
	desktopCount = 1100,
	mobileCount = 240,
}: ScrollStageProps) {
	const [reduced, setReduced] = useState(false)
	const [ready, setReady] = useState(false)
	const [shardCount, setShardCount] = useState(desktopCount)
	const [dpr, setDpr] = useState(1.25)

	useEffect(() => {
		const media = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		)
		const sync = () => {
			const narrow = window.innerWidth < 768
			setReduced(media.matches)
			setShardCount(narrow ? mobileCount : desktopCount)
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
	}, [desktopCount, mobileCount])

	return (
		<div className="birth-stage" aria-hidden="true">
			{ready && !reduced ? (
				<CanvasView shardCount={shardCount} dpr={dpr} />
			) : (
				<div className="birth-still" />
			)}
			<div className="birth-veil" />
		</div>
	)
}
