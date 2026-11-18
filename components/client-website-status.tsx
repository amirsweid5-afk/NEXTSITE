'use client'

import { useContent } from '@/components/language-provider'
import { type WebsiteProgress } from '@/lib/bookings/website-progress'

interface ClientWebsiteStatusProps {
	status: string
	websiteProgress: WebsiteProgress | string | null | undefined
	progressSetByAdmin?: boolean
	progressUpdatedAt?: string | null
	statusUpdatedAt?: string | null
}

/**
 * Shows only the status an admin actually set for this website.
 */
export function ClientWebsiteStatus ({
	status,
	websiteProgress,
	progressSetByAdmin = false,
	progressUpdatedAt = null,
	statusUpdatedAt = null,
}: ClientWebsiteStatusProps) {
	const copy = useContent().booking.form
	const text = clientStatusSentence({
		status,
		websiteProgress,
		progressSetByAdmin,
		progressUpdatedAt,
		statusUpdatedAt,
		copy,
	})

	return (
		<p className="mt-2 text-sm font-semibold text-white">
			{text}
		</p>
	)
}

function clientStatusSentence (input: {
	status: string
	websiteProgress: WebsiteProgress | string | null | undefined
	progressSetByAdmin: boolean
	progressUpdatedAt: string | null
	statusUpdatedAt: string | null
	copy: {
		websiteIsPending: string
		websiteIsConfirmed: string
		websiteIsCancelled: string
		websiteIsCompleted: string
		progressNotStarted: string
		progressPending: string
		progressFinished: string
	}
}) {
	const statusChosen = input.statusUpdatedAt !== null
		|| input.status === 'completed'
		|| input.status === 'confirmed'
		|| input.status === 'cancelled'
	const progressTime = input.progressUpdatedAt
		? Date.parse(input.progressUpdatedAt)
		: 0
	const statusTime = input.statusUpdatedAt
		? Date.parse(input.statusUpdatedAt)
		: 0
	const showProgress = input.progressSetByAdmin
		&& (!statusChosen || progressTime >= statusTime)

	if (showProgress) {
		if (input.websiteProgress === 'finished') {
			return input.copy.progressFinished
		}
		if (input.websiteProgress === 'pending') {
			return input.copy.progressPending
		}
		return input.copy.progressNotStarted
	}

	if (input.status === 'completed') return input.copy.websiteIsCompleted
	if (input.status === 'confirmed') return input.copy.websiteIsConfirmed
	if (input.status === 'cancelled') return input.copy.websiteIsCancelled
	return input.copy.websiteIsPending
}
