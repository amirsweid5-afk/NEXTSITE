'use client'

import {
	useEffect,
	useRef,
	useState,
	useTransition,
	type ChangeEvent,
} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AccountManageForm } from '@/components/account-manage-form'
import { useContent } from '@/components/language-provider'
import {
	updateAvatar,
} from '@/lib/auth/account-actions'
import { switchAccount } from '@/lib/auth/switch-account'
import { isProfilePhoto } from '@/lib/profile-photo'

interface AccountDrawerProps {
	isOpen: boolean
	name: string
	email: string
	phone: string
	avatar: string | null
	isAdmin: boolean
	onClose: () => void
	onProfileChange: (profile: {
		name: string
		phone: string
		avatar: string | null
	}) => void
}

interface ProfileMarkProps {
	name: string
	avatar: string | null
	size?: 'sm' | 'lg'
}

/**
 * Round profile photo, or initials when no photo is saved.
 */
export function ProfileMark ({
	name,
	avatar,
	size = 'sm',
}: ProfileMarkProps) {
	const frame = size === 'lg'
		? 'size-24 text-xl'
		: 'size-10 text-xs'

	if (isProfilePhoto(avatar)) {
		return (
			<img
				src={avatar}
				alt=""
				className={[
					frame,
					'shrink-0 rounded-full object-cover',
				].join(' ')}
			/>
		)
	}

	return (
		<span
			aria-hidden="true"
			className={[
				frame,
				'inline-flex shrink-0 items-center',
				'justify-center rounded-full bg-gold',
				'font-semibold uppercase',
				'tracking-[0.08em] text-white',
			].join(' ')}
		>
			{getInitials(name)}
		</span>
	)
}

/**
 * Signed-in account sidebar. Opens from the end edge,
 * which is the right in English and the left in Arabic.
 */
