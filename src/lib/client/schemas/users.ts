import { z } from 'zod';
import { orderPhoneValidation } from './order';
import { userRoles } from '../constants/dbTypes';

export const nameValidation = z
	.string({
		required_error: 'Imię i nazwisko jest wymagane'
	})
	.min(3, { message: 'Nieprawidłowe imię i nazwisko' })
	.trim();

export const emailValidation = z
	.string({
		required_error: 'Email jest wymagany'
	})
	.min(1, { message: 'Nieprawidłowy email' })
	.max(64, { message: 'Nieprawidłowy email' })
	.email({ message: 'Nieprawidłowy email' });

export const roleValidation = z.enum(userRoles, {
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
});

export const accessPermittedValidation = z.boolean({
	invalid_type_error: "Nieprawidłowa wartość dla 'dostęp przyznany'",
	required_error: "Brak wartości dla 'dostęp przyznany'"
});

export const idValidation = z
	.string({
		required_error: 'Id jest wymagane',
		invalid_type_error: 'Nieprawidłowe id'
	})
	.min(1, { message: 'Nieprawidłowe id' });

export const rememberMeValidation = z.union([z.literal('on'), z.literal('off')], {
	required_error: "Wartość dla 'Zapamiętaj mnie' jest wymagana",
	invalid_type_error: "Niepoprawna wartość dla 'Zapamiętaj mnie'"
});

export const verificationCodeValidation = z
	.string({
		required_error: 'Email jest wymagany'
	})
	.length(4, { message: 'Nieprawidłowy kod' });

export const addUserSchema = z.object({
	fullName: nameValidation,
	email: emailValidation,
	role: roleValidation,
	phone: orderPhoneValidation,
	assignedAdviser: idValidation.optional()
});

export const editUserSchema = z.object({
	id: idValidation,
	fullName: nameValidation,
	email: emailValidation,
	role: roleValidation,
	access: accessPermittedValidation.optional(),
	phone: orderPhoneValidation,
	assignedAdviser: idValidation.optional()
});
