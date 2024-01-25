import type { Order } from '$lib/server/db/schemas/orders';
import type { Product } from '$lib/server/db/schemas/products';
import type { User } from './UserTypes';

export type { Order };

export type OrderSortableColumn = keyof Pick<
	Order,
	'status' | 'estimatedDeliveryDate' | 'price' | 'paymentMethod' | 'deliveryMethod' | 'createdAt'
>;

export type OrderEventsSchema =
	// | { type: 'PAYMENT_RECEIVED' }
	// | { type: 'KEEP_WAITING' }
	| { type: 'IS_AVAILABLE_FOR_SHIPMENT' }
	| { type: 'IS_AVAILABLE_FOR_PICKUP' }
	| { type: 'IS_UNAVAILABLE' }
	| { type: 'CANCEL' }
	| { type: 'READY_FOR_PICKUP' }
	| { type: 'PICKED_UP' }
	| { type: 'SHIPPED' }
	| { type: 'DELIVERED' };

export type OrderEvent = OrderEventsSchema['type'];

export type OrderTable = Pick<
	Order,
	'id' | 'createdAt' | 'price' | 'discount' | 'status' | 'deliveryMethod' | 'paymentMethod' | 'paid'
> & {
	products: (Pick<Product, 'id' | 'name' | 'symbol' | 'price' | 'encodedURL'> & {
		quantity: number;
	})[];
	customer: Pick<User, 'id' | 'fullName' | 'email'>;
	cartOwner: Pick<User, 'id' | 'fullName' | 'email'>;
};

export type AllCustomers = {
	id: 'all';
	fullName: 'Wszyscy';
	email: 'Wszyscy';
};

export type AllCartOwners = AllCustomers;
