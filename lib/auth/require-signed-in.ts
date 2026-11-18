import 'server-only'

import { redirect } from 'next/navigation'
import {
	getCurrentProfile,
	type CurrentProfile,
} from '@/lib/auth/get-current-profile'

/**
 * Ensures the visitor is signed in before opening the dashboard.
 */
export async function requireSignedIn (
	nextPath = '/dashboard',
): Promise<CurrentProfile> {
	const profile = await getCurrentProfile()
	if (!profile) {
		redirect('/login?next=' + encodeURIComponent(nextPath))
	}
	return profile
}
