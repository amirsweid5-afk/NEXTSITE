'use client'

import { useEffect, useRef, type ComponentType } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollProgress {
	current: number
}

interface SceneWorldProps {
	progress: ScrollProgress
	shardCount: number
}

interface ScrollCanvasProps {
	triggerId: string
	shardCount: number
	dpr: number
	World: ComponentType<SceneWorldProps>
}

/**
 * Asks the canvas to draw whenever scroll progress changes.
 */
function DrawOnScroll ({
	requestDraw,
}: {
	requestDraw: { current: (() => void) | null }
}) {
	const invalidate = useThree((state) => state.invalidate)

	useEffect(() => {
		requestDraw.current = invalidate
		invalidate()
		return () => {
			requestDraw.current = null
		}
	}, [invalidate, requestDraw])

	return null
}

/**
 * Full-viewport WebGL scene locked to a page's scroll progress.
 */
export function ScrollCanvas ({
	triggerId,
	shardCount,
	dpr,
	World,
}: ScrollCanvasProps) {
	const progress = useRef(0)
	const requestDraw = useRef<(() => void) | null>(null)

	useEffect(() => {
		const trigger = ScrollTrigger.create({
			trigger: triggerId,
			start: 'top 4.5rem',
			end: 'bottom bottom',
			onUpdate: (self) => {
				progress.current = self.progress
				requestDraw.current?.()
			},
		})

		progress.current = trigger.progress
		requestDraw.current?.()

		return () => {
			trigger.kill()
		}
	}, [triggerId])

	return (
		<Canvas
			dpr={dpr}
			frameloop="demand"
			gl={{
				antialias: dpr > 1,
				alpha: false,
				powerPreference: 'high-performance',
			}}
			camera={{
				position: [0, 0.4, 6.4],
				fov: 42,
				near: 0.1,
				far: 40,
			}}
			style={{ width: '100%', height: '100%' }}
		>
			<DrawOnScroll requestDraw={requestDraw} />
			<World progress={progress} shardCount={shardCount} />
		</Canvas>
	)
}
