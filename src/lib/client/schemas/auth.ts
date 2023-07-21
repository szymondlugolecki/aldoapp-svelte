import { z } from 'zod';
import { userPropertySchemas } from './users';

export const authSchemas = {
	code: z
		.string({
			required_error: 'Kod weryfikacyjny jest wymagany',
			invalid_type_error: 'Nieprawidłowy kod'
		})
		.length(4, { message: 'Nieprawidłowy kod' })
};

export const loginSchema = z.object({
	email: userPropertySchemas.email
});

export const verificationCodeSchema = z.object({
	code: authSchemas.code
});
