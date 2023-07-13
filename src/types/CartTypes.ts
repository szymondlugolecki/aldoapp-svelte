import type { Cart as CartSchema } from '$lib/server/db/schemas/carts';
import type { Product } from '$lib/server/db/schemas/products';
import type { User } from './UserTypes';

export type Cart = Pick<
	CartSchema,
	'id' | 'createdAt' | 'ownerId' | 'deliveryMethod' | 'paymentMethod'
> & {
	products: (Pick<Product, 'id' | 'name' | 'symbol' | 'price' | 'encodedURL'> & {
		quantity: number;
	})[];
	customer: Pick<User, 'id' | 'fullName' | 'phone' | 'email' | 'address'>;
};

export type CartLayoutData = {
	useCustomAddress: boolean;
	customAddress: NonNullable<CartSchema['customAddress']>;
	deliveryMethod: CartSchema['deliveryMethod'];
	paymentMethod: CartSchema['paymentMethod'];
};
