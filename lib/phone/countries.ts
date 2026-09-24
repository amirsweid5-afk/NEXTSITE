export interface PhoneCountry {
	code: string
	name: string
	dialCode: string
	flag: string
}

/**
 * Common dial-code options for the booking phone field.
 */
export const PHONE_COUNTRIES: PhoneCountry[] = [
	{ code: 'LB', name: 'Lebanon', dialCode: '961', flag: '🇱🇧' },
	{ code: 'AE', name: 'United Arab Emirates', dialCode: '971', flag: '🇦🇪' },
	{ code: 'SA', name: 'Saudi Arabia', dialCode: '966', flag: '🇸🇦' },
	{ code: 'EG', name: 'Egypt', dialCode: '20', flag: '🇪🇬' },
	{ code: 'JO', name: 'Jordan', dialCode: '962', flag: '🇯🇴' },
	{ code: 'SY', name: 'Syria', dialCode: '963', flag: '🇸🇾' },
	{ code: 'IQ', name: 'Iraq', dialCode: '964', flag: '🇮🇶' },
	{ code: 'KW', name: 'Kuwait', dialCode: '965', flag: '🇰🇼' },
	{ code: 'QA', name: 'Qatar', dialCode: '974', flag: '🇶🇦' },
	{ code: 'BH', name: 'Bahrain', dialCode: '973', flag: '🇧🇭' },
	{ code: 'OM', name: 'Oman', dialCode: '968', flag: '🇴🇲' },
	{ code: 'PS', name: 'Palestine', dialCode: '970', flag: '🇵🇸' },
	{ code: 'TR', name: 'Turkey', dialCode: '90', flag: '🇹🇷' },
	{ code: 'US', name: 'United States', dialCode: '1', flag: '🇺🇸' },
	{ code: 'CA', name: 'Canada', dialCode: '1', flag: '🇨🇦' },
	{ code: 'GB', name: 'United Kingdom', dialCode: '44', flag: '🇬🇧' },
	{ code: 'FR', name: 'France', dialCode: '33', flag: '🇫🇷' },
	{ code: 'DE', name: 'Germany', dialCode: '49', flag: '🇩🇪' },
	{ code: 'IT', name: 'Italy', dialCode: '39', flag: '🇮🇹' },
	{ code: 'ES', name: 'Spain', dialCode: '34', flag: '🇪🇸' },
	{ code: 'AU', name: 'Australia', dialCode: '61', flag: '🇦🇺' },
	{ code: 'BR', name: 'Brazil', dialCode: '55', flag: '🇧🇷' },
	{ code: 'IN', name: 'India', dialCode: '91', flag: '🇮🇳' },
	{ code: 'PK', name: 'Pakistan', dialCode: '92', flag: '🇵🇰' },
	{ code: 'MA', name: 'Morocco', dialCode: '212', flag: '🇲🇦' },
	{ code: 'TN', name: 'Tunisia', dialCode: '216', flag: '🇹🇳' },
	{ code: 'DZ', name: 'Algeria', dialCode: '213', flag: '🇩🇿' },
]

export const DEFAULT_PHONE_COUNTRY = PHONE_COUNTRIES[0]

/**
 * Finds a country by ISO code.
 */
export function getPhoneCountry (
	code: string,
): PhoneCountry | undefined {
	return PHONE_COUNTRIES.find((country) => country.code === code)
}

/**
 * Builds an E.164-style phone string from dial code and local digits.
 */
export function formatInternationalPhone (
	dialCode: string,
	localNumber: string,
): string {
	const digits = localNumber.replace(/\D/g, '')
	return `+${dialCode}${digits}`
}
