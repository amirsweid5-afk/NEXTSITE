'use client'

import { BookingWorld } from '@/components/booking-world'
import { ScrollCanvas } from '@/components/scroll-canvas'

interface BookingCanvasProps {
	shardCount: number
	dpr: number
}

/**
 * Booking page scene: a seal pressing an invitation into place.
 */
export function BookingCanvas ({
	shardCount,
	dpr,
}: BookingCanvasProps) {
	return (
		<ScrollCanvas
			triggerId="#booking-journey"
			shardCount={shardCount}
			dpr={dpr}
			World={BookingWorld}
		/>
	)
}
