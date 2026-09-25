'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
	createProject,
	deleteProject,
	updateProject,
} from '@/lib/admin/project-actions'
import {
	PROJECT_STATUSES,
	type ProjectRecord,
} from '@/lib/admin/income-project-types'
import { formatUsd } from '@/lib/bookings/revenue-math'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import { type ProjectStatus } from '@/lib/supabase/database'

interface ProjectFormState {
	projectName: string
	clientName: string
	serviceType: string
	description: string
	price: string
	status: ProjectStatus
	startDate: string
	deadline: string
	completedAt: string
}

interface AdminProjectPanelProps {
	records: ProjectRecord[]
}

function emptyForm (): ProjectFormState {
	return {
		projectName: '',
		clientName: '',
		serviceType: '',
		description: '',
		price: '',
		status: 'planned',
		startDate: '',
		deadline: '',
		completedAt: '',
	}
}

function formFromRecord (record: ProjectRecord): ProjectFormState {
	return {
		projectName: record.projectName,
		clientName: record.clientName,
		serviceType: record.serviceType,
		description: record.description ?? '',
		price: String(record.price),
		status: record.status,
		startDate: record.startDate ?? '',
		deadline: record.deadline ?? '',
		completedAt: record.completedAt
			? record.completedAt.slice(0, 16)
			: '',
	}
}

/**
 * CRUD panel for the project table.
 */
