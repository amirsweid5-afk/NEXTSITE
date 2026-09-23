import { z } from 'zod'

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
		phone: z.string().trim().max(40),
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
	phone: z.string().trim().max(40),
	serviceId: z.uuid(),
	websiteDescription: z.string().trim().min(1).max(4000),
})

export type BookingInput = z.infer<typeof bookingInputSchema>
