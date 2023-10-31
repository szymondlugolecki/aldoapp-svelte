import { z } from 'zod';
import { id as productId } from './products';
import { id as userId } from './user';

export const changeProductQuantity = z.object({
	productId,
	quantity: z
		.number({ invalid_type_error: 'Nieprawidłowa ilość', required_error: 'Ilość jest wymagana' })
		.min(0, { message: 'Minimalna wartość to 0' })
		.max(9, { message: 'Maksymalna wartość to 9' }),
	add: z.boolean().optional()
});

export const changeCartCustomer = z.object({
	customerId: userId
});
