export type UserRole = 'customer' | 'adviser' | 'driver' | 'admin';

export type Producent = 'deheus' | 'unknown';
export type MainCategory = 'cattle' | 'poultry' | 'pigs' | 'backyard';

export type PaymentMethod = 'cash' | 'transfer';
export type DeliveryMethod = 'personal-delivery'; // 'personal-pickup' |

export type OrderStatus = 'pending' | 'completed' | 'canceled';
export type PaymentStatus = 'pending' | 'completed' | 'canceled';
export type DeliveryStatus = 'pending' | 'shipped' | 'delivered' | 'canceled';

export type DiscountType = 'percentage' | 'fixed';
export type ApplicableProducts = string[];

export const userRoles: [UserRole, ...UserRole[]] = ['customer', 'driver', 'adviser', 'admin'];

export const paymentMethods: [PaymentMethod, ...PaymentMethod[]] = ['cash', 'transfer'];
export const deliveryMethods: [DeliveryMethod, ...DeliveryMethod[]] = ['personal-delivery'];

export const producents: [Producent, ...Producent[]] = ['deheus', 'unknown'];
export const mainCategories: [MainCategory, ...MainCategory[]] = [
	'cattle',
	'pigs',
	'poultry',
	'backyard'
];

export const orderStatus: [OrderStatus, ...OrderStatus[]] = ['pending', 'completed', 'canceled'];

export const paymentStatus: [PaymentStatus, ...PaymentStatus[]] = [
	'pending',
	'completed',
	'canceled'
];

export const deliveryStatus: [DeliveryStatus, ...DeliveryStatus[]] = [
	'pending',
	'shipped',
	'delivered',
	'canceled'
];

export const discountTypes: [DiscountType, ...DiscountType[]] = ['percentage', 'fixed'];
