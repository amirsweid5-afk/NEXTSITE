interface AdminStatCardProps {
	label: string
	value: string
	hint?: string
	accent?: 'violet' | 'orange' | 'green' | 'muted'
}

/**
 * Rounded statistic card for the admin portal.
 */
export function AdminStatCard ({
	label,
	value,
	hint,
	accent = 'violet',
}: AdminStatCardProps) {
	const valueClass = accent === 'orange'
		? 'text-orange'
		: accent === 'green'
			? 'text-emerald-300'
			: accent === 'muted'
				? 'text-white/70'
				: 'text-violet-600 dark:text-violet-200'

	return (
		<article className="rounded-2xl border border-white/10 bg-[var(--admin-surface)] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
			<p className="text-sm text-white/50">{label}</p>
			<p className={`mt-3 text-3xl font-semibold tracking-tight ${valueClass}`}>
				{value}
			</p>
			{hint ? (
				<p className="mt-2 text-xs text-white/40">{hint}</p>
			) : null}
		</article>
	)
}
