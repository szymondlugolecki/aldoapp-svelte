import type { Address } from '$lib/server/db/schemas/orders';
import type { ExtendedCategory, ExtendedSubcategory, Role, Subcategory } from '$types';

import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ComponentType, SvelteComponent } from 'svelte';
import { flexRender as flexRenderOrig } from '@tanstack/svelte-table';
import { userRoles, type MainCategory } from '../constants/dbTypes';

import { user$ } from '../schemas';
import { fodderCategories2, roleNames } from '../constants';
import type { Optional } from '$types/UtilityTypes';

export const getAvailableRoleNames = (userRole: Role) => {
	if (userRole === 'admin') {
		return roleNames;
	}
	if (getRoleRank(userRole) >= 1) {
		const roleNamesCopy: Optional<typeof roleNames, 'admin'> = { ...roleNames };
		delete roleNamesCopy.admin;
		return roleNamesCopy;
	}
	return {} as typeof roleNames;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (callback: Function, wait = 300) => {
	let timeout: ReturnType<typeof setTimeout>;

	return (...args: any[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => callback(...args), wait);
	};
};

export const getSubcategories = (category?: ExtendedCategory | MainCategory) => {
	if (!category || category === 'all') {
		return [];
	}
	return Object.keys(fodderCategories2[category]) as Subcategory[];
};

export const getSubcategoryName = (
	category: ExtendedCategory,
	subcategory: ExtendedSubcategory
) => {
	if (subcategory === 'all') {
		return 'Wszystkie';
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return fodderCategories2[category][subcategory] as string;
};

export const newCategoryUrl = (searchParams: URLSearchParams, category: string) => {
	const url = new URLSearchParams(searchParams);
	url.set('category', category);
	url.delete('subcategory');
	return `/sklep?${url.toString()}`;
};

export const newSubcategoryUrl = (searchParams: URLSearchParams, subcategory: string) => {
	const url = new URLSearchParams(searchParams);
	url.set('subcategory', subcategory);
	url.delete('category');
	return `/sklep?${url.toString()}`;
};

export const flexRender = <P extends Record<string, any>, C = any>(
	component: C,
	props: P
): ComponentType<SvelteComponent> =>
	flexRenderOrig(component, props) as ComponentType<SvelteComponent>;

export const phoneParser = (phone: string | number) => {
	return Number(phone).toLocaleString().split(',').join(' ');
};

export const safeParseJSON = (str: string) => {
	try {
		return JSON.parse(str);
	} catch (e) {
		return undefined;
	}
};

export const parsePLN = (amount: string | number) => {
	const formatted = new Intl.NumberFormat('pl-PL', {
		style: 'currency',
		currency: 'PLN'
	}).format(Number(amount));
	return formatted;
};

const splitAddress = (address: Address) => {
	const { street, city, zipCode } = address;
	return [`${street}\n${city}`, zipCode].join(', ');
};

export const parseAddress = (address: unknown): string | null => {
	if (!address || !(typeof address === 'string' || typeof address === 'object')) return null;

	if (typeof address === 'string') {
		if (!safeParseJSON(address)) return null;
		const parsedAddress = JSON.parse(address) as Address;
		if (!user$.address.safeParse(parsedAddress).success) {
			return null;
		}

		if (Object.values(parsedAddress).every((val) => !val)) return null;

		return splitAddress(parsedAddress);
	}

	if (!user$.address.safeParse(address).success) {
		return null;
	}

	if (Object.values(address).every((val) => !val)) return null;

	return splitAddress(address as Address);
};

export const getRoleRank = (role: Role) => {
	switch (role) {
		case 'banned':
			return -1;
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

export const isAtLeastModerator = (role: Role) => {
	if (getRoleRank(role) >= 1) return true;
	return false;
};

export const capitalize = (text: string) => {
	return text.charAt(0).toUpperCase() + text.slice(1);
};

export const textCrusher = (text: string) => {
	return text.replace(/ /g, '').toLowerCase().trim();
};

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isCorrectRole = (cellValue: string | boolean | Address): cellValue is Role => {
	return userRoles.includes(cellValue as Role);
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
				minute: '2-digit'
			});
		case 'long':
			return date.toLocaleDateString('pl-PL', {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
	}
};

// export const arrayUniqueByKey = <T>(arr: T[], key: keyof T) =>
// 	[
// 		...new Map(
// 			Array.isArray(arr) ? arr.filter(Boolean).map((item) => [item[key], item]) : []
// 		).values()
// 	] as T[];
