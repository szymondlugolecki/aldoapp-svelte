import { z } from 'zod';
import { paymentMethods, deliveryMethods, orderEvents } from '../constants/dbTypes';
// import { id as userId, city, zipCode, street } from './user';
import { id as productId } from './products';
import { addressForm } from './settings';

export const id = z
	.string({
		required_error: 'Identyfikator zamówienia jest wymagany',
		invalid_type_error: 'Nieprawidłowe zamówienie'
	})
	.length(5, { message: 'Nieprawidłowe id zamówienia' });

export const deliveryMethod = z.enum(deliveryMethods, {
	errorMap(issue) {
		switch (issue.code) {
			case 'invalid_type':
				return { message: 'Wybierz metodę dostawy' };
			case 'invalid_enum_value':
				return { message: 'Wybierz metodę dostawy' };
			default:
				return { message: 'Błąd: metoda dostawy' };
		}
	}
});

export const paymentMethod = z.enum(paymentMethods, {
	errorMap(issue) {
		switch (issue.code) {
			case 'invalid_type':
				return { message: 'Wybierz metodę płatności' };
			case 'invalid_enum_value':
				return { message: 'Wybierz metodę płatności' };
			default:
				return { message: 'Błąd: metoda płatności' };
		}
	}
});

export const eventForm = z.object({
	id,
	event: z.enum(orderEvents, {
		errorMap(issue) {
			switch (issue.code) {
				case 'invalid_type':
					return { message: 'Nieprawidłowy status' };
				case 'invalid_enum_value':
					return { message: 'Nieprawidłowy status' };
				default:
					return { message: 'Niespodziewany błąd: status' };
			}
		}
	})
});

export const status = z.object({});

export const paymentForm = z.object({
	id,
	paid: z
		.union([z.boolean(), z.literal('true'), z.literal('false')])
		.transform((value) => value === true || value === 'true')
});

export const orderAddressForm = addressForm.merge(
	z.object({
		id
	})
);

// const saveAddress = z.boolean({
// 	invalid_type_error: 'Nieprawidłowa wartość dla: zapamiętaj adres',
// 	required_error: 'Wymagana wartość dla: zapamiętaj adres'
// });

export const productQuantity = z.object({
	productId,
	quantity: z
		.number({
			invalid_type_error: 'Nieprawidłowa ilość produktu',
			required_error: 'Ilość produktu jest wymagana'
		})
		.min(0, { message: 'Nieprawidłowa ilość produktu' })
		.max(9, { message: 'Nieprawidłowa ilość produktu' })
});

export const create = z.object({
	deliveryMethod,
	paymentMethod
	// customerId: userId.optional() // if not passed then defaults to session user
	// street: street,
	// zipCode: zipCode,
	// city: city,
	// saveAddress: saveAddress.optional()
});

export const orderAgainForm = z.object({
	id
});

export const orderStatusHistoryForm = z.object({
	id
});

export type OrderForm = typeof create;
export type OrderAgainForm = typeof orderAgainForm;
export type ProductQuantity = typeof productQuantity;

export type OrderAddressForm = typeof orderAddressForm;
export type PaymentForm = typeof paymentForm;
export type EventForm = typeof eventForm;
