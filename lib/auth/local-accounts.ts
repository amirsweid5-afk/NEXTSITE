import 'server-only'

import {
	randomBytes,
	scrypt,
	timingSafeEqual,
} from 'crypto'
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { promisify } from 'util'
import { cookies } from 'next/headers'

const scryptAsync = promisify(scrypt)
const filePath = path.join(process.cwd(), 'data', 'accounts.json')
const SESSION_COOKIE = 'ns_session'
const SESSION_MS = 1000 * 60 * 60 * 24 * 30

interface LocalAccount {
	id: string
	email: string
	name: string
	salt: string
	passwordHash: string
	phone?: string
	avatar?: string
	role?: 'customer' | 'admin'
}

interface LocalSession {
	token: string
	userId: string
	expiresAt: string
}

interface AccountFile {
	accounts: LocalAccount[]
	sessions: LocalSession[]
}

export interface LocalProfile {
	userId: string
	email: string
	name: string
	phone: string
	avatar: string | null
	role: 'customer' | 'admin'
}

export type LocalAccountError =
	| 'name'
	| 'password-current'
	| 'signed-out'
	| 'save'

let queue: Promise<unknown> = Promise.resolve()

function enqueue<T> (job: () => Promise<T>): Promise<T> {
	const run = queue.then(job, job)
	queue = run.then(() => undefined, () => undefined)
	return run
}

async function readAccounts (): Promise<AccountFile> {
	try {
		const raw = await readFile(filePath, 'utf8')
		const parsed = JSON.parse(raw) as AccountFile
		return {
			accounts: Array.isArray(parsed.accounts) ? parsed.accounts : [],
			sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
		}
	} catch {
		return { accounts: [], sessions: [] }
	}
}

async function writeAccounts (file: AccountFile) {
	await mkdir(path.dirname(filePath), { recursive: true })
	await writeFile(filePath, JSON.stringify(file, null, '\t'))
}

async function hashPassword (password: string, salt: string) {
	const derived = await scryptAsync(password, salt, 32) as Buffer
	return derived.toString('hex')
}

function toProfile (account: LocalAccount): LocalProfile {
	const avatar = account.avatar
	const hasPhoto = typeof avatar === 'string'
		&& avatar.startsWith('data:image/jpeg;base64,')
		&& avatar.length <= 80_000

	return {
		userId: account.id,
		email: account.email,
		name: account.name,
		phone: account.phone ?? '',
		avatar: hasPhoto ? avatar : null,
		role: account.role === 'admin' ? 'admin' : 'customer',
	}
}

async function isCurrentPassword (
	account: LocalAccount,
	password: string,
) {
	const actual = Buffer.from(
		await hashPassword(password, account.salt),
		'hex',
	)
	const expected = Buffer.from(account.passwordHash, 'hex')
	if (actual.length !== expected.length) return false
	return timingSafeEqual(actual, expected)
}

/**
 * Creates a local account when the auth server cannot be reached.
 */
export async function createLocalAccount (input: {
	email: string
	name: string
	password: string
}): Promise<{ ok: true, profile: LocalProfile } | { ok: false, error: string }> {
	const email = input.email.trim().toLowerCase()
	const name = input.name.trim()

	return enqueue(async () => {
		const file = await readAccounts()
		const taken = file.accounts.some((account) => account.email === email)
		if (taken) {
			return {
				ok: false as const,
				error: 'An account with this email already exists. Log in instead.',
			}
		}

		const salt = randomBytes(16).toString('hex')
		const account: LocalAccount = {
			id: crypto.randomUUID(),
			email,
			name,
			salt,
			passwordHash: await hashPassword(input.password, salt),
		}
		file.accounts.push(account)
		await writeAccounts(file)
		return {
			ok: true as const,
			profile: toProfile(account),
		}
	})
}

/**
 * Checks an email and password against local accounts.
 */
export async function verifyLocalAccount (
	email: string,
	password: string,
): Promise<LocalProfile | null> {
	const normalized = email.trim().toLowerCase()
	const file = await readAccounts()
	const account = file.accounts.find((item) => item.email === normalized)
	if (!account) return null

	const matches = await isCurrentPassword(account, password)
	if (!matches) return null
	return toProfile(account)
}

/**
 * Starts a signed-in session for a local account.
 */
export async function startLocalSession (userId: string) {
	const token = randomBytes(32).toString('hex')
	const expiresAt = new Date(Date.now() + SESSION_MS).toISOString()

	await enqueue(async () => {
		const file = await readAccounts()
		file.sessions = file.sessions.filter((session) => {
			return session.expiresAt > new Date().toISOString()
		})
		file.sessions.push({ token, userId, expiresAt })
		await writeAccounts(file)
	})

	const cookieStore = await cookies()
	cookieStore.set(SESSION_COOKIE, token, {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: SESSION_MS / 1000,
	})
}

/**
 * Ends the local session so another account can sign in.
 */
export async function endLocalSession () {
	const cookieStore = await cookies()
	const token = cookieStore.get(SESSION_COOKIE)?.value
	cookieStore.set(SESSION_COOKIE, '', {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: 0,
	})

	if (!token) return

	await enqueue(async () => {
		const file = await readAccounts()
		file.sessions = file.sessions.filter((session) => {
			return session.token !== token
		})
		await writeAccounts(file)
	})
}

/**
 * Reads the signed-in local account from the session cookie.
 */
export async function readLocalSession (): Promise<LocalProfile | null> {
	const cookieStore = await cookies()
	const token = cookieStore.get(SESSION_COOKIE)?.value
	if (!token) return null

	const file = await readAccounts()
	const now = new Date().toISOString()
	const session = file.sessions.find((item) => {
		return item.token === token && item.expiresAt > now
	})
	if (!session) return null

	const account = file.accounts.find((item) => item.id === session.userId)
	if (!account) return null

	return toProfile(account)
}

/**
 * Updates the signed-in local account name, phone, or password.
 */
export async function updateLocalProfile (input: {
	userId: string
	name: string
	phone: string
	currentPassword: string
	newPassword: string
}): Promise<{ ok: true } | { ok: false, error: LocalAccountError }> {
	const name = input.name.trim()
	const phone = input.phone.trim()
	if (name === '') return { ok: false, error: 'name' }

	return enqueue(async () => {
		const file = await readAccounts()
		const account = file.accounts.find((item) => {
			return item.id === input.userId
		})
		if (!account) return { ok: false as const, error: 'signed-out' as const }

		if (input.newPassword !== '') {
			if (input.currentPassword !== '') {
				const matches = await isCurrentPassword(
					account,
					input.currentPassword,
				)
				if (!matches) {
					return {
						ok: false as const,
						error: 'password-current' as const,
					}
				}
			}
			account.salt = randomBytes(16).toString('hex')
			account.passwordHash = await hashPassword(
				input.newPassword,
				account.salt,
			)
		}

		account.name = name
		account.phone = phone
		await writeAccounts(file)
		return { ok: true as const }
	})
}

/**
 * Saves or clears the local account profile photo.
 */
export async function updateLocalAvatar (input: {
	userId: string
	avatar: string | null
}): Promise<{ ok: true } | { ok: false, error: LocalAccountError }> {
	return enqueue(async () => {
		const file = await readAccounts()
		const account = file.accounts.find((item) => {
			return item.id === input.userId
		})
		if (!account) return { ok: false as const, error: 'signed-out' as const }

		if (input.avatar) account.avatar = input.avatar
		else delete account.avatar

		await writeAccounts(file)
		return { ok: true as const }
	})
}
