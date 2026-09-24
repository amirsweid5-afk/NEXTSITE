import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
	getSupabasePublicKey,
	getSupabaseUrl,
} from '@/lib/supabase/env'

/**
 * Refreshes the Supabase auth session cookies for a request.
 */
export async function updateSession (
	request: NextRequest,
	requestHeaders?: Headers,
) {
	const headersForRequest = requestHeaders ?? request.headers

	let supabaseResponse = NextResponse.next({
		request: {
			headers: headersForRequest,
		},
	})

	const supabase = createServerClient(
		getSupabaseUrl(),
		getSupabasePublicKey(),
		{
			cookies: {
				getAll () {
					return request.cookies.getAll()
				},
				setAll (cookiesToSet, headers) {
					cookiesToSet.forEach(({ name, value }) => {
						request.cookies.set(name, value)
					})
					supabaseResponse = NextResponse.next({
						request: {
							headers: headersForRequest,
						},
					})
					cookiesToSet.forEach(({ name, value, options }) => {
						supabaseResponse.cookies.set(name, value, options)
					})
					Object.entries(headers).forEach(([key, value]) => {
						supabaseResponse.headers.set(key, value)
					})
				},
			},
		},
	)

	await supabase.auth.getClaims()

	return supabaseResponse
}
