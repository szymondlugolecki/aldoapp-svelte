import { z } from 'zod';
import { idValidation } from './products';
import {
	orderAddressValidation,
	orderDeliveryMethodValidation,
	orderPaymentMethodValidation
} from './order';

export const nameValidation = z
	.string({
		required_error: 'Nazwa produktu jest wymagana',
		invalid_type_error: 'Nieprawidłowa nazwa produktu'
	})
	.min(1, { message: 'Niepoprawna nazwa produktu' })
	.trim();

export const changeDeliveryMethodRequestSchema = z.object({
	deliveryMethod: orderDeliveryMethodValidation,
	customAddress: orderAddressValidation.optional().nullable()
});

export const changePaymentMethodRequestSchema = z.object({
	paymentMethod: orderPaymentMethodValidation
});

export const changeProductQuantityRequestSchema = z.object({
	productId: idValidation
});
