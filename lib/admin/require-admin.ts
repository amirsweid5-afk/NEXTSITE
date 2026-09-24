import 'server-only'

import { redirect } from 'next/navigation'
import {
	getCurrentProfile,
	type CurrentProfile,
} from '@/lib/auth/get-current-profile'

/**
 * Ensures the current user is an authenticated admin.
 */
export async function requireAdmin (): Promise<CurrentProfile> {
	const profile = await getCurrentProfile()

	if (!profile) {
		redirect('/login')
	}

	if (!profile.isAdmin) {
		redirect('/')
	}

	return profile
}
