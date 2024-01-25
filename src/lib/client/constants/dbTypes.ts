import type { OrderEvent, Subcategory } from '$types';
import { fodderCategories2 } from '.';

export type UserRole = 'banned' | 'customer' | 'adviser' | 'driver' | 'admin';

export type Producent = 'deheus' | 'unknown';
export type MainCategory = 'bydlo' | 'drob' | 'trzoda' | 'hodowla-przydomowa';

export type PaymentMethod = 'cash' | 'transfer';
export type DeliveryMethod = 'personal-delivery' | 'personal-pickup';

export type OrderStatus =
	| 'awaitingOffice'
	| 'preparingForPickup'
	| 'awaitingPickup'
	| 'awaitingShipment'
	| 'awaitingDelivery'
	| 'cancelled'
	| 'delivered'
	| 'pickedUp';
export type CartStatus = 'active' | 'inactive';

export type DiscountType = 'percentage' | 'fixed';
export type ApplicableProducts = string[];

export const userRoles: [UserRole, ...UserRole[]] = [
	'banned',
	'customer',
	'driver',
	'adviser',
	'admin'
];

export const paymentMethods: [PaymentMethod, ...PaymentMethod[]] = ['cash', 'transfer'];
export const deliveryMethods: [DeliveryMethod, ...DeliveryMethod[]] = [
	'personal-delivery',
	'personal-pickup'
];

export const producents: [Producent, ...Producent[]] = ['deheus', 'unknown'];
export const mainCategories: [MainCategory, ...MainCategory[]] = [
	'bydlo',
	'trzoda',
	'drob',
	'hodowla-przydomowa'
];

export const orderStatus: [OrderStatus, ...OrderStatus[]] = [
	'awaitingOffice',
	'preparingForPickup',
	'awaitingPickup',
	'awaitingShipment',
	'awaitingDelivery',
	'cancelled',
	'delivered',
	'pickedUp'
];

export const orderEvents: [OrderEvent, ...OrderEvent[]] = [
	'DELIVERED',
	'SHIPPED',
	'CANCEL',
	'IS_UNAVAILABLE',
	'READY_FOR_PICKUP',
	'PICKED_UP',
	'IS_AVAILABLE_FOR_SHIPMENT',
	'IS_AVAILABLE_FOR_PICKUP'
	// 'KEEP_WAITING' // till products are available
	// 'PAYMENT_RECEIVED',
];

export const cartStatus: [CartStatus, ...CartStatus[]] = ['active', 'inactive'];

export const discountTypes: [DiscountType, ...DiscountType[]] = ['percentage', 'fixed'];

export const subcategories = Object.values(fodderCategories2).flatMap((x) =>
	Object.keys(x)
) as Subcategory[];
