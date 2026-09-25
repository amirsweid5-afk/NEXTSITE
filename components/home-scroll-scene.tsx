'use client'

import dynamic from 'next/dynamic'
import { ScrollStage } from '@/components/scroll-stage'

const BirthCanvas = dynamic(
	() => import('@/components/birth-canvas').then(
		(module) => module.BirthCanvas,
	),
	{ ssr: false },
)

/**
 * Homepage scroll scene.
 */
export function HomeScrollScene () {
	return <ScrollStage CanvasView={BirthCanvas} />
}
