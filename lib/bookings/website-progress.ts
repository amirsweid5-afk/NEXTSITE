export type WebsiteProgress =
	| 'not_started'
	| 'pending'
	| 'finished'

export const WEBSITE_PROGRESS_OPTIONS: {
	value: WebsiteProgress
	label: string
}[] = [
	{ value: 'not_started', label: "Didn't start" },
	{ value: 'pending', label: 'Pending' },
	{ value: 'finished', label: 'Finished' },
]

/**
 * Human label for a website progress value.
 */
export function websiteProgressLabel (
	value: WebsiteProgress | string | null | undefined,
) {
	const match = WEBSITE_PROGRESS_OPTIONS.find((item) => {
		return item.value === value
	})
	return match?.label ?? "Didn't start"
}

/**
 * Accent tone for progress chips.
 */
export function websiteProgressTone (
	value: WebsiteProgress | string | null | undefined,
): 'muted' | 'orange' | 'green' {
	if (value === 'finished') return 'green'
	if (value === 'pending') return 'orange'
	return 'muted'
}