export function AdminProjectPanel ({
	records: initialRecords,
}: AdminProjectPanelProps) {
	const router = useRouter()
	const [records, setRecords] = useState(initialRecords)
	const [query, setQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [editingId, setEditingId] = useState<string | null>(null)
	const [isCreating, setIsCreating] = useState(false)
	const [form, setForm] = useState<ProjectFormState>(emptyForm)
	const [error, setError] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		setRecords(initialRecords)
	}, [initialRecords])

	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase()

		return records.filter((record) => {
			const matchesStatus = statusFilter === 'all'
				|| record.status === statusFilter
			const haystack = [
				record.projectName,
				record.clientName,
				record.serviceType,
				record.description ?? '',
			].join(' ').toLowerCase()
			const matchesQuery = normalized === ''
				|| haystack.includes(normalized)

			return matchesStatus && matchesQuery
		})
	}, [records, query, statusFilter])

	function openCreate () {
		setEditingId(null)
		setIsCreating(true)
		setForm(emptyForm())
		setError(null)
	}

	function openEdit (record: ProjectRecord) {
		setIsCreating(false)
		setEditingId(record.projectId)
		setForm(formFromRecord(record))
		setError(null)
	}

	function closeForm () {
		setIsCreating(false)
		setEditingId(null)
		setForm(emptyForm())
		setError(null)
	}

	function handleSave () {
		const price = Number(form.price)
		if (!Number.isFinite(price) || price < 0) {
			setError('Enter a valid price.')
			return
		}
		if (
			form.projectName.trim() === ''
			|| form.clientName.trim() === ''
			|| form.serviceType.trim() === ''
		) {
			setError('Name, client, and service type are required.')
			return
		}

		const payload = {
			projectName: form.projectName,
			clientName: form.clientName,
			serviceType: form.serviceType,
			description: form.description,
			price,
			status: form.status,
			startDate: form.startDate,
			deadline: form.deadline,
			completedAt: form.completedAt === ''
				? ''
				: new Date(form.completedAt).toISOString(),
		}

		setError(null)
		startTransition(async () => {
			const result = editingId
				? await updateProject({
					...payload,
					projectId: editingId,
				})
				: await createProject(payload)

			if (!result.ok) {
				setError(result.error ?? 'Could not save project.')
				return
			}

			closeForm()
			router.refresh()
		})
	}

	function handleDelete (projectId: string) {
		if (!window.confirm('Delete this project?')) return

		setError(null)
		startTransition(async () => {
			const result = await deleteProject(projectId)
			if (!result.ok) {
				setError(result.error ?? 'Could not delete project.')
				return
			}
			if (editingId === projectId) closeForm()
			router.refresh()
		})
	}

	const showForm = isCreating || editingId !== null
	const inProgress = records.filter((record) => {
		return record.status === 'in_progress'
	}).length
	const completed = records.filter((record) => {
		return record.status === 'completed'
	}).length

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-1 flex-col gap-3 sm:flex-row">
					<input
						type="search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search projects..."
						className="w-full rounded-xl border border-white/10 bg-[var(--admin-surface)] px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-violet-400/50 focus:outline-none sm:max-w-md"
					/>
					<select
						value={statusFilter}
						onChange={(event) => {
							setStatusFilter(event.target.value)
						}}
						className="rounded-xl border border-white/10 bg-[var(--admin-surface)] px-4 py-2.5 text-sm text-white focus:border-violet-400/50 focus:outline-none"
					>
						<option value="all">All statuses</option>
						{PROJECT_STATUSES.map((status) => (
							<option key={status} value={status}>
								{status.replace('_', ' ')}
							</option>
						))}
					</select>
				</div>
				<button
					type="button"
					onClick={openCreate}
					className="rounded-full bg-violet-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white"
				>
					Add project
				</button>
			</div>

			<p className="text-sm text-white/50">
				{records.length} projects · {inProgress} in progress ·{' '}
				{completed} completed
			</p>

			{error ? (
				<p role="alert" className="text-sm text-orange">
					{error}
				</p>
			) : null}

			{showForm ? (
				<div className="rounded-2xl border border-white/10 bg-[var(--admin-surface)] p-5">
					<h3 className="text-sm font-semibold text-white">
						{editingId ? 'Edit project' : 'New project'}
					</h3>
					<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						<label className="block text-xs text-white/45">
							Project name
							<input
								type="text"
								value={form.projectName}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										projectName: event.target.value,
									}))
								}}
								className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-inset)] px-3 py-2 text-sm text-white"
							/>
						</label>
						<label className="block text-xs text-white/45">
							Client name
							<input
								type="text"
								value={form.clientName}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										clientName: event.target.value,
									}))
								}}
								className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-inset)] px-3 py-2 text-sm text-white"
							/>
						</label>
						<label className="block text-xs text-white/45">
							Service type
							<input
								type="text"
								value={form.serviceType}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										serviceType: event.target.value,
									}))
								}}
								className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-inset)] px-3 py-2 text-sm text-white"
							/>
						</label>
						<label className="block text-xs text-white/45">
							Price
							<input
								type="number"
								min="0"
								step="0.01"
								value={form.price}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										price: event.target.value,
									}))
								}}
								className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-inset)] px-3 py-2 text-sm text-white"
							/>
						</label>
						<label className="block text-xs text-white/45">
							Status
							<select
								value={form.status}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										status: event.target
											.value as ProjectStatus,
									}))
								}}
								className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-inset)] px-3 py-2 text-sm text-white"
							>
								{PROJECT_STATUSES.map((status) => (
									<option key={status} value={status}>
										{status.replace('_', ' ')}
									</option>
								))}
							</select>
						</label>
						<label className="block text-xs text-white/45">
							Start date
							<input
								type="date"
								value={form.startDate}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										startDate: event.target.value,
									}))
								}}
								className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-inset)] px-3 py-2 text-sm text-white"
							/>
						</label>
						<label className="block text-xs text-white/45">
							Deadline
							<input
								type="date"
								value={form.deadline}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										deadline: event.target.value,
									}))
								}}
								className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-inset)] px-3 py-2 text-sm text-white"
							/>
						</label>
						<label className="block text-xs text-white/45">
							Completed at
							<input
								type="datetime-local"
								value={form.completedAt}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										completedAt: event.target.value,
									}))
								}}
								className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-inset)] px-3 py-2 text-sm text-white"
							/>
						</label>
						<label className="block text-xs text-white/45 sm:col-span-2 lg:col-span-3">
							Description
							<textarea
								rows={4}
								value={form.description}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										description: event.target.value,
									}))
								}}
								className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-inset)] px-3 py-2 text-sm text-white"
							/>
						</label>
					</div>
					<div className="mt-4 flex flex-wrap gap-2">
						<button
							type="button"
							disabled={isPending}
							onClick={handleSave}
							className="rounded-full bg-violet-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-50"
						>
							{isPending ? 'Saving...' : 'Save'}
						</button>
						<button
							type="button"
							onClick={closeForm}
							className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/70"
						>
							Cancel
						</button>
					</div>
				</div>
			) : null}

			{filtered.length === 0 ? (
				<AdminEmptyState
					title="No projects yet"
					description="Create a project to track delivery and deadlines."
				/>
			) : (
				<div className="overflow-x-auto rounded-2xl border border-white/10 bg-[var(--admin-surface)]">
					<table className="min-w-full text-start">
						<thead>
							<tr className="border-b border-white/10 text-sm text-white/60">
								<th className="px-4 py-3 font-medium">Project</th>
								<th className="px-4 py-3 font-medium">Client</th>
								<th className="px-4 py-3 font-medium">Service</th>
								<th className="px-4 py-3 font-medium">Price</th>
								<th className="px-4 py-3 font-medium">Status</th>
								<th className="px-4 py-3 font-medium">Deadline</th>
								<th className="px-4 py-3 font-medium">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((record) => (
								<tr
									key={record.projectId}
									className="border-b border-white/10 last:border-b-0"
								>
									<td className="px-4 py-3 align-top">
										<p className="text-sm font-medium text-white">
											{record.projectName}
										</p>
										{record.description ? (
											<p className="mt-1 line-clamp-2 text-xs text-white/50">
												{record.description}
											</p>
										) : null}
									</td>
									<td className="px-4 py-3 align-top text-sm text-white/75">
										{record.clientName}
									</td>
									<td className="px-4 py-3 align-top text-sm text-white/75">
										{record.serviceType}
									</td>
									<td className="px-4 py-3 align-top text-sm text-white">
										{formatUsd(record.price)}
									</td>
									<td className="px-4 py-3 align-top">
										<span className="inline-flex rounded-full bg-violet-500/15 px-3 py-1 text-xs capitalize text-violet-600 dark:text-violet-200">
											{record.status.replace('_', ' ')}
										</span>
									</td>
									<td className="px-4 py-3 align-top text-sm text-white/70">
										{record.deadline ?? '—'}
									</td>
									<td className="px-4 py-3 align-top">
										<div className="flex flex-wrap gap-2">
											<button
												type="button"
												onClick={() => openEdit(record)}
												className="text-xs font-medium text-violet-600 dark:text-violet-300 hover:underline"
											>
												Edit
											</button>
											<button
												type="button"
												disabled={isPending}
												onClick={() => {
													handleDelete(record.projectId)
												}}
												className="text-xs font-medium text-orange hover:underline disabled:opacity-50"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}