export function AccountDrawer ({
	isOpen,
	name,
	email,
	phone,
	avatar,
	isAdmin,
	onClose,
	onProfileChange,
}: AccountDrawerProps) {
	const content = useContent()
	const copy = content.accountPanel
	const router = useRouter()
	const closeRef = useRef<HTMLButtonElement>(null)
	const fileRef = useRef<HTMLInputElement>(null)
	const [view, setView] = useState<'menu' | 'manage'>('menu')
	const [wasOpen, setWasOpen] = useState(isOpen)
	const [photoError, setPhotoError] = useState<string | null>(null)
	const [isPhotoPending, setIsPhotoPending] = useState(false)
	const [isCopied, setIsCopied] = useState(false)
	const [isSwitching, startSwitch] = useTransition()

	if (isOpen !== wasOpen) {
		setWasOpen(isOpen)
		if (isOpen) {
			setView('menu')
			setPhotoError(null)
		}
	}

	useEffect(() => {
		if (!isOpen) return
		closeRef.current?.focus()
	}, [isOpen])

	useEffect(() => {
		if (!isCopied) return
		const timer = window.setTimeout(() => {
			setIsCopied(false)
		}, 2000)
		return () => window.clearTimeout(timer)
	}, [isCopied])

	function handlePickPhoto () {
		fileRef.current?.click()
	}

	async function handleFileChange (
		event: ChangeEvent<HTMLInputElement>,
	) {
		const file = event.target.files?.[0]
		event.target.value = ''
		if (!file) return

		setPhotoError(null)
		setIsPhotoPending(true)
		try {
			const dataUrl = await readProfilePhoto(file)
			const result = await updateAvatar(dataUrl)
			if (!result.ok) {
				setPhotoError(copy.photoError)
				return
			}
			onProfileChange({ name, phone, avatar: dataUrl })
			router.refresh()
		} catch {
			setPhotoError(copy.photoError)
		} finally {
			setIsPhotoPending(false)
		}
	}

	async function handleRemovePhoto () {
		setPhotoError(null)
		setIsPhotoPending(true)
		try {
			const result = await updateAvatar(null)
			if (!result.ok) {
				setPhotoError(copy.photoError)
				return
			}
			onProfileChange({ name, phone, avatar: null })
			router.refresh()
		} catch {
			setPhotoError(copy.photoError)
		} finally {
			setIsPhotoPending(false)
		}
	}

	async function handleCopyEmail () {
		try {
			await navigator.clipboard.writeText(email)
			setIsCopied(true)
		} catch {
			setIsCopied(false)
		}
	}

	function handleSwitch (destination: 'login' | 'sign-in' | 'home') {
		startSwitch(() => {
			void switchAccount(destination)
		})
	}

	const actionClass = [
		'flex w-full items-center gap-3',
		'rounded-xl border border-white/10',
		'bg-ink/40 px-3 py-3 text-start',
		'text-xs font-semibold uppercase',
		'leading-snug tracking-[0.12em]',
		'text-white/80 transition duration-300',
		'hover:border-orange/40 hover:text-orange',
		'focus-visible:outline-2',
		'focus-visible:outline-offset-2',
		'disabled:opacity-60',
	].join(' ')

	return (
		<>
			<button
				type="button"
				tabIndex={isOpen ? 0 : -1}
				aria-label={copy.close}
				onClick={onClose}
				className={[
					'fixed inset-0 z-[55]',
					'bg-ink/70 backdrop-blur-sm',
					'transition-opacity duration-300',
					isOpen
						? 'opacity-100'
						: 'pointer-events-none opacity-0',
				].join(' ')}
			/>
			<aside
				id="account-drawer"
				role="dialog"
				aria-modal={isOpen || undefined}
				aria-hidden={!isOpen}
				aria-labelledby="account-drawer-title"
				inert={isOpen ? undefined : true}
				className={[
					'fixed inset-y-0 end-0 z-[60]',
					'flex w-[min(22rem,88vw)] flex-col',
					'border-s border-white/10 bg-surface',
					'shadow-[-16px_0_40px_rgba(0,0,0,0.35)]',
					'rtl:shadow-[16px_0_40px_rgba(0,0,0,0.35)]',
					'transition-transform duration-300 ease-out',
					isOpen
						? 'translate-x-0'
						: 'translate-x-full rtl:-translate-x-full',
				].join(' ')}
			>
				<div
					className={[
						'flex items-center justify-between',
						'border-b border-white/10 px-5 py-4',
					].join(' ')}
				>
					<h2
						id="account-drawer-title"
						className={[
							'text-xs font-semibold uppercase',
							'tracking-[0.18em] text-white',
						].join(' ')}
					>
						{view === 'manage'
							? copy.manageAccount
							: copy.title}
					</h2>
					<button
						ref={closeRef}
						type="button"
						onClick={onClose}
						aria-label={copy.close}
						className={[
							'inline-flex size-9 items-center',
							'justify-center rounded-full',
							'text-white/60 transition duration-300',
							'hover:bg-white/5 hover:text-orange',
							'focus-visible:outline-2',
							'focus-visible:outline-offset-2',
						].join(' ')}
					>
						<CloseIcon />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto px-5 py-6">
					{view === 'manage' ? (
						<AccountManageForm
							name={name}
							phone={phone}
							onBack={() => setView('menu')}
							onSaved={(next) => {
								onProfileChange({
									name: next.name,
									phone: next.phone,
									avatar,
								})
							}}
						/>
					) : (
						<div className="flex flex-col items-center">
							<ProfileMark
								name={name}
								avatar={avatar}
								size="lg"
							/>
							<button
								type="button"
								onClick={handlePickPhoto}
								disabled={isPhotoPending}
								className={[
									'mt-4 inline-flex items-center',
									'gap-2 rounded-full px-3 py-1.5',
									'text-xs font-semibold uppercase',
									'tracking-[0.14em] text-orange',
									'transition duration-300',
									'hover:text-highlight',
									'focus-visible:outline-2',
									'focus-visible:outline-offset-4',
									'disabled:opacity-60',
								].join(' ')}
							>
								{isPhotoPending
									? copy.photoSaving
									: copy.changeProfile}
								<PinIcon />
							</button>
							<input
								ref={fileRef}
								type="file"
								accept="image/jpeg,image/png,image/webp"
								tabIndex={-1}
								className="sr-only"
								onChange={handleFileChange}
							/>
							{photoError ? (
								<p
									role="alert"
									className="mt-2 text-center text-sm text-orange"
								>
									{photoError}
								</p>
							) : null}
							{isProfilePhoto(avatar) ? (
								<button
									type="button"
									onClick={handleRemovePhoto}
									disabled={isPhotoPending}
									className={[
										'mt-1 text-xs text-white/45',
										'underline-offset-4',
										'hover:text-orange hover:underline',
										'focus-visible:outline-2',
										'disabled:opacity-60',
									].join(' ')}
								>
									{copy.removePhoto}
								</button>
							) : null}

							<p className="mt-5 text-base font-medium text-white">
								{name}
							</p>
							<div
								className={[
									'mt-1 flex max-w-full',
									'items-center gap-2',
								].join(' ')}
							>
								<p className="truncate text-sm text-white/55">
									{email}
								</p>
								<button
									type="button"
									onClick={handleCopyEmail}
									aria-label={
										isCopied
											? copy.copied
											: copy.copyEmail
									}
									className={[
										'inline-flex size-8 shrink-0',
										'items-center justify-center',
										'rounded-full text-white/45',
										'hover:text-orange',
										'focus-visible:outline-2',
									].join(' ')}
								>
									<CopyIcon />
								</button>
							</div>
							{isCopied ? (
								<p
									role="status"
									className="mt-1 text-xs text-highlight"
								>
									{copy.copied}
								</p>
							) : null}
							<p
								className={[
									'mt-3 rounded-full border',
									'border-gold/40 bg-gold/15',
									'px-3 py-1 text-xs font-semibold',
									'uppercase tracking-[0.16em]',
									'text-highlight',
								].join(' ')}
							>
								{isAdmin ? copy.admin : copy.customer}
							</p>

							<ul className="mt-8 flex w-full flex-col gap-2">
								<li>
									<button
										type="button"
										onClick={() => setView('manage')}
										className={actionClass}
									>
										<UserIcon />
										<span className="min-w-0 flex-1">
											<span className="block">
												{copy.manageAccount}
											</span>
											<span
												className={[
													'mt-1 block',
													'normal-case',
													'tracking-normal',
													'text-white/40',
												].join(' ')}
											>
												{copy.manageHint}
											</span>
										</span>
									</button>
								</li>
								<li>
									<Link
										href="/booking"
										onClick={onClose}
										className={actionClass}
									>
										<CalendarIcon />
										<span className="flex-1">
											{copy.bookProject}
										</span>
									</Link>
								</li>
								{isAdmin ? (
									<li>
										<Link
											href="/admin"
											onClick={onClose}
											className={actionClass}
										>
											<ShieldIcon />
											<span className="flex-1">
												{content.nav.dashboard}
											</span>
										</Link>
									</li>
								) : null}
								<li>
									<button
										type="button"
										disabled={isSwitching}
										onClick={() => handleSwitch('login')}
										className={actionClass}
									>
										<DoorIcon />
										<span className="flex-1">
											{copy.switchToLogin}
										</span>
									</button>
								</li>
								<li>
									<button
										type="button"
										disabled={isSwitching}
										onClick={() => {
											handleSwitch('sign-in')
										}}
										className={actionClass}
									>
										<PlusIcon />
										<span className="flex-1">
											{copy.switchToSignIn}
										</span>
									</button>
								</li>
							</ul>

							<button
								type="button"
								disabled={isSwitching}
								onClick={() => handleSwitch('home')}
								className={[
									actionClass,
									'mt-6 border-orange/30',
									'text-orange hover:bg-orange/10',
								].join(' ')}
							>
								<LeaveIcon />
								<span className="flex-1">
									{copy.signOut}
								</span>
							</button>
						</div>
					)}
				</div>
			</aside>
		</>
	)
}

