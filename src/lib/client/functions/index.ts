import type { Address, Order } from '$lib/server/db/schemas/orders';
import type {
	ProductAuthor,
	// ProductFilter,
	// ProductWithAuthorAndImage,
	User,
	UserFilter,
	OrderFilter,
	Category,
	Role
} from '$types';
import type { Thing, WithContext } from 'schema-dts';
import { fodderCategories, roleNames } from '../constants';
import { cubicOut } from 'svelte/easing';

import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ComponentType, SvelteComponent } from 'svelte';
import { flexRender as flexRenderOrig } from '@tanstack/svelte-table';
import { userRoles } from '../constants/dbTypes';
import { userPropertySchemas } from '../schemas/users';
import { styleToString } from '@melt-ui/svelte/internal/helpers';
import type { TransitionConfig } from 'svelte/transition';
import { betterZodParse } from './betterZodParse';

export type Schema = Thing | WithContext<Thing>;

export const flexRender = <P extends Record<string, any>, C = any>(
	component: C,
	props: P
): ComponentType<SvelteComponent> =>
	flexRenderOrig(component, props) as ComponentType<SvelteComponent>;

export const addressParser = (address: Address | string | null) => {
	if (!address) return 'Brak';
	const jsonAddress = typeof address === 'string' ? isJSON<Address>(address) : address;
	const [correctAddress, addressErrors] = betterZodParse(userPropertySchemas.address, jsonAddress);

	if (addressErrors || !correctAddress) {
		return 'Brak';
	}

	if (Object.values(correctAddress).every((value) => !value)) return 'Brak';
	return `${correctAddress.street}\n${correctAddress.city}, ${correctAddress.zipCode}`;
};

export const getRoleRank = (role: Role) => {
	switch (role) {
		case 'customer':
			return 0;
		case 'driver':
			return 1;
		case 'adviser':
			return 2;
		case 'admin':
			return 3;
	}
};

export const getGeneralRole = (role: Role) => {
	if (isJustModerator(role)) return 'moderator';
	if (role === 'admin') return 'admin';
	return 'customer';
};

export const isJustModerator = (role: Role) => {
	if (getRoleRank(role) > 0 && role !== 'admin') return true;
	return false;
};

export const isAtLeastModerator = (role: Role) => {
	if (getRoleRank(role) > 0) return true;
	return false;
};

export const serializeSchema = (thing: Schema) => {
	return `<script type="application/ld+json">${JSON.stringify(thing, null, 2)}</script>`;
};

export const productURLParser = (name: string, symbol: string) => {
	return encodeURIComponent(
		`${name}-${symbol}`.replaceAll('  ', ' ').replaceAll(' ', '-').toLowerCase().trim()
	);
};

export const getUserRoleByName = (role: string) => {
	return Object.entries(roleNames).reduce<Role | undefined>((acc, [key, value]) => {
		if (value === role) return key as Role;
		return acc;
	}, undefined);
};

export const capitalize = (text: string) => {
	return text.charAt(0).toUpperCase() + text.slice(1);
};

export const textCrusher = (text: string) => {
	return text.replace(/ /g, '').toLowerCase().trim();
};

export const isValidObject = (obj: unknown): obj is Record<string, unknown> => {
	if (obj && !Array.isArray(obj) && typeof obj === 'object') return true;
	return false;
};

export const userFilterSearchInputFilter = (
	{ fullName, email }: ProductAuthor,
	searchInput: string
) => {
	if (
		textCrusher(fullName).includes(textCrusher(searchInput)) ||
		textCrusher(email).includes(textCrusher(searchInput))
	)
		return true;
	return false;
};

export const applyOrdersFilters = (orders: Order[], filter: OrderFilter) => {
	const orderStatus = (order: Order) => {
		if (filter.order === order.status) return true;
		return false;
	};

	return orders.filter(orderStatus);
};

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isCorrectRole = (cellValue: string | boolean | Address): cellValue is Role => {
	return userRoles.includes(cellValue as Role);
};

export const isJSON = <T>(str: unknown) => {
	let json: unknown;
	try {
		json = JSON.parse(str as string);
	} catch (e) {
		return false;
	}
	return json as T;
};

const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
	const [minA, maxA] = scaleA;
	const [minB, maxB] = scaleB;

	const percentage = (valueA - minA) / (maxA - minA);
	const valueB = percentage * (maxB - minB) + minB;

	return valueB;
};

