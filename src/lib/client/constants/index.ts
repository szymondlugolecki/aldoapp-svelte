import type { ShortService, Outlets, Role, OrderRowType } from '$types';
import type { DeliveryStatus, MainCategory, OrderStatus, PaymentStatus } from './dbTypes';

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

export const productTable = {
	image: 'Zdjęcie',
	name: 'Nazwa i symbol',
	description: 'Opis',
	author: 'Dodał(a)',
	action: 'Akcja',
	addedAt: 'Dodano',
	extra: 'Dodatkowe informacje',
	category: 'Kategoria'
} as const;

export const orderStatusList: Record<OrderStatus | PaymentStatus | DeliveryStatus, string> = {
	canceled: 'Anulowano',
	pending: 'W toku',
	delivered: 'Dostarczono',
	returned: 'Zwrócono',
	shipped: 'Wysłano',
	completed: 'Zakończono',
	'refund-request': 'Prośba o zwrot',
	refunded: 'Zwrócono'
} as const;

export const orderTable: Record<OrderRowType, string> = {
	products: 'Produkty',
	customer: 'Klient',
	status: 'Status',
	action: 'Akcja',
	createdAt: 'Utworzono'
};

export const userTable = {
	user: 'Użytkownik',
	role: 'Rola',
	action: 'Akcja',
	access: 'Dostęp',
	joined: 'Dołączył(a)',
	profile: 'Profil'
} as const;

export const fodderNames: Record<MainCategory, string> = {
	cattle: '🐮 Bydło',
	poultry: '🐣 Drób',
	pigs: '🐷 Trzoda',
	backyard: '🐶 Hodowla przydomowa'
} as const;

export const fodderCategories = {
	cattle: [
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
	poultry: [
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
	pigs: [
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

	backyard: []
} as const;

// export const appData = {
//     "title": "Navillus: Jamstack developers for hire",
//     "description": "We specialize in finding simple solutions to complex software problems. We value data-driven decisions and accessibility over this month's latest tech trends.",
//     "url": "https://navillus.dev",
//     "author": "Navillus",
//     "social": {
//         "twitter": "navillus_dev",
//         "twitter_card": "summary_large_image"
//     },
//     "company": {
//         "name": "Navillus"
//     }
// }

// export const websiteSchema = {
//     '@context': 'https://schema.org',
//     '@type': 'WebSite',
//     name: appData.title,
//     url: appData.url,
//     description: appData.description,
//     sameAs: [
//         `https://twitter.com/${appData.social.twitter}`
//     ],
// }

export const salesmenMenu: SalesmenMenuType[] = [
	{
		name: 'Dział pasz',
		description: 'Pasze dla bydła, drobiu i trzody chlewnej. Bez GMO',
		locations: ['surowe'],
		href: 'pasze'
	},
	{
		name: 'Market',
		description: 'Hurtownia rolnicza. Części rolnicze. Zamienniki',
		locations: ['myszyniec', 'surowe', 'ełk'],
		href: 'market'
	},
	{
		name: 'Serwis',
		description:
			'Wsparcie serwisowe. Części zamienne. Przegląd w autoryzowanym punkcie Kubota i Kverneland',
		locations: ['myszyniec', 'surowe', 'ełk'],
		href: 'serwis'
	},

	{
		name: 'Dział maszyn',
		description: 'Wysokiej jakości maszyny rolnicze i komunalne renomowanych marek',
		locations: ['myszyniec', 'wójtowo', 'ełk'],
		href: 'maszyny'
	},
	{
		name: 'Komis maszyn',
		description: 'Używany sprzęt wysokiej klasy w świetnym stanie technicznym',
		locations: ['myszyniec'],
		href: 'komis'
	},
	{
		name: 'Stacja paliw',
		description: 'Zatankuj na naszej stacji paliw',
		locations: ['surowe'],
		href: 'paliwa'
	}
];

export const contactInfo = {
	'dział pasz': {
		surowe: ['29 77 27 666']
	},
	market: {
		surowe: ['29 77 27 652'],
		myszyniec: ['29 77 21 986'],
		ełk: ['519 619 796', '87 73 32 401', '502 934 174']
	},
	serwis: {
		surowe: ['29 77 27 662', '692 448 240'],
		myszyniec: ['696 655 330', '29 77 21 983'],
		ełk: ['511 199 208', '87 52 00 038']
	},
	'dział maszyn': {
		myszyniec: ['29 77 21 980'],
		ełk: ['87 520 00 38'],
		wójtowo: ['89 741 00 98']
	},
	'komis maszyn': {
		myszyniec: ['881 959 860']
	},
	'stacja paliw': {
		surowe: ['29 77 27 652']
	}
} as const;
type Service = keyof typeof contactInfo;

export const serviceNames: Record<ShortService, Service> = {
	komis: 'komis maszyn',
	market: 'market',
	maszyny: 'dział maszyn',
	paliwa: 'stacja paliw',
	pasze: 'dział pasz',
	serwis: 'serwis'
};

export const shopMenu = [
	{
		name: 'Pasze i koncentraty dla bydła',
		description: 'Wolne od GMO',
		locations: ['Online', 'surowe']
	},
	{
		name: 'Pasze dla trzody chlewnej',
		description: 'Wolne od GMO',
		locations: ['Online', 'surowe']
	},
	{
		name: 'Pasze dla drobiu',
		description: 'Wolne od GMO',
		locations: ['Online', 'surowe']
	},
	{
		name: 'Dodatki i surowce żywieniowe',
		description: 'Wolne od GMO',
		locations: ['Online', 'surowe']
	}
];

export const badgeRoleColors = {
	customer: 'badge-info',
	moderator: 'badge-success',
	admin: 'badge-error'
};

export const roleNames: Record<Role, string> = {
	customer: 'Klient',
	moderator: 'Moderator',
	admin: 'Admin'
};

export const services: ShortService[] = ['pasze', 'komis', 'market', 'paliwa', 'maszyny', 'serwis'];
