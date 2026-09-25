'use client'

import dynamic from 'next/dynamic'
import { ScrollStage } from '@/components/scroll-stage'

const AboutCanvas = dynamic(
	() => import('@/components/about-canvas').then(
		(module) => module.AboutCanvas,
	),
	{ ssr: false },
)

/**
 * About page scroll scene.
 */
export function AboutScrollScene () {
	return (
		<ScrollStage
			CanvasView={AboutCanvas}
			desktopCount={560}
			mobileCount={180}
		/>
	)
}
