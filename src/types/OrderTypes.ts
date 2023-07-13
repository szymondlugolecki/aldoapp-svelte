import type {
	DeliveryMethod,
	DeliveryStatus,
	OrderStatus,
	PaymentMethod,
	PaymentStatus
} from '$lib/client/constants/dbTypes';
import type { Order } from '$lib/server/db/schemas/orders';
import type { Product } from '$lib/server/db/schemas/products';
import type { User } from './UserTypes';

export type { Order };

export type OrderRowType = 'products' | 'customer' | 'status' | 'action' | 'createdAt';

export type OrderFilter = {
	payment: PaymentStatus;
	order: OrderStatus;
	delivery: DeliveryStatus;
	paymentMethod: PaymentMethod;
	deliveryMethod: DeliveryMethod;
};

// Customer Info & Products
export type OrderWithCustomer = Order & {
	attachedCustomer: Pick<User, 'id' | 'fullName' | 'email'>;
	attachedDriver: Pick<User, 'id' | 'fullName' | 'email'> | null;
	// productsList: Pick<Product, 'id' | 'symbol' | 'name' | 'encodedURL'>[];
};

export type OrderSortableColumn = keyof Pick<
	Order,
	| 'status'
	| 'paymentStatus'
	| 'deliveryStatus'
	| 'estimatedDeliveryDate'
	| 'price'
	| 'paymentMethod'
	| 'deliveryMethod'
	| 'createdAt'
>;

export type OrderSummary = Pick<
	Order,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'deliveryMethod'
	| 'paymentMethod'
	| 'address'
	| 'price'
	| 'discount'
	| 'noDiscountPrice'
	| 'deliveryStatus'
	| 'paymentStatus'
	| 'status'
> & {
	products: (Pick<Product, 'id' | 'name' | 'symbol' | 'price' | 'encodedURL'> & {
		quantity: number;
	})[];
	customer: Pick<User, 'id' | 'fullName' | 'email' | 'phone' | 'address'>;
	cartOwner: Pick<User, 'id' | 'fullName' | 'email' | 'phone' | 'role'>;
	driver: Pick<User, 'id' | 'fullName' | 'email' | 'phone'> | null;
};
