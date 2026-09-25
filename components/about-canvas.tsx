'use client'

import { AboutWorld } from '@/components/about-world'
import { ScrollCanvas } from '@/components/scroll-canvas'

interface AboutCanvasProps {
	shardCount: number
	dpr: number
}

/**
 * About page scene: a story woven into open chapters.
 */
export function AboutCanvas ({
	shardCount,
	dpr,
}: AboutCanvasProps) {
	return (
		<ScrollCanvas
			triggerId="#about-journey"
			shardCount={shardCount}
			dpr={dpr}
			World={AboutWorld}
		/>
	)
}
