import type { RoleColor, ShortService, Outlets } from '$types';
import type { Role } from '@prisma/client';

type SalesmenMenuType = {
	name: string;
	description: string;
	locations: Outlets[];
	href: ShortService;
};

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

export const roleColors: Record<Role, RoleColor> = {
	customer: 'blue',
	moderator: 'green',
	admin: 'red'
};

export const roleNames: Record<Role, string> = {
	customer: 'Klient',
	moderator: 'Moderator',
	admin: 'Admin'
};

export const services: ShortService[] = ['pasze', 'komis', 'market', 'paliwa', 'maszyny', 'serwis'];
