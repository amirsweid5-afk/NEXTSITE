/**
 * Formats local phone digits for the booking input display.
 * Lebanon uses 00 / 000 / 000 (for example 76 / 722 / 832).
 */
export function formatPhoneDisplay (
	countryCode: string,
	digits: string,
) {
	const cleaned = digits.replace(/\D/g, '').slice(0, 15)
	if (cleaned === '') return ''

	if (countryCode === 'LB') {
		const local = cleaned.slice(0, 8)
		const first = local.slice(0, 2)
		const middle = local.slice(2, 5)
		const last = local.slice(5, 8)
		if (local.length <= 2) return first
		if (local.length <= 5) return `${first}/${middle}`
		return `${first}/${middle}/${last}`
	}

	return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ').trim()
}

/**
 * Placeholder shown for the selected country phone pattern.
 */
export function phoneDisplayPlaceholder (countryCode: string) {
	if (countryCode === 'LB') return '00/000/000'
	return '000 000 0000'
}
