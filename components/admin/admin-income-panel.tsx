'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
	createIncome,
	deleteIncome,
	updateIncome,
} from '@/lib/admin/income-actions'
import {
	INCOME_PAYMENT_METHODS,
	INCOME_STATUSES,
	type IncomeRecord,
} from '@/lib/admin/income-project-types'
import { formatUsd } from '@/lib/bookings/revenue-math'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import {
	type IncomePaymentMethod,
	type IncomeStatus,
} from '@/lib/supabase/database'

interface IncomeFormState {
	amount: string
	paymentDate: string
	paymentMethod: IncomePaymentMethod
	paymentCurrency: string
	status: IncomeStatus
	notes: string
}

interface AdminIncomePanelProps {
	records: IncomeRecord[]
}

function todayDateInput (): string {
	return new Date().toISOString().slice(0, 10)
}

function emptyForm (): IncomeFormState {
	return {
		amount: '',
		paymentDate: todayDateInput(),
		paymentMethod: 'cash',
		paymentCurrency: 'USD',
		status: 'completed',
		notes: '',
	}
}

function formFromRecord (record: IncomeRecord): IncomeFormState {
	return {
		amount: String(record.amount),
		paymentDate: record.paymentDate,
		paymentMethod: record.paymentMethod,
		paymentCurrency: record.paymentCurrency,
		status: record.status,
		notes: record.notes ?? '',
	}
}

/**
 * CRUD panel for the income table.
 */
