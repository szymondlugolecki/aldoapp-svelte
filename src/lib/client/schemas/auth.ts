import { z } from 'zod';

export const authSchemas = {
	code: z
		.string({
			required_error: 'Kod weryfikacyjny jest wymagany'
		})
		.length(4, { message: 'Nieprawidłowy kod' })
};

// export const loginSchema = z.object({
// 	email: emailValidation
// });

export const verificationCodeSchema = z.object({
	code: authSchemas.code
});
