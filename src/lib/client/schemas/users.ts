import { z } from 'zod';
import { userRoles } from '../constants/dbTypes';

export const userPropertySchemas = {
	id: z
		.string({
			required_error: 'Id jest wymagane',
			invalid_type_error: 'Nieprawidłowe id'
		})
		.min(1, { message: 'Nieprawidłowe id' })
		.cuid2({ message: 'Nieprawidłowe id' }),

	email: z
		.string({
			required_error: 'Email jest wymagany'
		})
		.min(1, { message: 'Nieprawidłowy email' })
		.max(64, { message: 'Nieprawidłowy email' })
		.email({ message: 'Nieprawidłowy email' }),
	fullName: z
		.string({
			required_error: 'Imię i nazwisko jest wymagane'
		})
		.min(3, { message: 'Nieprawidłowe imię i nazwisko' })
		.trim(),
	role: z.enum(userRoles, {
		errorMap(issue) {
			switch (issue.code) {
				case 'invalid_type':
					return { message: 'Nieprawidłowa rola' };
					break;
				case 'invalid_enum_value':
					return { message: 'Nieprawidłowa rola' };
					break;
				default:
					return { message: 'Niespodziewany błąd: rola' };
					break;
			}
		}
	}),
	access: z.boolean({
		invalid_type_error: "Nieprawidłowa wartość dla 'dostęp'",
		required_error: "Brak wartości dla 'dostęp'"
	}),
	phone: z
		.string({
			required_error: 'Numer telefonu jest wymagany',
			invalid_type_error: 'Nieprawidłowy numer telefonu'
		})
		.min(9, { message: 'Nieprawidłowy numer telefonu' })
		.max(20, { message: 'Nieprawidłowy numer telefonu' }),
	address: z.object({
		street: z
			.string({
				required_error: 'Ulica i numer jest wymagana'
			})
			.min(3, { message: 'Nieprawidłowa ulica i numer' })
			.trim(),
		zipCode: z
			.string({
				required_error: 'Kod pocztowy jest wymagany'
			})
			.min(4, { message: 'Nieprawidłowy kod pocztowy' }) // should be of length 6
			.max(8, { message: 'Nieprawidłowy kod pocztowy' })
			.trim(),
		city: z
			.string({
				required_error: 'Miasto jest wymagane'
			})
			.min(3, { message: 'Nieprawidłowe miasto' })
			.trim()
	})
};

export const addUserSchema = z.object({
	fullName: userPropertySchemas.fullName,
	email: userPropertySchemas.email,
	role: userPropertySchemas.role,
	phone: userPropertySchemas.phone,
	adviserId: userPropertySchemas.id.optional(),
	city: userPropertySchemas.address.shape.city.nullish(),
	street: userPropertySchemas.address.shape.street.nullish(),
	zipCode: userPropertySchemas.address.shape.zipCode.nullish()
});

export const editUserSchema = z.object({
	id: userPropertySchemas.id,
	access: userPropertySchemas.access.optional(),
	fullName: userPropertySchemas.fullName.optional(),
	email: userPropertySchemas.email.optional(),
	role: userPropertySchemas.role.optional(),
	phone: userPropertySchemas.phone.optional(),
	adviserId: userPropertySchemas.id.optional(),
	city: userPropertySchemas.address.shape.city.nullish(),
	street: userPropertySchemas.address.shape.street.nullish(),
	zipCode: userPropertySchemas.address.shape.zipCode.nullish()
});

export type EditUserSchema = z.infer<typeof editUserSchema>;
