export default function AdminLoading () {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="h-8 w-48 rounded-lg bg-white/10" />
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{Array.from({ length: 4 }).map((_, index) => (
					<div
						key={index}
						className="h-28 rounded-2xl bg-white/5"
					/>
				))}
			</div>
			<div className="h-72 rounded-2xl bg-white/5" />
		</div>
	)
}
