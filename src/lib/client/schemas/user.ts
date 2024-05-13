import { z } from 'zod';
import { userRoles } from '../constants/dbTypes';

export const id = z
	.string({
		required_error: 'Użytkownik jest wymagany',
		invalid_type_error: 'Nieprawidłowy użytkownik'
	})
	.length(15, { message: 'Nieprawidłowe id użytkownika' });

export const email = z
	.string({
		required_error: 'Email jest wymagany'
	})
	.min(3, { message: 'Nieprawidłowy email' })
	.max(150, { message: 'Nieprawidłowy email' })
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
	.trim();

export const zipCode = z
	.string({
		required_error: 'Kod pocztowy jest wymagany'
	})
	.trim();

export const city = z
	.string({
		required_error: 'Miasto jest wymagane'
	})
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
	id,
	email: email.optional(),
	fullName: fullName.optional(),
	role: role.optional(),
	phone: phone.optional(),
	street: street.optional(),
	zipCode: zipCode.optional(),
	city: city.optional(),
	adviserId: id.optional()
});

export type AddUserForm = typeof addForm;
export type EditUserForm = typeof editForm;
