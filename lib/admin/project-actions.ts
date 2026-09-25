'use server'

import { z } from 'zod'
import { getCurrentProfile } from '@/lib/auth/get-current-profile'
import { createClient } from '@/lib/supabase/server'

export interface AdminMutationResult {
	ok: boolean
	error?: string
}

const projectSchema = z.object({
	projectName: z.string().trim().min(1).max(200),
	clientName: z.string().trim().min(1).max(200),
	serviceType: z.string().trim().min(1).max(200),
	description: z.string().trim().max(4000).optional(),
	price: z.number().finite().min(0).max(10_000_000),
	status: z.enum([
		'planned',
		'in_progress',
		'on_hold',
		'completed',
		'cancelled',
	]),
	startDate: z.string().trim().optional(),
	deadline: z.string().trim().optional(),
	completedAt: z.string().trim().optional(),
})

const updateProjectSchema = projectSchema.extend({
	projectId: z.uuid(),
})

async function requireAdminProfile () {
	const profile = await getCurrentProfile()
	if (!profile?.isAdmin) {
		return null
	}
	return profile
}

function emptyToNull (value: string | undefined): string | null {
	if (value === undefined || value.trim() === '') {
		return null
	}
	return value
}

/**
 * Creates a project record. Admin only.
 */
export async function createProject (
	input: unknown,
): Promise<AdminMutationResult> {
	const parsed = projectSchema.safeParse(input)
	if (!parsed.success) {
		return { ok: false, error: 'Please check the project form.' }
	}

	if (!(await requireAdminProfile())) {
		return { ok: false, error: 'Only admins can create projects.' }
	}

	const supabase = await createClient()
	const { error } = await supabase.from('project').insert({
		project_name: parsed.data.projectName,
		client_name: parsed.data.clientName,
		service_type: parsed.data.serviceType,
		description: emptyToNull(parsed.data.description),
		price: parsed.data.price,
		status: parsed.data.status,
		start_date: emptyToNull(parsed.data.startDate),
		deadline: emptyToNull(parsed.data.deadline),
		completed_at: emptyToNull(parsed.data.completedAt),
	})

	if (error) {
		return { ok: false, error: error.message }
	}

	return { ok: true }
}

/**
 * Updates a project record. Admin only.
 */
export async function updateProject (
	input: unknown,
): Promise<AdminMutationResult> {
	const parsed = updateProjectSchema.safeParse(input)
	if (!parsed.success) {
		return { ok: false, error: 'Please check the project form.' }
	}

	if (!(await requireAdminProfile())) {
		return { ok: false, error: 'Only admins can update projects.' }
	}

	const supabase = await createClient()
	const { error } = await supabase
		.from('project')
		.update({
			project_name: parsed.data.projectName,
			client_name: parsed.data.clientName,
			service_type: parsed.data.serviceType,
			description: emptyToNull(parsed.data.description),
			price: parsed.data.price,
			status: parsed.data.status,
			start_date: emptyToNull(parsed.data.startDate),
			deadline: emptyToNull(parsed.data.deadline),
			completed_at: emptyToNull(parsed.data.completedAt),
		})
		.eq('project_id', parsed.data.projectId)

	if (error) {
		return { ok: false, error: error.message }
	}

	return { ok: true }
}

/**
 * Deletes a project record. Admin only.
 */
export async function deleteProject (
	projectId: string,
): Promise<AdminMutationResult> {
	if (typeof projectId !== 'string' || projectId.trim() === '') {
		return { ok: false, error: 'Invalid project id.' }
	}

	if (!(await requireAdminProfile())) {
		return { ok: false, error: 'Only admins can delete projects.' }
	}

	const supabase = await createClient()
	const { error } = await supabase
		.from('project')
		.delete()
		.eq('project_id', projectId)

	if (error) {
		return { ok: false, error: error.message }
	}

	return { ok: true }
}
