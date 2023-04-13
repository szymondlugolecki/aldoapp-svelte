import { z } from 'zod';
import { deliveryMethods, paymentMethods } from '../constants/dbTypes';

export const orderCustomerNameValidation = z
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
	.min(4, { message: 'Nieprawidłowa ulica i numer' })
	.max(150, { message: 'Nieprawidłowe ulica i numer' });

export const orderZipCodeValidation = z
	.string({
		required_error: 'Kod pocztowy jest wymagany',
		invalid_type_error: 'Nieprawidłowy kod pocztowy'
	})
	.min(4, { message: 'Nieprawidłowy kod pocztowy' })
	.max(30, { message: 'Nieprawidłowe kod pocztowy' });

export const orderCityValidation = z
	.string({ required_error: 'Miasto jest wymagane', invalid_type_error: 'Nieprawidłowe miasto' })
	.min(3, { message: 'Nieprawidłowe miasto' })
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

export const orderAddressValidation = z.object({
	street: orderStreetValidation,
	zipCode: orderZipCodeValidation,
	city: orderCityValidation
});

export const orderCustomerValidation = z.object({
	phone: orderPhoneValidation,
	email: orderEmailValidation,
	fullName: orderCustomerNameValidation
});

// if delivery method is 'pickup', then delivery address is not required

// const deliveryUnion = z.union([deliveryValidation, z.null()]);

export const orderDeliveryMethodValidation = z.enum(deliveryMethods, {
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
});

export const orderPaymentMethodValidation = z.enum(paymentMethods, {
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
});

export const orderProductsValidation = z
	.array(
		z.object({
			productId: z
				.number({
					invalid_type_error: 'Nieprawidłowe id produktu',
					required_error: 'Id produktu jest wymagane'
				})
				.min(0, { message: 'Id nie może być ujemne' }),
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
	.nonempty({ message: 'Nie można zamówić pustego koszyka' });

/*

	The difference between client and server validation is:
	  	1. Address property is nullable on server side (when the deliveryMethod is personal-pickup)
		2. Customer property is nullable on server side (when the deliveryMethod is personal-pickup)
	  	3. promoCode object transforms to only promoCodeId

*/

export const promoCodeIdValidation = z
	.number({
		invalid_type_error: 'Nieprawidłowe id kodu promocyjnego',
		required_error: 'Id kodu promocyjnego jest wymagane'
	})
	.min(0, { message: 'Nieprawidłowe id kodu promocyjnego' });

export const clientOrderValidation = z.object({
	productsQuantity: orderProductsValidation,
	deliveryMethod: orderDeliveryMethodValidation,
	paymentMethod: orderPaymentMethodValidation,
	address: orderAddressValidation,
	promoCodeId: promoCodeIdValidation.optional()
});

export const serverOrderValidation = z.object({
	productsQuantity: orderProductsValidation,
	deliveryMethod: orderDeliveryMethodValidation,
	paymentMethod: orderPaymentMethodValidation,
	address: orderAddressValidation.nullable(),
	promoCodeId: promoCodeIdValidation.optional()
});