function getInitials (name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if (parts.length === 0) return '?'
	const first = parts[0]?.[0] ?? ''
	const last = parts.length > 1
		? parts[parts.length - 1]?.[0] ?? ''
		: parts[0]?.[1] ?? ''
	return `${first}${last}`.toUpperCase()
}

function readProfilePhoto (file: File): Promise<string> {
	const allowed = ['image/jpeg', 'image/png', 'image/webp']
	if (!allowed.includes(file.type) || file.size > 2_000_000) {
		return Promise.reject(new Error('invalid'))
	}

	return new Promise((resolve, reject) => {
		const image = new Image()
		const url = URL.createObjectURL(file)
		image.onload = () => {
			const size = 256
			const canvas = document.createElement('canvas')
			canvas.width = size
			canvas.height = size
			const context = canvas.getContext('2d')
			if (!context) {
				URL.revokeObjectURL(url)
				reject(new Error('invalid'))
				return
			}
			const scale = Math.max(
				size / image.width,
				size / image.height,
			)
			const width = image.width * scale
			const height = image.height * scale
			context.drawImage(
				image,
				(size - width) / 2,
				(size - height) / 2,
				width,
				height,
			)
			URL.revokeObjectURL(url)
			resolve(canvas.toDataURL('image/jpeg', 0.82))
		}
		image.onerror = () => {
			URL.revokeObjectURL(url)
			reject(new Error('invalid'))
		}
		image.src = url
	})
}

function CloseIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-4 w-4"
		>
			<path
				d="M6 6l12 12M18 6 6 18"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	)
}

function PinIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-3.5 w-3.5"
		>
			<path
				d="M9 4.5h6l-1 6.5 3 2v1.5H7v-1.5l3-2-1-6.5Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
			<path
				d="M12 14.5V20"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	)
}

function UserIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-4 w-4 shrink-0"
		>
			<circle
				cx="12"
				cy="8"
				r="3"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M6.5 19c.8-2.4 2.8-3.5 5.5-3.5s4.7 1.1 5.5 3.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	)
}

function CalendarIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-4 w-4 shrink-0"
		>
			<rect
				x="4"
				y="5.5"
				width="16"
				height="14"
				rx="2"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M8 4v3M16 4v3M4 10h16"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	)
}

function ShieldIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-4 w-4 shrink-0"
		>
			<path
				d="M12 3.5 19 6.5v5.2c0 4-2.8 6.7-7 8.3-4.2-1.6-7-4.3-7-8.3V6.5L12 3.5Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function DoorIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-4 w-4 shrink-0"
		>
			<path
				d="M6 4.5h8.5a1.5 1.5 0 0 1 1.5 1.5v12H6v-14Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
			<path
				d="M14 12h.5M10 20.5h10"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	)
}

function PlusIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-4 w-4 shrink-0"
		>
			<circle
				cx="10"
				cy="8"
				r="3"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M4.8 19c.7-2.2 2.5-3.3 5.2-3.3 1.2 0 2.3.3 3.2.8M18 14v6M15 17h6"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	)
}

function LeaveIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-4 w-4 shrink-0"
		>
			<path
				d="M10 7V5.5A1.5 1.5 0 0 1 11.5 4H18v16h-6.5A1.5 1.5 0 0 1 10 18.5V17"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M4 12h10M11 9l3 3-3 3"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function CopyIcon () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			className="h-3.5 w-3.5"
		>
			<rect
				x="8"
				y="8"
				width="10"
				height="10"
				rx="1.5"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M6 16H5.5A1.5 1.5 0 0 1 4 14.5v-9A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5V6"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
		</svg>
	)
}