type FlyAndScaleOptions = {
	y: number;
	start: number;
	duration?: number;
};

export const flyAndScale = (node: HTMLElement, options: FlyAndScaleOptions): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	return {
		duration: options.duration ?? 150,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [options.y, 0]);
			const scale = scaleConversion(t, [0, 1], [options.start, 1]);

			return styleToString({
				transform: `${transform} translate3d(0, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export const isCorrectAddress = (cellValue: string | boolean | Address): cellValue is Address => {
	const jsonAddress = typeof cellValue === 'string' ? isJSON<Address>(cellValue) : cellValue;
	if (!jsonAddress) return false;
	return userPropertySchemas.address.safeParse(jsonAddress).success;
};

export const applyUserFilters = (users: User[], filter: UserFilter) => {
	const bannedFilter = (user: User) => {
		if (filter.blocked && filter.nonblocked) return true;
		else if (user.access && filter.nonblocked) return true;
		else if (!user.access && filter.blocked) return true;
		return false;
	};

	const roleFilter = (user: User) => {
		if (filter.roles.admin && user.role === 'admin') return true;
		if (filter.roles.adviser && user.role === 'adviser') return true;
		if (filter.roles.driver && user.role === 'driver') return true;
		if (filter.roles.customer && user.role === 'customer') return true;
		return false;
	};

	// Since date should be the very first milisecond of the day
	const sinceDate = filter.since ? new Date(new Date(filter.since).setHours(0, 0, 0, 1)) : null;
	// Until date should be the very last milisecond of the day
	const untilDate = filter.until
		? new Date(new Date(filter.until).setHours(23, 59, 59, 999))
		: new Date(new Date().setHours(23, 59, 59, 999));

	const dateFilter = (user: User) => {
		if (!sinceDate) return true;
		if (!user.createdAt) return false;
		// Since date was provided
		// Check if user is in the right range
		if (user.createdAt >= sinceDate && user.createdAt <= untilDate) return true;
		return false;
	};

	return users.filter(bannedFilter).filter(roleFilter).filter(dateFilter);
};

// export const applyProductFilters = (
// 	products: ProductWithAuthorAndImage[],
// 	filter: ProductFilter,
// 	searchInput: string
// ) => {
// 	const authorsFilter = (product: ProductWithAuthorAndImage) => {
// 		if (!filter.excludedUserIds.includes(product.author.id)) return true;
// 		return false;
// 	};

// 	// Since date should be the very first milisecond of the day
// 	const sinceDate = filter.since ? new Date(new Date(filter.since).setHours(0, 0, 0, 1)) : null;
// 	// Until date should be the very last milisecond of the day
// 	const untilDate = filter.until
// 		? new Date(new Date(filter.until).setHours(23, 59, 59, 999))
// 		: new Date(new Date().setHours(23, 59, 59, 999));

// 	const dateFilter = (product: ProductWithAuthorAndImage) => {
// 		if (!sinceDate) return true;
// 		// Since date was provided
// 		// Check if user is in the right range
// 		if (product.createdAt >= sinceDate && product.createdAt <= untilDate) return true;
// 		return false;
// 	};

// 	const productSearchFilter = (product: ProductWithAuthorAndImage) =>
// 		textCrusher(product.name).includes(textCrusher(searchInput)) ||
// 		textCrusher(product.description || '').includes(textCrusher(searchInput)) ||
// 		textCrusher(product.symbol).includes(textCrusher(searchInput));

// 	return products.filter(dateFilter).filter(authorsFilter).filter(productSearchFilter);
// };

export const arrayUniqueByKey = <T>(arr: T[], key: keyof T) =>
	[
		...new Map(
			Array.isArray(arr) ? arr.filter(Boolean).map((item) => [item[key], item]) : []
		).values()
	] as T[];

export const isProperCategory = (category: string): category is Category => {
	return category in fodderCategories;
};

export const dateParser = (date: Date, format: 'short' | 'medium' | 'long') => {
	switch (format) {
		case 'short':
			return date.toLocaleDateString('pl-PL', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			});
		case 'medium':
			return date.toLocaleDateString('pl-PL', {
				month: 'numeric',
				day: 'numeric',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			});
		case 'long':
			return date.toLocaleDateString('pl-PL', {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			});
		default:
			return date.toLocaleDateString('pl-PL', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			});
			break;
	}
};
