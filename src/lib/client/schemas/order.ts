import { z } from 'zod';

export const orderNameValidation = z
	.string({
		required_error: 'Imię i nazwisko jest wymagane',
		invalid_type_error: 'Nieprawidłowe imię i nazwisko'
	})
	.min(3, { message: 'Nieprawidłowe imię i nazwisko' })
	.max(100, { message: 'Nieprawidłowe imię i nazwisko' });

export const orderStreetValidation = z
	.string({
		required_error: 'Ulica i numer jest wymagany',
		invalid_type_error: 'Nieprawidłowa ulica i numer'
	})
	.min(3, { message: 'Nieprawidłowa ulica i numer' })
	.max(150, { message: 'Nieprawidłowe ulica i numer' });

export const orderZipCodeValidation = z
	.string({
		required_error: 'Kod pocztowy jest wymagany',
		invalid_type_error: 'Nieprawidłowy kod pocztowy'
	})
	.min(1, { message: 'Nieprawidłowy kod pocztowy' })
	.max(30, { message: 'Nieprawidłowe kod pocztowy' });

export const orderCityValidation = z
	.string({ required_error: 'Miasto jest wymagane', invalid_type_error: 'Nieprawidłowe miasto' })
	.min(1, { message: 'Nieprawidłowe miasto' })
	.max(120, { message: 'Nieprawidłowe miasto' });

export const orderPhoneValidation = z
	.string({
		required_error: 'Numer telefonu jest wymagany',
		invalid_type_error: 'Nieprawidłowy numer telefonu'
	})
	.min(3, { message: 'Nieprawidłowy numer telefonu' })
	.max(20, { message: 'Nieprawidłowy numer telefonu' });

export const orderEmailValidation = z
	.string({
		required_error: 'Adres email jest wymagany',
		invalid_type_error: 'Nieprawidłowy adres email'
	})
	.email({ message: 'Nieprawidłowy adres email' });

export const addressValidation = z.object({
	name: orderNameValidation,
	street: orderStreetValidation,
	zipCode: orderZipCodeValidation,
	city: orderCityValidation,
	phone: orderPhoneValidation,
	email: orderEmailValidation
});
