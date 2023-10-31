import { z } from 'zod';
import { email } from './user';

const code = z
	.string({
		required_error: 'Kod weryfikacyjny jest wymagany',
		invalid_type_error: 'Nieprawidłowy kod'
	})
	.transform((value) => value.replaceAll(',', ''))
	.pipe(
		z
			.string({
				required_error: 'Kod weryfikacyjny jest wymagany',
				invalid_type_error: 'Nieprawidłowy kod'
			})
			.length(4, { message: 'Nieprawidłowy kod' })
	);

export const verification = z.object({
	code
});

export const login = z.object({
	email
});
