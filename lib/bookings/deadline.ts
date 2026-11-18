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
 * Turns a single day or month from 1–9 into 01–09.
 * Leaves 10–31 and 10–12 unchanged.
 */
function padDatePart (part: string) {
	if (/^[1-9]$/.test(part)) return '0' + part
	return part
}

/**
 * Formats a run of digits into dd/mm/yyyy.
 * A day of 4–9, or a month of 2–9, is padded at once
 * because no later digit can belong to that part.
 */
function formatDigitRun (digits: string) {
	if (digits.length === 0) return ''

	if (digits.length === 1 && digits >= '4') {
		return '0' + digits
	}

	const day = digits.slice(0, 2)
	const rest = digits.slice(2)
	if (rest.length === 0) return day

	let month = rest.slice(0, 2)
	let year = rest.slice(2)
	if (month.length === 1 && month >= '2') {
		year = rest.slice(1)
		month = '0' + month
	} else if (
		month.length === 2
		&& Number(month) > 12
		&& month[0] >= '2'
	) {
		year = rest.slice(1, 5)
		month = '0' + month[0]
	}

	if (year.length === 0) return `${day}/${month}`
	return `${day}/${month}/${year.slice(0, 4)}`
}

/**
 * Formats typed digits into dd/mm/yyyy as the user enters them.
 * A slash, or a finished 1–9 day or month, gains a leading zero.
 */
export function formatDeadlineInput (value: string) {
	const cleaned = value.replace(/[^\d/]/g, '')
	if (cleaned === '') return ''
	if (!cleaned.includes('/')) {
		return formatDigitRun(cleaned.slice(0, 8))
	}

	const segments = cleaned.split('/')
	let day = (segments[0] ?? '').slice(0, 2)
	let monthDigits = segments[1] ?? ''
	let year = (segments[2] ?? '').slice(0, 4)
	const dayIsFinished = segments.length > 1

	if (
		day.length === 1
		&& (day >= '4' || dayIsFinished)
	) {
		day = padDatePart(day)
	}

	if (year === '' && monthDigits.length > 2) {
		const head = monthDigits.slice(0, 2)
		const headNumber = Number(head)
		if (headNumber >= 1 && headNumber <= 12) {
			year = monthDigits.slice(2, 6)
			monthDigits = head
		} else {
			year = monthDigits.slice(1, 5)
			monthDigits = padDatePart(monthDigits.slice(0, 1))
		}
	}

	let month = monthDigits.slice(0, 2)
	const monthIsFinished = segments.length > 2 || year !== ''
	if (
		month.length === 1
		&& (month >= '2' || monthIsFinished)
	) {
		month = padDatePart(month)
	}

	if (segments.length === 1) return day
	if (year === '') {
		return cleaned.endsWith('/') && month === ''
			? `${day}/`
			: `${day}/${month}`
	}
	return `${day}/${month}/${year}`
}

/**
 * Pads a finished day or month of 1–9 when the field is left.
 */
export function padDeadlineInput (value: string) {
	const formatted = formatDeadlineInput(value)
	if (formatted === '') return ''
	const parts = formatted.split('/')
	if (parts[0]) parts[0] = padDatePart(parts[0])
	if (parts[1]) parts[1] = padDatePart(parts[1])
	return parts.join('/')
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
