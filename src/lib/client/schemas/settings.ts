import { z } from 'zod';
import { city, street, zipCode, phone, email } from './user';

export const addressForm = z.object({
	street: street.optional(),
	zipCode: zipCode.optional(),
	city: city.optional()
});

export const phoneForm = z.object({
	phone
});

export const emailForm = z.object({
	email
});

export type AddressForm = typeof addressForm;
export type EmailForm = typeof emailForm;
export type PhoneForm = typeof phoneForm;
