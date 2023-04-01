export type Producent = 'deheus' | 'unknown';
export type MainCategory = 'cattle' | 'poultry' | 'backyard';

export type PaymentMethod = 'cash' | 'dotpay';
export type DeliveryMethod = 'personal-pickup' | 'personal-delivery';

export type OrderStatus = 'pending' | 'completed' | 'canceled' | 'refund-request' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'canceled' | 'refunded';
export type DeliveryStatus = 'pending' | 'shipped' | 'delivered' | 'returned' | 'canceled';

export const paymentMethods: [PaymentMethod, ...PaymentMethod[]] = ['cash'];
export const deliveryMethods: [DeliveryMethod, ...DeliveryMethod[]] = [
	'personal-pickup',
	'personal-delivery'
];

export const producents: [Producent, ...Producent[]] = ['deheus', 'unknown'];
export const mainCategories: [MainCategory, ...MainCategory[]] = ['cattle', 'poultry', 'backyard'];

export const orderStatus: [OrderStatus, ...OrderStatus[]] = [
	'pending',
	'completed',
	'canceled',
	'refund-request',
	'refunded'
];
export const paymentStatus: [PaymentStatus, ...PaymentStatus[]] = [
	'pending',
	'completed',
	'canceled',
	'refunded'
];

export const deliveryStatus: [DeliveryStatus, ...DeliveryStatus[]] = [
	'pending',
	'shipped',
	'delivered',
	'returned',
	'canceled'
];
