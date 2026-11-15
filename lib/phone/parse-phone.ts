import {
	DEFAULT_PHONE_COUNTRY,
	PHONE_COUNTRIES,
	type PhoneCountry,
} from '@/lib/phone/countries'

/**
 * Splits a stored +dial local phone into country and digits.
 */
export function parseStoredPhone (value: string | null | undefined): {
	countryCode: string
	phone: string
} {
	const digits = (value ?? '').replace(/\D/g, '')
	if (digits === '') {
		return {
			countryCode: DEFAULT_PHONE_COUNTRY.code,
			phone: '',
		}
	}

	const match = [...PHONE_COUNTRIES]
		.sort((left, right) => {
			return right.dialCode.length - left.dialCode.length
		})
		.find((country) => digits.startsWith(country.dialCode))

	if (!match) {
		return {
			countryCode: DEFAULT_PHONE_COUNTRY.code,
			phone: digits,
		}
	}

	return {
		countryCode: match.code,
		phone: digits.slice(match.dialCode.length),
	}
}

/**
 * Finds a phone country by dial code.
 */
export function getPhoneCountryByDial (
	dialCode: string,
): PhoneCountry | undefined {
	return PHONE_COUNTRIES.find((country) => {
		return country.dialCode === dialCode
	})
}
