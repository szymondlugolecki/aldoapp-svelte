import { z } from 'zod';

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

export const roleValidation = z.union(
	[z.literal('customer'), z.literal('moderator'), z.literal('admin')],
	{
		required_error: 'Rola jest wymagana',
		invalid_type_error: 'Nieprawidłowa rola'
	}
);

export const bannedValidation = z.literal('true').optional();

export const idValidation = z
	.string({
		required_error: 'Id jest wymagane'
	})
	.uuid({ message: 'Nieprawidłowe id' });

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
	name: nameValidation,
	email: emailValidation,
	role: roleValidation
});

export const editUserSchema = z.object({
	id: idValidation,
	name: nameValidation,
	email: emailValidation,
	role: roleValidation,
	banned: bannedValidation
});
