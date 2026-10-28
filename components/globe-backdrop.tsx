'use client'

import { useEffect, useRef } from 'react'

const MERIDIANS = 14
const PARALLELS = 7
const TURN = Math.PI * 2

interface Point {
	x: number
	y: number
	z: number
}

/**
 * Projects a sphere point after spin and a scroll flip.
 */
function project (
	lat: number,
	lon: number,
	spin: number,
	tilt: number,
	cx: number,
	cy: number,
	radius: number,
): Point {
	const ring = Math.cos(lat)
	const x = ring * Math.sin(lon + spin)
	let y = Math.sin(lat)
	let z = ring * Math.cos(lon + spin)
	const cos = Math.cos(tilt)
	const sin = Math.sin(tilt)
	const nextY = y * cos - z * sin
	const nextZ = y * sin + z * cos
	y = nextY
	z = nextZ

	return {
		x: cx + x * radius,
		y: cy - y * radius,
		z,
	}
}

/**
 * Scroll position through the page, from 0 to 1.
 */
function readProgress () {
	const height = document.documentElement.scrollHeight
	const max = height - window.innerHeight
	if (max <= 0) return 0
	return Math.min(1, Math.max(0, window.scrollY / max))
}

/**
 * Strokes the front or the back of one graticule curve.
 */
function strokeSide (
	ctx: CanvasRenderingContext2D,
	points: Point[],
	front: boolean,
) {
	let drawing = false
	ctx.beginPath()
	points.forEach((point) => {
		const visible = point.z >= 0
		if (visible !== front) {
			drawing = false
			return
		}
		if (!drawing) {
			ctx.moveTo(point.x, point.y)
			drawing = true
			return
		}
		ctx.lineTo(point.x, point.y)
	})
	ctx.stroke()
}

/**
 * Centered globe. Scroll flips it and reveals the world inside.
 */
