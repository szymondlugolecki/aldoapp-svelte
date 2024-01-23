// import wretch from 'wretch';
import type { Role } from '$lib/server/db/schemas/users';
import type { ShortService, Outlets, OrderEvent } from '$types';
import type { DeliveryMethod, PaymentMethod, orderStatus } from './dbTypes';
// import toast from 'svelte-french-toast';

type SalesmenMenuType = {
	name: string;
	description: string;
	locations: Outlets[];
	href: ShortService;
};

export const producentsList = {
	deheus: 'De Heus',
	unknown: 'Nieznany'
} as const;

export const paymentMethodsList: Record<PaymentMethod, string> = {
	cash: 'Gotówka/Przedpłata',
	transfer: 'Przelew bankowy'
} as const;

export const deliveryMethodsList: Record<DeliveryMethod, string> = {
	'personal-delivery': 'Kierowca ALDO',
	'personal-pickup': 'Odbiór osobisty'
} as const;

export const orderStatusList: Record<(typeof orderStatus)[number], string> = {
	delivered: 'Dostarczono',
	awaitingDelivery: 'Wysłano',
	awaitingOffice: 'Weryfikowanie dostępności',
	awaitingCustomerDecision: 'Oczekuje na decyzję klienta',
	awaitingShipment: 'Oczekuje na wysyłkę',
	cancelled: 'Anulowano'
} as const;

export const orderEventsList: Record<OrderEvent, string> = {
	IS_AVAILABLE: 'Zweryfikowano zamówienie',
	IS_UNAVAILABLE: 'Produkty są niedostępne',
	CANCEL: 'Anuluj zamówienie',
	KEEP_WAITING: 'Poczekaj na dostępność',
	SHIPPED: 'Wysłano',
	DELIVERED: 'Dostarczono'
	// PAYMENT_RECEIVED: 'Otrzymano płatność'
};

export const fodderNames = {
	bydlo: 'Bydło',
	trzoda: 'Trzoda',
	drob: 'Drób',
	'hodowla-przydomowa': 'Hodowla przydomowa'
} as const;

export const fodderCategories2 = {
	bydlo: {
		'pasze-krowy-mleczne': 'Pasze dla krów mlecznych',
		'mieszanki-paszowe-bydlo': 'Mieszanki paszowe dla bydła',
		'premiksy-bydlo': 'Premiksy dla bydła',
		'koncentraty-krowy-mleczne-opasy': 'Koncentraty dla krów mlecznych i opasów',
		'pasze-cieleta': 'Pasze dla cieląt',
		'mleko-preparaty-mlekozastepcze': 'Preparaty mlekozastępcze dla cieląt / mleko dla cieląt'
	},
	drob: {
		'pasze-nioski': 'Pasze dla niosek',
		'pasze-gesi-kaczki': 'Pasze dla gęsi i kaczek',
		'pasze-brojler': 'Pasze dla brojlerów',
		'pasze-indyk': 'Pasze dla indyków'
	},
	trzoda: {
		'pasze-tucznik': 'Pasze dla tuczników',
		'plynne-zywienie-swinie': 'Płynne żywienie świń',
		'pasze-prosieta': 'Pasze dla prosiąt',
		'pasze-lochy': 'Pasze dla loch'
	},
	'hodowla-przydomowa': {}
} as const;

export const fodderCategories = {
	bydlo: [
		{
			name: 'Pasze dla krów mlecznych',
			id: 'milk-cows-fodder'
		},
		{
			name: 'Mieszanki paszowe dla bydła',
			id: 'cow-fodder-mixes'
		},
		{
			name: 'Premiksy dla bydła',
			id: 'cow-premixes'
		},
		{
			name: 'Koncentraty dla krów mlecznych i opasów',
			id: 'cow-concentrates'
		},
		{
			name: 'Pasze dla cieląt',
			id: 'calfs-fodder'
		},
		{
			name: 'Preparaty mlekozastępcze dla cieląt / mleko dla cieląt',
			id: 'calfs-milk-replacements'
		}
	],
	drob: [
		{
			name: 'Pasze dla niosek',
			id: 'layer-chickens-fodder'
		},
		{
			name: 'Pasze dla gęsi i kaczek',
			id: 'geese-and-ducks-fodder'
		},
		{
			name: 'Pasze dla brojlerów',
			id: 'broilers-fodder'
		},
		{
			name: 'Pasze dla indyków',
			id: 'turkeys-fodder'
		}
	],
	trzoda: [
		{
			name: 'Pasze dla tuczników',
			id: 'porkers-fodder'
		},
		{
			name: 'Płynne żywienie świń',
			id: 'liquid-pig-feed'
		},
		{
			name: 'Pasze dla prosiąt',
			id: 'piglets-fodder'
		},
		{
			name: 'Pasze dla loch',
			id: 'sows-fodder'
		}
	],
	'hodowla-przydomowa': []
} as const;

