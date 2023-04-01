export type Producents = 'deheus' | 'unknown';
export type MainCategories = 'cattle' | 'poultry' | 'backyard';

export type PaymentMethods = 'cash' | 'dotpay';
export type DeliveryMethods = 'personal-pickup' | 'dpd';

export type OrderStatus = 'pending' | 'completed' | 'canceled' | 'refund-request' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'canceled' | 'refunded';
export type DeliveryStatus = 'pending' | 'shipped' | 'delivered' | 'returned' | 'canceled';

export const paymentMethods: [PaymentMethods, ...PaymentMethods[]] = ['cash'];
export const deliveryMethods: [DeliveryMethods, ...DeliveryMethods[]] = ['personal-pickup', 'dpd'];

export const producents: [Producents, ...Producents[]] = ['deheus', 'unknown'];
export const mainCategories: [MainCategories, ...MainCategories[]] = [
	'cattle',
	'poultry',
	'backyard'
];

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
