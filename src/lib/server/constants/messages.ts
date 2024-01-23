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

export const orderPushMessages = {
	IS_AVAILABLE: orderEventsList['IS_AVAILABLE'],
	IS_UNAVAILABLE: orderEventsList['IS_UNAVAILABLE'],
	CANCEL: 'Anulowano zamówienie',
	KEEP_WAITING: 'Damy Ci znać, gdy produkty będą dostępne',
	SHIPPED: 'Zamówienie jest w drodze',
	DELIVERED: 'Zamówienie zostało dostarczone'
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
		case 'IS_AVAILABLE':
			return 'Zweryfikowaliśmy Twoje zamówienie. Teraz przystąpimy do realizacji';
		case 'IS_UNAVAILABLE':
			return 'Niestety przynajmniej jeden z zamówionych produktów nie jest dostępny w naszym magazynie. Podejmij decyzję o kontynuowaniu lub anulowaniu zamówienia na stronie zamówienia lub kontaktując się z nami.';
		case 'DELIVERED':
			return 'Zamówienie zostało zrealizowane. Dziękujemy za zakupy.';
		case 'KEEP_WAITING':
			return 'Damy Ci znać, gdy produkty będą dostępne';
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
		case 'IS_AVAILABLE':
			return 'Zamówienie zweryfikowane';
		case 'IS_UNAVAILABLE':
			return 'Produkty są niedostępne';
		case 'DELIVERED':
			return 'Dostarczono zamówienie';
		case 'KEEP_WAITING':
			return 'Oczekiwanie na dostępność produktów';
		case 'SHIPPED':
			return 'Przesyłka jest w drodze';
		default:
			return '';
	}
};
