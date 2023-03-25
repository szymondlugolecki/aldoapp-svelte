import { z } from 'zod';
// import type { toZod } from 'tozod';

export const pushSubscriptionJSONSchema = z.object({
	endpoint: z.string().url(),
	expirationTime: z.union([z.null(), z.number()]),
	keys: z.object({
		p256dh: z.string().min(3),
		auth: z.string().min(3)
	})
});

export const pushNotificationRequest = z.object({
	title: z
		.string({ invalid_type_error: 'Nieprawidłowy tytuł', required_error: 'Tytuł jest wymagany' })
		.min(1, { message: 'Tytuł musi zawierać przynajmniej jeden znak' }),
	options: z.object({
		body: z
			.string({
				invalid_type_error: 'Nieprawidłowa wiadomość',
				required_error: 'Wiadomość jest wymagana'
			})
			.min(1, { message: 'Wiadomość musi zawierać przynajmniej jeden znak' })
	})
});
