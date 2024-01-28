import type { Cart as CartSchema } from '$lib/server/db/schemas/carts';
import type { Address } from '$lib/server/db/schemas/orders';
import type { Product } from '$lib/server/db/schemas/products';
import type { User } from './UserTypes';

export type Cart = Pick<CartSchema, 'id' | 'createdAt' | 'ownerId'> & {
	products: (Pick<Product, 'id' | 'name' | 'symbol' | 'price' | 'encodedURL' | 'image'> & {
		quantity: number;
	})[];
	customer: Pick<User, 'id' | 'fullName' | 'phone' | 'email'> & {
		address: Address;
	};
};

export type CartEventsSchema =
	| { type: 'CART_APPROVED' }
	| { type: 'DELIVERY_METHOD_APPROVED' }
	| { type: 'DELIVERY_ADDRESS_APPROVED' }
	| { type: 'PAYMENT_METHOD_APPROVED' }
	| { type: 'ORDER_CONFIRMED' }
	| { type: 'GO_BACK' };
