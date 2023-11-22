// export const areObjectsEqual = <T>(obj1: T, obj2: T) => {
// 	return JSON.stringify(obj1) === JSON.stringify(obj2);
// };

import {
	mainCategories,
	orderStatus,
	subcategories,
	type OrderStatus,
	type MainCategory,
	type Producent,
	producents
} from '$lib/client/constants/dbTypes';
import type { Subcategory } from '$types';
import { and, type SQL } from 'drizzle-orm';

export const sleep = (s: number) => new Promise((resolve) => setTimeout(resolve, s * 1000));

export const clauseConcat = (...clauses: (SQL<unknown> | undefined | string | 0)[]) => {
	const filteredClauses = clauses.filter((clause) => !!clause) as SQL<unknown>[];
	return and(...filteredClauses);
};

export const extractParams = <T extends string>(url: URL, sortableColumns?: T[]) => {
	// URL Params
	const page = !isNaN(Number(url.searchParams.get('strona')))
		? Math.max(Number(url.searchParams.get('strona')), 1)
		: 1;
	const sortBy = url.searchParams.get('sort')?.toLowerCase() as T | undefined;
	const desc = url.searchParams.get('desc')?.toLowerCase();
	const status = url.searchParams.get('status_zamowienia')?.toLowerCase() as
		| OrderStatus
		| undefined;
	const priceMin = Number(url.searchParams.get('cena_min') || undefined);
	const priceMax = Number(url.searchParams.get('cena_max') || undefined);
	const customerId = url.searchParams.get('klient_id') || undefined;
	const cartOwnerId = url.searchParams.get('zleceniodawca_id') || undefined;
	const category = url.searchParams.get('category');
	const subcategory = url.searchParams.get('subcategory');
	const producent = url.searchParams.get('producent');

	// Sorting
	const descBool: boolean | null =
		typeof desc === 'string' && ['true', 'false'].includes(desc) ? JSON.parse(desc) : null;
	const validSort = !!sortableColumns && !!sortBy && sortableColumns.includes(sortBy as T);
	const sort =
		descBool !== null && validSort
			? {
					by: sortBy,
					descending: descBool
			  }
			: null;

	// Order
	const validStatus = orderStatus.map((s) => s.toLowerCase()).includes(status as OrderStatus);
	const order = {
		status: validStatus ? status : undefined,
		priceMin: !isNaN(priceMin) ? priceMin : undefined,
		priceMax: !isNaN(priceMax) ? priceMax : undefined,
		customerId: customerId !== 'all' ? customerId : undefined,
		cartOwnerId: cartOwnerId !== 'all' ? cartOwnerId : undefined
	};

	// Product
	const isValidCategory =
		!!category &&
		typeof category === 'string' &&
		mainCategories.includes(category.toLowerCase() as MainCategory);

	const isValidSubcategory =
		!!subcategory &&
		typeof subcategory === 'string' &&
		subcategories.includes(subcategory.toLowerCase() as Subcategory);

	const isProperProducent =
		!!producent &&
		typeof producent === 'string' &&
		producents.includes(producent.toLowerCase() as Producent);

	const product = {
		category: isValidCategory ? (category as MainCategory) : undefined,
		subcategory: isValidSubcategory ? subcategory : undefined,
		producent: isProperProducent ? (producent as Producent) : undefined,
		priceMin: !isNaN(priceMin) ? priceMin : undefined,
		priceMax: !isNaN(priceMax) ? priceMax : undefined
	};

	return {
		page,
		sort,
		order,
		product
	};
};

export const productURLParser = (name: string, symbol: string) => {
	return encodeURIComponent(
		`${name}-${symbol}`.replaceAll('  ', ' ').replaceAll(' ', '-').toLowerCase().trim()
	);
};
