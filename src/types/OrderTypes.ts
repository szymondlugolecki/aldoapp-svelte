import type {
	DeliveryMethod,
	DeliveryStatus,
	OrderStatus,
	PaymentMethod,
	PaymentStatus
} from '$lib/client/constants/dbTypes';
import type { Order } from '$lib/server/db/schemas/products';
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
