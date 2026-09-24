import { z } from 'zod'
import {
	formatInternationalPhone,
	getPhoneCountry,
} from '@/lib/phone/countries'

export interface BookingServiceOption {
	serviceId: string
	name: string
	price: number
}

/**
 * Builds the booking form schema with localized error messages.
 */
export function createBookingSchema (copy: {
	fullNameError: string
	emailError: string
	phoneError: string
	countryError: string
	serviceError: string
	websiteError: string
}) {
	return z.object({
		fullName: z.string().trim().min(1, copy.fullNameError).max(120),
		email: z
			.string()
			.trim()
			.toLowerCase()
			.max(254)
			.pipe(z.email(copy.emailError)),
		countryCode: z
			.string()
			.trim()
			.min(1, copy.countryError)
			.refine((code) => getPhoneCountry(code) !== undefined, {
				message: copy.countryError,
			}),
		phone: z
			.string()
			.trim()
			.min(1, copy.phoneError)
			.max(15, copy.phoneError)
			.regex(/^\d+$/, copy.phoneError),
		serviceId: z.uuid(copy.serviceError),
		websiteDescription: z
			.string()
			.trim()
			.min(1, copy.websiteError)
			.max(4000),
	})
}

export const bookingInputSchema = z.object({
	fullName: z.string().trim().min(1).max(120),
	email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
	countryCode: z
		.string()
		.trim()
		.min(1)
		.refine((code) => getPhoneCountry(code) !== undefined),
	phone: z.string().trim().min(1).max(15).regex(/^\d+$/),
	serviceId: z.uuid(),
	websiteDescription: z.string().trim().min(1).max(4000),
})

export type BookingInput = z.infer<typeof bookingInputSchema>

/**
 * Combines country dial code and local phone digits.
 */
export function toStoredPhone (input: BookingInput): string {
	const country = getPhoneCountry(input.countryCode)

	if (!country) {
		return input.phone
	}

	return formatInternationalPhone(country.dialCode, input.phone)
}
