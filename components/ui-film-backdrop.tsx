'use client'

import { useEffect, useRef } from 'react'

/**
 * Full-site background. The film plays itself and never follows scroll.
 */
export function UiFilmBackdrop () {
	const frameRef = useRef<HTMLIFrameElement>(null)

	useEffect(() => {
		const frame = frameRef.current
		if (!frame) return

		function fit () {
			const scale = Math.max(
				window.innerWidth / 1920,
				window.innerHeight / 1080,
			)
			frame.style.transform =
				'translate(-50%, -50%) scale(' + scale + ')'
		}

		fit()
		window.addEventListener('resize', fit)
		return () => window.removeEventListener('resize', fit)
	}, [])

	return (
		<div className="ui-film" aria-hidden="true">
			<iframe
				ref={frameRef}
				src="/ui-film.html?v=normal"
				tabIndex={-1}
				title=""
			/>
			<div className="ui-film-veil" />
		</div>
	)
}