export const salesmenMenu: SalesmenMenuType[] = [
	{
		name: 'Dział pasz',
		description: 'Pasze i koncentraty dla bydła, drobiu, trzody chlewnej. Surowce.',
		locations: ['surowe'],
		href: 'pasze'
	},
	{
		name: 'Market',
		description: 'Części do ciągników i maszyn, artykuły do produkcji rolnej.',
		locations: ['myszyniec', 'surowe', 'ełk'],
		href: 'market'
	},
	{
		name: 'Serwis',
		description:
			'Autoryzowany serwis ciągników i maszyn rolniczych Kubota oraz innych marek z oferty ALDO.',
		locations: ['myszyniec', 'surowe', 'ełk'],
		href: 'serwis'
	},

	{
		name: 'Dział maszyn',
		description: 'Wysokiej jakości maszyny rolnicze i komunalne renomowanych marek.',
		locations: ['myszyniec', 'wójtowo', 'ełk'],
		href: 'maszyny'
	},
	{
		name: 'Komis maszyn',
		description: 'Szeroki wybór maszyn używanych różnych producentów.',
		locations: ['myszyniec'],
		href: 'komis'
	},
	{
		name: 'Stacja paliw',
		description: 'Paliwa z gwarancją jakości Orlen.',
		locations: ['surowe'],
		href: 'paliwa'
	},
	{
		name: 'Wulkanizacja',
		description: 'Profesjonalny serwis i montaż opon.',
		locations: ['surowe'],
		href: 'wulkanizacja'
	}
];

/*

[
	['surowe', [['29 77 27 666'], ['what']]],
	['surowe', [['29 77 27 666'], ['what']]]
]

*/

export const nutritionalAdvisors = [
	{
		name: 'Mariusz Deptuła',
		phone: ['662 393 252']
	},
	{
		name: 'Rafał Kuskowski',
		phone: ['668 521 107']
	},
	{
		name: 'Karol Denkiewicz',
		phone: ['797 503 691']
	},
	{
		name: 'Paweł Drejer',
		phone: ['519 494 655']
	}
];

export const contactInfo = {
	'dział pasz': {
		surowe: [['29 77 27 666'], ['pasze@aldo.agro.pl']]
	},
	market: {
		surowe: [['29 77 27 652'], ['waldemar.skorupski@aldo.agro.pl']],
		myszyniec: [['29 77 21 986'], ['ewa.dabrowska@aldo.agro.pl']],
		ełk: [['519 619 796', '87 73 32 401', '502 934 174'], ['arkadiusz.kukier@aldo.agro.pl']]
	},
	serwis: {
		surowe: [['29 77 27 662', '692 448 240'], ['pawel.duszak@aldo.agro.pl']],
		myszyniec: [['696 655 330', '29 77 21 983'], ['serwis@aldo.agro.pl']],
		ełk: [['511 199 208', '87 52 00 038'], ['piotr.makowski@aldo.agro.pl']]
	},
	'dział maszyn': {
		myszyniec: [['29 77 21 980'], ['myszyniec@aldo.agro.pl']],
		ełk: [['87 520 00 38'], ['elk@aldo.agro.pl']],
		wójtowo: [['89 741 00 98'], ['wojtowo@aldo.agro.pl']],
		ciechanów: [['23 673 00 00', '519 494 664'], ['ciechanow@aldo.agro.pl']]
	},
	'komis maszyn': {
		myszyniec: [['881 959 860', '29 77 21 991'], ['komis@aldo.agro.pl']]
	},
	'stacja paliw': {
		surowe: [['29 77 27 652'], ['waldemar.skorupski@aldo.agro.pl']]
	},
	wulkanizacja: {
		surowe: [['29 77 27 662', '692 448 240'], ['pawel.duszak@aldo.agro.pl']]
	}
} as const;
type Service = keyof typeof contactInfo;

export const serviceNames: Record<ShortService, Service> = {
	komis: 'komis maszyn',
	market: 'market',
	maszyny: 'dział maszyn',
	paliwa: 'stacja paliw',
	pasze: 'dział pasz',
	serwis: 'serwis',
	wulkanizacja: 'wulkanizacja'
};

export const roleNames: Record<Role, string> = {
	banned: 'Zablokowany',
	customer: 'Klient',
	driver: 'Kierowca',
	adviser: 'Doradca',
	admin: 'Admin'
};

export const roleColors: Record<Role, string> = {
	banned: 'bg-gray-500',
	customer: 'bg-sky-500',
	driver: 'bg-green-400',
	adviser: 'bg-orange-400',
	admin: 'bg-red-700'
};

export const services: ShortService[] = [
	'pasze',
	'komis',
	'market',
	'paliwa',
	'maszyny',
	'serwis',
	'wulkanizacja'
];

// export const wretchClient = wretch('/api')
// 	.resolve((_) => _.forbidden(() => toast.error('Nie masz uprawnień')))
// 	.resolve((_) => _.notFound(() => toast.error('Nie znaleziono')))
// 	.resolve((_) => _.unauthorized(() => toast.error('Nie jesteś zalogowany')))
// 	.resolve((_) =>
// 		_.error(400, (e) => {
// 			toast.error(e.json.message || 'Niespodziewany błąd');
// 		})
// 	);
