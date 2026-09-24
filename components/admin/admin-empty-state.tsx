interface AdminEmptyStateProps {
	title: string
	description: string
}

/**
 * Empty state panel for admin lists.
 */
export function AdminEmptyState ({
	title,
	description,
}: AdminEmptyStateProps) {
	return (
		<div className="rounded-2xl border border-dashed border-white/15 bg-[var(--admin-surface)] px-6 py-16 text-center">
			<p className="text-base font-medium text-white">{title}</p>
			<p className="mt-2 text-sm text-white/50">{description}</p>
		</div>
	)
}
