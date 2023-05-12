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
		.max(20, { message: 'Nieprawidłowy numer telefonu' })
};

export const addUserSchema = z.object({
	fullName: userPropertySchemas.fullName,
	email: userPropertySchemas.email,
	role: userPropertySchemas.role,
	phone: userPropertySchemas.phone,
	assignedAdviser: userPropertySchemas.id.optional()
});

export const editUserSchema = z.object({
	id: userPropertySchemas.id,
	access: userPropertySchemas.access.optional(),
	fullName: userPropertySchemas.fullName.optional(),
	email: userPropertySchemas.email.optional(),
	role: userPropertySchemas.role.optional(),
	phone: userPropertySchemas.phone.optional(),
	assignedAdviser: userPropertySchemas.id.optional()
});

export type EditUserSchema = z.infer<typeof editUserSchema>;
