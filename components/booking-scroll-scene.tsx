'use client'

import dynamic from 'next/dynamic'
import { ScrollStage } from '@/components/scroll-stage'

const BookingCanvas = dynamic(
	() => import('@/components/booking-canvas').then(
		(module) => module.BookingCanvas,
	),
	{ ssr: false },
)

/**
 * Booking page scroll scene.
 */
export function BookingScrollScene () {
	return (
		<ScrollStage
			CanvasView={BookingCanvas}
			desktopCount={96}
			mobileCount={48}
		/>
	)
}
