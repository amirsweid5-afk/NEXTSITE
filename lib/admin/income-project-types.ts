import {
	type IncomePaymentMethod,
	type IncomeStatus,
	type ProjectStatus,
} from '@/lib/supabase/database'

export interface IncomeRecord {
	incomeId: string
	amount: number
	paymentDate: string
	paymentMethod: IncomePaymentMethod
	paymentCurrency: string
	status: IncomeStatus
	notes: string | null
	createdAt: string
	updatedAt: string
}

export interface ProjectRecord {
	projectId: string
	projectName: string
	clientName: string
	serviceType: string
	description: string | null
	price: number
	status: ProjectStatus
	startDate: string | null
	deadline: string | null
	completedAt: string | null
	createdAt: string
	updatedAt: string
}

export const INCOME_PAYMENT_METHODS: IncomePaymentMethod[] = [
	'cash',
	'card',
	'bank_transfer',
	'paypal',
	'other',
]

export const INCOME_STATUSES: IncomeStatus[] = [
	'pending',
	'completed',
	'failed',
	'refunded',
]

export const PROJECT_STATUSES: ProjectStatus[] = [
	'planned',
	'in_progress',
	'on_hold',
	'completed',
	'cancelled',
]
