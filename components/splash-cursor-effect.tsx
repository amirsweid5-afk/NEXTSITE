'use client'

import { useEffect, useState } from 'react'
import SplashCursor from '@/components/SplashCursor'

const THEME_COLOR_VARIABLE = '--orange'
const FALLBACK_THEME_COLOR = '#e87812'

/**
 * Converts a CSS color value into a 6-digit hex string.
 */
function parseCssColor (value: string): string | null {
	const trimmed = value.trim().toLowerCase()

	if (/^#[0-9a-f]{6}$/.test(trimmed)) {
		return trimmed
	}

	if (/^#[0-9a-f]{3}$/.test(trimmed)) {
		const digits = trimmed.slice(1)
		return `#${digits[0]}${digits[0]}${digits[1]}${digits[1]}${digits[2]}${digits[2]}`
	}

	const rgbMatch = trimmed.match(
		/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/,
	)
	if (!rgbMatch) {
		return null
	}

	const hex = rgbMatch.slice(1, 4).map((channel) => {
		return Number(channel).toString(16).padStart(2, '0')
	})

	return `#${hex.join('')}`
}

/**
 * Reads the global orange token from the document theme.
 */
function readThemeColor (): string {
	const raw = getComputedStyle(document.documentElement)
		.getPropertyValue(THEME_COLOR_VARIABLE)

	return parseCssColor(raw) ?? FALLBACK_THEME_COLOR
}

/**
 * Site-wide fluid cursor trail tinted with the global theme color.
 */
export function SplashCursorEffect () {
	const [color, setColor] = useState(FALLBACK_THEME_COLOR)

	useEffect(() => {
		function handleThemeChange () {
			setColor(readThemeColor())
		}

		handleThemeChange()

		const observer = new MutationObserver(handleThemeChange)
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme', 'class', 'style'],
		})

		return () => {
			observer.disconnect()
		}
	}, [])

	return (
		<SplashCursor
			key={color}
			DENSITY_DISSIPATION={3.5}
			VELOCITY_DISSIPATION={2}
			PRESSURE={0.1}
			CURL={3}
			SPLAT_RADIUS={0.2}
			SPLAT_FORCE={6000}
			COLOR_UPDATE_SPEED={10}
			SHADING
			RAINBOW_MODE={false}
			COLOR={color}
		/>
	)
}
