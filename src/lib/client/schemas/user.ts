import { z } from 'zod';
import { userRoles } from '../constants/dbTypes';

export const id = z
	.string({
		required_error: 'Identyfikator użytkownika jest wymagany',
		invalid_type_error: 'Nieprawidłowy użytkownik'
	})
	.cuid2({ message: 'Nieprawidłowy użytkownik' });

export const email = z
	.string({
		required_error: 'Email jest wymagany'
	})
	.min(1, { message: 'Nieprawidłowy email' })
	.max(120, { message: 'Nieprawidłowy email' })
	.email({ message: 'Nieprawidłowy email' })
	.toLowerCase();

export const fullName = z
	.string({
		required_error: 'Imię i nazwisko jest wymagane'
	})
	.min(3, { message: 'Nieprawidłowe imię i nazwisko' })
	.trim();

export const role = z.enum(userRoles, {
	errorMap(issue) {
		switch (issue.code) {
			case 'invalid_type':
				return { message: 'Nieprawidłowa rola' };
			case 'invalid_enum_value':
				return { message: 'Nieprawidłowa rola' };
			default:
				return { message: 'Niespodziewany błąd: rola' };
		}
	}
});

export const phone = z
	.string({
		required_error: 'Numer telefonu jest wymagany',
		invalid_type_error: 'Nieprawidłowy numer telefonu'
	})
	.min(9, { message: 'Nieprawidłowy numer telefonu' })
	.max(20, { message: 'Nieprawidłowy numer telefonu' })
	.transform((val) => val.replaceAll(' ', ''));

export const street = z
	.string({
		required_error: 'Ulica i numer są wymagane'
	})
	.min(3, { message: 'Nieprawidłowa ulica i numer' })
	.trim();

export const zipCode = z
	.string({
		required_error: 'Kod pocztowy jest wymagany'
	})
	.min(5, { message: 'Nieprawidłowy kod pocztowy' }) // should be of length 6
	.max(10, { message: 'Nieprawidłowy kod pocztowy' })
	.trim();

export const city = z
	.string({
		required_error: 'Miasto jest wymagane'
	})
	.min(3, { message: 'Nieprawidłowe miasto' })
	.trim();

export const address = z.object({
	street,
	zipCode,
	city
});

export const addForm = z.object({
	email,
	fullName,
	role,
	phone
});

export const editForm = z.object({
	id: id.default('' as unknown as string),
	email: email.optional(),
	fullName: fullName.optional(),
	role: role.optional(),
	phone: phone.optional(),
	street: street.optional(),
	zipCode: zipCode.optional(),
	city: city.optional(),
	claimAdviser: z
		.union([z.boolean(), z.literal('true'), z.literal('false')])
		.transform((value) => value === true || value === 'true')
		.optional()
});

export type AddUserForm = typeof addForm;
export type EditUserForm = typeof editForm;
