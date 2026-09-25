import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { type ProjectRecord } from '@/lib/admin/income-project-types'

/**
 * Loads all project rows for the admin portal.
 */
export async function getProjectRecords (): Promise<ProjectRecord[]> {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('project')
		.select('*')
		.order('created_at', { ascending: false })

	if (error || !data) {
		return []
	}

	return data.map((row) => ({
		projectId: row.project_id,
		projectName: row.project_name,
		clientName: row.client_name,
		serviceType: row.service_type,
		description: row.description,
		price: Number(row.price),
		status: row.status,
		startDate: row.start_date,
		deadline: row.deadline,
		completedAt: row.completed_at,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	}))
}