export function GlobeBackdrop () {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const context = canvas.getContext('2d')
		if (!context) return
		const canvasEl: HTMLCanvasElement = canvas
		const pen: CanvasRenderingContext2D = context

		const media = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		)
		let frame = 0
		let spin = 0.6
		let yaw = 0
		let pitch = 0
		let last = 0
		let scroll = 0
		let dragging = false
		let velocityYaw = 0
		let velocityPitch = 0
		let globeX = 0
		let globeY = 0
		let globeR = 0

		function resize () {
			const ratio = Math.min(window.devicePixelRatio || 1, 2)
			canvasEl.width = Math.floor(window.innerWidth * ratio)
			canvasEl.height = Math.floor(window.innerHeight * ratio)
			canvasEl.style.width = window.innerWidth + 'px'
			canvasEl.style.height = window.innerHeight + 'px'
			pen.setTransform(ratio, 0, 0, ratio, 0, 0)
		}

		function samples (build: (step: number) => Point) {
			const points: Point[] = []
			for (let step = 0; step <= 80; step += 1) {
				points.push(build(step / 80))
			}
			return points
		}

		function graticule (
			radius: number,
			turn: number,
			tilt: number,
			cx: number,
			cy: number,
			front: boolean,
		) {
			for (let index = 0; index < MERIDIANS; index += 1) {
				const lon = (index / MERIDIANS) * TURN
				strokeSide(
					pen,
					samples((amount) => project(
						-Math.PI / 2 + amount * Math.PI,
						lon,
						turn,
						tilt,
						cx,
						cy,
						radius,
					)),
					front,
				)
			}
			for (let index = 1; index < PARALLELS; index += 1) {
				const lat = -Math.PI / 2 + (index / PARALLELS) * Math.PI
				strokeSide(
					pen,
					samples((amount) => project(
						lat,
						amount * TURN,
						turn,
						tilt,
						cx,
						cy,
						radius,
					)),
					front,
				)
			}
		}

		function draw (now: number) {
			const width = window.innerWidth
			const height = window.innerHeight
			const elapsed = last ? Math.min(0.05, (now - last) / 1000) : 0
			last = now
			const target = media.matches ? 0 : readProgress()
			scroll += (target - scroll) * 0.08
			if (!media.matches && !dragging) {
				spin += elapsed * (TURN / 18)
				yaw += velocityYaw * elapsed
				pitch += velocityPitch * elapsed
				const decay = Math.exp(-elapsed * 1.8)
				velocityYaw *= decay
				velocityPitch *= decay
			}
			pen.clearRect(0, 0, width, height)
			const compact = width < 768
			const cx = width / 2
			const cy = compact ? height * 0.68 : height / 2
			const radius = Math.min(width, height) * (
				compact ? 0.22 : 0.32 + scroll * 0.04
			)
			const tilt = scroll * Math.PI + pitch
			const turn = spin + yaw
			globeX = cx
			globeY = cy
			globeR = radius

			const shell = pen.createRadialGradient(
				cx - radius * 0.32,
				cy - radius * 0.36,
				radius * 0.08,
				cx,
				cy,
				radius,
			)
			shell.addColorStop(0, 'rgba(22, 110, 138, 0.9)')
			shell.addColorStop(0.55, 'rgba(10, 52, 72, 0.88)')
			shell.addColorStop(1, 'rgba(6, 28, 42, 0.84)')
			pen.beginPath()
			pen.arc(cx, cy, radius, 0, TURN)
			pen.fillStyle = shell
			pen.fill()

			pen.lineWidth = 1.15
			pen.lineCap = 'round'
			pen.strokeStyle = 'rgba(32, 120, 148, 0.35)'
			graticule(radius, turn, tilt, cx, cy, false)
			pen.strokeStyle = 'rgba(142, 235, 248, 0.72)'
			graticule(radius, turn, tilt, cx, cy, true)

			if (scroll > 0.18) {
				const ringAlpha = Math.sin(Math.min(1, scroll) * Math.PI)
				pen.strokeStyle = 'rgba(255, 214, 170, ' + (ringAlpha * 0.75) + ')'
				pen.lineWidth = 1.6
				strokeSide(
					pen,
					samples((amount) => project(
						0,
						amount * TURN,
						turn * 0.4,
						tilt + 0.7,
						cx,
						cy,
						radius * 1.14,
					)),
					true,
				)
			}

			pen.beginPath()
			pen.arc(cx, cy, radius, 0, TURN)
			pen.lineWidth = 1.2
			pen.strokeStyle = 'rgba(142, 235, 248, 0.45)'
			pen.stroke()

			frame = window.requestAnimationFrame(draw)
		}

		function isControl (target: EventTarget | null) {
			if (!(target instanceof Element)) return false
			return Boolean(target.closest([
				'a',
				'button',
				'input',
				'textarea',
				'select',
				'label',
				'summary',
				'[role="button"]',
			].join(', ')))
		}

		function hitsGlobe (x: number, y: number) {
			const dx = x - globeX
			const dy = y - globeY
			return dx * dx + dy * dy <= globeR * globeR
		}

		function onDown (event: PointerEvent) {
			if (event.button !== 0) return
			if (!hitsGlobe(event.clientX, event.clientY)) return
			if (isControl(event.target)) return
			dragging = true
			velocityYaw = 0
			velocityPitch = 0
			document.documentElement.style.cursor = 'grabbing'
			if (event.target instanceof Element) {
				try {
					event.target.setPointerCapture(event.pointerId)
				} catch {
					// Some nodes cannot capture the pointer.
				}
			}
			event.preventDefault()
		}

		function onMove (event: PointerEvent) {
			if (!dragging) return
			const nextYaw = -event.movementX * 0.012
			const nextPitch = event.movementY * 0.012
			yaw += nextYaw
			pitch += nextPitch
			velocityYaw = nextYaw / 0.016
			velocityPitch = nextPitch / 0.016
		}

		function onUp () {
			if (!dragging) return
			dragging = false
			document.documentElement.style.cursor = ''
		}

		function onHover (event: PointerEvent) {
			if (dragging) return
			const canGrab = hitsGlobe(event.clientX, event.clientY)
				&& !isControl(event.target)
			document.documentElement.style.cursor = canGrab ? 'grab' : ''
		}

		resize()
		window.addEventListener('resize', resize)
		window.addEventListener('pointerdown', onDown, true)
		window.addEventListener('pointermove', onMove)
		window.addEventListener('pointermove', onHover)
		window.addEventListener('pointerup', onUp)
		window.addEventListener('pointercancel', onUp)
		frame = window.requestAnimationFrame(draw)

		return () => {
			window.cancelAnimationFrame(frame)
			document.documentElement.style.cursor = ''
			window.removeEventListener('resize', resize)
			window.removeEventListener('pointerdown', onDown, true)
			window.removeEventListener('pointermove', onMove)
			window.removeEventListener('pointermove', onHover)
			window.removeEventListener('pointerup', onUp)
			window.removeEventListener('pointercancel', onUp)
		}
	}, [])

	return (
		<div className="globe-stage">
			<canvas ref={canvasRef} aria-hidden="true" />
		</div>
	)
}
