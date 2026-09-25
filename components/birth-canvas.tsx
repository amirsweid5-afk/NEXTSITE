'use client'

import { BirthWorld } from '@/components/birth-world'
import { ScrollCanvas } from '@/components/scroll-canvas'

interface BirthCanvasProps {
	shardCount: number
	dpr: number
}

/**
 * Homepage scene: a website born from liquid chrome.
 */
export function BirthCanvas ({
	shardCount,
	dpr,
}: BirthCanvasProps) {
	return (
		<ScrollCanvas
			triggerId="#home-journey"
			shardCount={shardCount}
			dpr={dpr}
			World={BirthWorld}
		/>
	)
}