export function AdminIncomePanel ({
	records: initialRecords,
}: AdminIncomePanelProps) {
	const router = useRouter()
	const [records, setRecords] = useState(initialRecords)
	const [query, setQuery] = useState('')
	const [editingId, setEditingId] = useState<string | null>(null)
	const [isCreating, setIsCreating] = useState(false)
	const [form, setForm] = useState<IncomeFormState>(emptyForm)
	const [error, setError] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		setRecords(initialRecords)
	}, [initialRecords])

	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase()
		if (normalized === '') return records

		return records.filter((record) => {
			return [
				record.paymentMethod,
				record.paymentCurrency,
				record.status,
				record.notes ?? '',
				String(record.amount),
			].join(' ').toLowerCase().includes(normalized)
		})
	}, [records, query])

	const totals = useMemo(() => {
		const completed = records.filter((record) => {
			return record.status === 'completed'
		})
		const total = completed.reduce((sum, record) => {
			return sum + record.amount
		}, 0)
		return { count: records.length, total }
	}, [records])

	function openCreate () {
		setEditingId(null)
		setIsCreating(true)
		setForm(emptyForm())
		setError(null)
	}

	function openEdit (record: IncomeRecord) {
		setIsCreating(false)
		setEditingId(record.incomeId)
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
		const amount = Number(form.amount)
		if (!Number.isFinite(amount) || amount <= 0) {
			setError('Enter a valid amount.')
			return
		}

		const payload = {
			amount,
			paymentDate: form.paymentDate,
			paymentMethod: form.paymentMethod,
			paymentCurrency: form.paymentCurrency,
			status: form.status,
			notes: form.notes,
		}

		setError(null)
		startTransition(async () => {
			const result = editingId
				? await updateIncome({ ...payload, incomeId: editingId })
				: await createIncome(payload)

			if (!result.ok) {
				setError(result.error ?? 'Could not save income.')
				return
			}

			closeForm()
			router.refresh()
		})
	}

	function handleDelete (incomeId: string) {
		if (!window.confirm('Delete this income record?')) return

		setError(null)
		startTransition(async () => {
			const result = await deleteIncome(incomeId)
			if (!result.ok) {
				setError(result.error ?? 'Could not delete income.')
				return
			}
			if (editingId === incomeId) closeForm()
			router.refresh()
		})
	}

	const showForm = isCreating || editingId !== null

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<input
					type="search"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Search income..."
					className="w-full rounded-xl border border-white/10 bg-[var(--admin-surface)] px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-violet-400/50 focus:outline-none sm:max-w-md"
				/>
				<button
					type="button"
					onClick={openCreate}
					className="rounded-full bg-violet-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white"
				>
					Add income
				</button>
			</div>

			<p className="text-sm text-white/50">
				{totals.count} records · Completed total{' '}
				<span className="font-semibold text-violet-600 dark:text-violet-200">
					{formatUsd(totals.total)}
				</span>
			</p>

			{error ? (
				<p role="alert" className="text-sm text-orange">
					{error}
				</p>
			) : null}

			{showForm ? (
				<div className="rounded-2xl border border-white/10 bg-[var(--admin-surface)] p-5">
					<h3 className="text-sm font-semibold text-white">
						{editingId ? 'Edit income' : 'New income'}
					</h3>
					<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						<label className="block text-xs text-white/45">
							Amount
							<input
								type="number"
								min="0.01"
								step="0.01"
								value={form.amount}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										amount: event.target.value,
									}))
								}}
								className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-inset)] px-3 py-2 text-sm text-white"
							/>
						</label>
						<label className="block text-xs text-white/45">
							Payment date
							<input
								type="date"
								value={form.paymentDate}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										paymentDate: event.target.value,
									}))
								}}
								className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-inset)] px-3 py-2 text-sm text-white"
							/>
						</label>
						<label className="block text-xs text-white/45">
							Currency
							<input
								type="text"
								maxLength={3}
								value={form.paymentCurrency}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										paymentCurrency: event.target.value
											.toUpperCase(),
									}))
								}}
								className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-inset)] px-3 py-2 text-sm text-white uppercase"
							/>
						</label>
						<label className="block text-xs text-white/45">
							Payment method
							<select
								value={form.paymentMethod}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										paymentMethod: event.target
											.value as IncomePaymentMethod,
									}))
								}}
								className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-inset)] px-3 py-2 text-sm text-white"
							>
								{INCOME_PAYMENT_METHODS.map((method) => (
									<option key={method} value={method}>
										{method.replace('_', ' ')}
									</option>
								))}
							</select>
						</label>
						<label className="block text-xs text-white/45">
							Status
							<select
								value={form.status}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										status: event.target.value as IncomeStatus,
									}))
								}}
								className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--admin-inset)] px-3 py-2 text-sm text-white"
							>
								{INCOME_STATUSES.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</label>
						<label className="block text-xs text-white/45 sm:col-span-2 lg:col-span-3">
							Notes
							<textarea
								rows={3}
								value={form.notes}
								onChange={(event) => {
									setForm((current) => ({
										...current,
										notes: event.target.value,
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
					title="No income records"
					description="Add your first income entry to start tracking revenue."
				/>
			) : (
				<div className="overflow-x-auto rounded-2xl border border-white/10 bg-[var(--admin-surface)]">
					<table className="min-w-full text-start">
						<thead>
							<tr className="border-b border-white/10 text-sm text-white/60">
								<th className="px-4 py-3 font-medium">Amount</th>
								<th className="px-4 py-3 font-medium">Date</th>
								<th className="px-4 py-3 font-medium">Method</th>
								<th className="px-4 py-3 font-medium">Currency</th>
								<th className="px-4 py-3 font-medium">Status</th>
								<th className="px-4 py-3 font-medium">Notes</th>
								<th className="px-4 py-3 font-medium">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((record) => (
								<tr
									key={record.incomeId}
									className="border-b border-white/10 last:border-b-0"
								>
									<td className="px-4 py-3 text-sm font-medium text-white">
										{formatUsd(record.amount)}
									</td>
									<td className="px-4 py-3 text-sm text-white/75">
										{record.paymentDate}
									</td>
									<td className="px-4 py-3 text-sm capitalize text-white/75">
										{record.paymentMethod.replace('_', ' ')}
									</td>
									<td className="px-4 py-3 text-sm text-white/75">
										{record.paymentCurrency}
									</td>
									<td className="px-4 py-3">
										<span className="inline-flex rounded-full bg-violet-500/15 px-3 py-1 text-xs capitalize text-violet-600 dark:text-violet-200">
											{record.status}
										</span>
									</td>
									<td className="px-4 py-3 text-sm text-white/60">
										{record.notes ?? '—'}
									</td>
									<td className="px-4 py-3">
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
													handleDelete(record.incomeId)
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
