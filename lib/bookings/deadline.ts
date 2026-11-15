export const MIN_DEADLINE_DAYS = 7

/**
 * Returns a YYYY-MM-DD date in the local calendar.
 */
export function toLocalDateIso (date: Date = new Date()) {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

/**
 * Earliest booking deadline: seven days after today.
 */
export function minBookingDeadlineIso (now: Date = new Date()) {
	return toLocalDateIso(new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() + MIN_DEADLINE_DAYS,
	))
}

/**
 * Converts a stored ISO date into dd/mm/yyyy for the form.
 */
export function toDeadlineDisplay (value: string) {
	const iso = normalizeDeadlineToIso(value)
	if (!iso) return value.trim() === '' ? '' : value.trim()
	const [year, month, day] = iso.split('-')
	return `${day}/${month}/${year}`
}

/**
 * Accepts dd/mm/yyyy or yyyy-mm-dd and returns ISO, or null when invalid.
 */
export function normalizeDeadlineToIso (value: string) {
	const trimmed = value.trim()
	if (trimmed === '') return ''

	const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)
	if (isoMatch) {
		const year = Number(isoMatch[1])
		const month = Number(isoMatch[2])
		const day = Number(isoMatch[3])
		if (!isRealDate(year, month, day)) return null
		return trimmed
	}

	const displayMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
	if (!displayMatch) return null

	const day = Number(displayMatch[1])
	const month = Number(displayMatch[2])
	const year = Number(displayMatch[3])
	if (!isRealDate(year, month, day)) return null

	return [
		String(year).padStart(4, '0'),
		String(month).padStart(2, '0'),
		String(day).padStart(2, '0'),
	].join('-')
}

/**
 * Formats typed digits into dd/mm/yyyy as the user enters them.
 */
export function formatDeadlineInput (value: string) {
	const digits = value.replace(/\D/g, '').slice(0, 8)
	const day = digits.slice(0, 2)
	const month = digits.slice(2, 4)
	const year = digits.slice(4, 8)
	if (digits.length <= 2) return day
	if (digits.length <= 4) return `${day}/${month}`
	return `${day}/${month}/${year}`
}

/**
 * True when the deadline is empty or at least seven days from today.
 */
export function isAllowedBookingDeadline (
	value: string,
	now: Date = new Date(),
) {
	const iso = normalizeDeadlineToIso(value)
	if (iso === '') return true
	if (iso === null) return false
	return iso >= minBookingDeadlineIso(now)
}

/**
 * True when a filled deadline is too soon or already past.
 */
export function isDeadlineWarningNeeded (
	value: string,
	now: Date = new Date(),
) {
	const trimmed = value.trim()
	if (trimmed === '') return false
	const iso = normalizeDeadlineToIso(trimmed)
	if (iso === null) return true
	return !isAllowedBookingDeadline(iso, now)
}

function isRealDate (year: number, month: number, day: number) {
	if (year < 1000 || year > 9999) return false
	if (month < 1 || month > 12) return false
	if (day < 1 || day > 31) return false
	const date = new Date(year, month - 1, day)
	return date.getFullYear() === year
		&& date.getMonth() === month - 1
		&& date.getDate() === day
}
