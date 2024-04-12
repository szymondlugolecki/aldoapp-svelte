import { orderEventsList } from '$lib/client/constants';
import type { OrderEvent } from '$types';
import type { PushMessageWithContent } from '../functions/push';

export const pushMessages = {
	'order-created': {
		title: 'Nowe zamówienie',
		message: 'Będziemy informować Cię o zmianach statusie zamówienia'
	},
	subscribed: {
		title: 'Pomyślnie zasubskrybowano',
		message: 'Będziemy informować Cię o ważnych rzeczach'
	}
} as const;

export const orderPushMessages: Record<OrderEvent, string> = {
	IS_AVAILABLE_FOR_PICKUP: orderEventsList['IS_AVAILABLE_FOR_PICKUP'],
	IS_AVAILABLE_FOR_SHIPMENT: orderEventsList['IS_AVAILABLE_FOR_SHIPMENT'],
	IS_UNAVAILABLE: orderEventsList['IS_UNAVAILABLE'],
	READY_FOR_PICKUP: orderEventsList['READY_FOR_PICKUP'],
	CANCEL: 'Anulowano zamówienie',
	SHIPPED: 'Zamówienie jest w drodze',
	DELIVERED: 'Zamówienie zostało dostarczone',
	PICKED_UP: 'Zamówienie zostało odebrane'
	// KEEP_WAITING: 'Damy Ci znać, gdy produkty będą dostępne',
} as const;

export const getPushMessage = (key: keyof typeof pushMessages): PushMessageWithContent => {
	return {
		data: pushMessages[key],
		options: {
			ttl: 129600
		}
	};
};

export const getOrderStatusPushMessage = (event: OrderEvent): PushMessageWithContent => {
	const message = orderPushMessages[event];
	return {
		data: {
			title: 'Zamówienie',
			message
		},
		options: {
			ttl: 129600
		}
	};
};

export const orderStatusEmailDescription = (event: OrderEvent) => {
	switch (event) {
		case 'CANCEL':
			return 'Zamówienie zostało anulowane';
		case 'IS_AVAILABLE_FOR_PICKUP':
			return 'Zweryfikowaliśmy Twoje zamówienie. Teraz przystąpimy do realizacji';
		case 'IS_AVAILABLE_FOR_SHIPMENT':
			return 'Zweryfikowaliśmy Twoje zamówienie. Teraz przystąpimy do realizacji';
		case 'IS_UNAVAILABLE':
			return 'Nie udało się zweryfikować zamówienia. Skontaktujemy się z Tobą.';
		case 'DELIVERED':
			return 'Zamówienie zostało zrealizowane. Dziękujemy za zakupy.';
		// case 'KEEP_WAITING':
		// 	return 'Damy Ci znać, gdy produkty będą dostępne';
		case 'READY_FOR_PICKUP':
			return 'Zamówienie jest gotowe do odbioru';
		case 'PICKED_UP':
			return 'Zamówienie zostało zrealizowane. Dziękujemy za zakupy.';
		case 'SHIPPED':
			return 'Twoja przesyłka jest w drodze';
		default:
			return '';
	}
};

export const orderStatusEmailPreview = (event: OrderEvent) => {
	switch (event) {
		case 'CANCEL':
			return 'Anulowano zamówienie';
		case 'IS_AVAILABLE_FOR_PICKUP':
			return 'Zamówienie zweryfikowane';
		case 'IS_AVAILABLE_FOR_SHIPMENT':
			return 'Zamówienie zweryfikowane';
		case 'IS_UNAVAILABLE':
			return 'Nie udało się zweryfikować zamówienia';
		case 'DELIVERED':
			return 'Dostarczono zamówienie';
		case 'SHIPPED':
			return 'Przesyłka jest w drodze';
		case 'READY_FOR_PICKUP':
			return 'Zamówienie gotowe do odbioru';
		case 'PICKED_UP':
			return 'Odebrano zamówienie';
		default:
			return '';
		// case 'KEEP_WAITING':
		// 	return 'Oczekiwanie na dostępność produktów';
	}
};
