import { z } from 'zod';
import { id as userId } from './user';

const endpoint = z
	.string({
		invalid_type_error: 'Nieprawidłowy punkt dostępu',
		required_error: 'Punkt dostępu jest wymagany'
	})
	.url({ message: 'Nieprawidłowy punkt dostępu' });

export const unsubscribe = z.object({
	allDevices: z
		.boolean({
			invalid_type_error: 'Nieprawidłowa wartość dla `wszystkie urządzenia`',
			required_error: 'Wartość `wszystkie urządzenia` jest wymagana'
		})
		.optional()
});

export const subscription = z.object({
	endpoint,
	expirationTime: z
		.number({ invalid_type_error: 'Nieprawidłowy czas wygaśnięcia subskrypcji' })
		.nullish()
		.optional(),
	p256dh: z
		.string({
			invalid_type_error: 'Nieprawidłowy klucz subskrypcji',
			required_error: 'Klucz subskrypcji jest wymagany'
		})
		.min(3, { message: 'Nieprawidłowy klucz subskrypcji' }),
	auth: z
		.string({
			invalid_type_error: 'Nieprawidłowy klucz subskrypcji',
			required_error: 'Klucz subskrypcji jest wymagany'
		})
		.min(3, { message: 'Nieprawidłowy klucz subskrypcji' })
});

export const subscriptionForm = z.object({
	subscription: subscription
});

export const title = z
	.string({ invalid_type_error: 'Nieprawidłowy tytuł', required_error: 'Tytuł jest wymagany' })
	.min(3, { message: 'Za krótki tytuł' });

export const body = z
	.string({
		invalid_type_error: 'Nieprawidłowa wiadomość',
		required_error: 'Wiadomość jest wymagana'
	})
	.min(5, { message: 'Za krótka wiadomość' });

export const notification = z.object({
	targets: z
		.array(userId)
		.min(1, { message: 'Wybierz przynajmniej jednego użytkownika' })
		.or(userId),
	title,
	body
});

export const notificationAll = z.object({
	title,
	body
});

export type SubscribeForm = typeof subscription;
export type UnsubscribeForm = typeof unsubscribe;
export type NotificationForm = typeof notification;
