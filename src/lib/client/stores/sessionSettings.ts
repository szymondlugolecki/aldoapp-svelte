import type { DeliveryMethod, PaymentMethod } from '../constants/dbTypes';
import type { Address } from '$lib/server/db/schemas/orders';
import { writable } from 'svelte/store';

type Settings = {
	paymentMethod: PaymentMethod;
	deliveryMethod: DeliveryMethod;
	useCustomerAddress: boolean;
	customAddress: Address;
};

const emptyDeliveryAddress = {
	street: '',
	zipCode: '',
	city: ''
};

export const settings = writable<Settings>({
	paymentMethod: 'cash',
	deliveryMethod: 'personal-delivery',
	useCustomerAddress: false,
	customAddress: emptyDeliveryAddress
});

export const setPaymentMethod = (method: PaymentMethod) => {
	settings.update((oldSettings) => ({
		...oldSettings,
		paymentMethod: method
	}));
};

export const setDeliveryMethod = (method: DeliveryMethod) => {
	settings.update((oldSettings) => ({
		...oldSettings,
		deliveryMethod: method
	}));
};
