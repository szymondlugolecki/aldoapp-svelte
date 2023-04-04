import type {
	DeliveryMethod,
	DeliveryStatus,
	OrderStatus,
	PaymentMethod,
	PaymentStatus
} from '$lib/client/constants/dbTypes';
import type { Order } from '$lib/server/db/schemas/products';

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
	attachedCustomer: {
		id: string;
		fullName: string;
		email: string;
	};
	// productsList: Pick<Product, 'id' | 'symbol' | 'name' | 'encodedURL'>[];
};
