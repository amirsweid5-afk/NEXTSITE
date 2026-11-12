export const MIN_DEADLINE_DAYS = 8

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
 * Earliest booking deadline: eight days after today.
 */
export function minBookingDeadlineIso (now: Date = new Date()) {
	return toLocalDateIso(new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() + MIN_DEADLINE_DAYS,
	))
}

/**
 * True when the deadline is a date eight or more days from today.
 */
export function isAllowedBookingDeadline (
	value: string,
	now: Date = new Date(),
) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
	return value >= minBookingDeadlineIso(now)
}
