import { z } from 'zod';
import { deliveryMethods, paymentMethods } from '../constants';

export const orderNameValidation = z
	.string({
		required_error: 'Imię i nazwisko jest wymagane',
		invalid_type_error: 'Nieprawidłowe imię i nazwisko'
	})
	.min(3, { message: 'Nieprawidłowe imię i nazwisko' })
	.max(100, { message: 'Nieprawidłowe imię i nazwisko' });

export const orderStreetValidation = z
	.string({
		required_error: 'Ulica i numer jest wymagany',
		invalid_type_error: 'Nieprawidłowa ulica i numer'
	})
	.min(3, { message: 'Nieprawidłowa ulica i numer' })
	.max(150, { message: 'Nieprawidłowe ulica i numer' });

export const orderZipCodeValidation = z
	.string({
		required_error: 'Kod pocztowy jest wymagany',
		invalid_type_error: 'Nieprawidłowy kod pocztowy'
	})
	.min(1, { message: 'Nieprawidłowy kod pocztowy' })
	.max(30, { message: 'Nieprawidłowe kod pocztowy' });

export const orderCityValidation = z
	.string({ required_error: 'Miasto jest wymagane', invalid_type_error: 'Nieprawidłowe miasto' })
	.min(1, { message: 'Nieprawidłowe miasto' })
	.max(120, { message: 'Nieprawidłowe miasto' });

export const orderPhoneValidation = z
	.string({
		required_error: 'Numer telefonu jest wymagany',
		invalid_type_error: 'Nieprawidłowy numer telefonu'
	})
	.min(9, { message: 'Nieprawidłowy numer telefonu' })
	.max(20, { message: 'Nieprawidłowy numer telefonu' });

export const orderEmailValidation = z
	.string({
		required_error: 'Adres email jest wymagany',
		invalid_type_error: 'Nieprawidłowy adres email'
	})
	.email({ message: 'Nieprawidłowy adres email' });

export const deliveryValidation = z.object({
	street: orderStreetValidation,
	zipCode: orderZipCodeValidation,
	city: orderCityValidation,
	phone: orderPhoneValidation,
	email: orderEmailValidation
});

// if delivery method is 'pickup', then delivery address is not required

const deliveryUnion = z.union([deliveryValidation, z.object({}).optional()]);

export const orderValidation = z
	.object({
		products: z
			.array(
				z.object({
					id: z.string(),
					quantity: z
						.number({
							invalid_type_error: 'Nieprawidłowa ilość produktu',
							required_error: 'Ilość produktu jest wymagana'
						})
						.min(1, { message: 'Nie można zamówić mniej niż jednej sztuki' })
				}),
				{
					invalid_type_error: 'Niespodziewany błąd produktów w koszyku',
					required_error: 'Należy wybrać produkty'
				}
			)
			.nonempty({ message: 'Nie można zamówić pustego koszyka' }),
		deliveryMethod: z.enum(deliveryMethods, {
			errorMap(issue) {
				switch (issue.code) {
					case 'invalid_type':
						return { message: 'Nieprawidłowa metoda dostawy' };
						break;
					case 'invalid_enum_value':
						return { message: 'Nieprawidłowa metoda dostawy' };
						break;
					default:
						return { message: 'Niespodziewany błąd: metoda dostawy' };
						break;
				}
			}
		}),
		paymentMethod: z.enum(paymentMethods, {
			errorMap(issue) {
				switch (issue.code) {
					case 'invalid_type':
						return { message: 'Nieprawidłowa metoda płatności' };
						break;
					case 'invalid_enum_value':
						return { message: 'Nieprawidłowa metoda płatności' };
						break;
					default:
						return { message: 'Niespodziewany błąd: metoda płatności' };
						break;
				}
			}
		}),
		customerName: orderNameValidation,
		address: deliveryUnion.optional(),
		promoCode: z.string({ invalid_type_error: 'Nieprawidłowy kod rabatowy' }).nullish()
	})
	.refine((obj) => obj.deliveryMethod !== 'personal-pickup' || obj.address, {
		message: 'Adres dostawy jest wymagany'
	});
