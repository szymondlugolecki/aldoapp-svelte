import { PUBLIC_WEBSITE_URL } from '$env/static/public';
import type {
	Category,
	ProductAuthor,
	ProductFilter,
	ProductWithAuthorAndImage,
	UserFilter
} from '$types';
import type { Product, User } from '@prisma/client';
import type { Thing, WithContext } from 'schema-dts';
import { fodderCategories } from '../constants';

export type Schema = Thing | WithContext<Thing>;

export const serializeSchema = (thing: Schema) => {
	return `<script type="application/ld+json">${JSON.stringify(thing, null, 2)}</script>`;
};

export const getProductImageURL = (image: string | null) => {
	if (!image) return null;
	return `${PUBLIC_WEBSITE_URL}/products/${image}`;
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

export const applyUserFilters = (users: User[], filter: UserFilter) => {
	const bannedFilter = (user: User) => {
		if (filter.blocked && filter.nonblocked) return true;
		else if (user.banned && filter.blocked) return true;
		else if (!user.banned && filter.nonblocked) return true;
		return false;
	};

	const roleFilter = (user: User) => {
		if (filter.roles.admin && user.role === 'admin') return true;
		if (filter.roles.moderator && user.role === 'moderator') return true;
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
		// Since date was provided
		// Check if user is in the right range
		if (user.createdAt >= sinceDate && user.createdAt <= untilDate) return true;
		return false;
	};

	return users.filter(bannedFilter).filter(roleFilter).filter(dateFilter);
};

export const applyProductFilters = (
	products: ProductWithAuthorAndImage[],
	filter: ProductFilter,
	searchInput: string
) => {
	const authorsFilter = (product: ProductWithAuthorAndImage) => {
		if (!filter.excludedUserIds.includes(product.author.id)) return true;
		return false;
	};

	// Since date should be the very first milisecond of the day
	const sinceDate = filter.since ? new Date(new Date(filter.since).setHours(0, 0, 0, 1)) : null;
	// Until date should be the very last milisecond of the day
	const untilDate = filter.until
		? new Date(new Date(filter.until).setHours(23, 59, 59, 999))
		: new Date(new Date().setHours(23, 59, 59, 999));

	const dateFilter = (product: ProductWithAuthorAndImage) => {
		if (!sinceDate) return true;
		// Since date was provided
		// Check if user is in the right range
		if (product.createdAt >= sinceDate && product.createdAt <= untilDate) return true;
		return false;
	};

	const productSearchFilter = (product: ProductWithAuthorAndImage) =>
		textCrusher(product.name).includes(textCrusher(searchInput)) ||
		textCrusher(product.description || '').includes(textCrusher(searchInput)) ||
		textCrusher(product.symbol).includes(textCrusher(searchInput));

	return products.filter(dateFilter).filter(authorsFilter).filter(productSearchFilter);
};

export const arrayUniqueByKey = <T>(arr: T[], key: keyof T) =>
	[
		...new Map(
			Array.isArray(arr) ? arr.filter(Boolean).map((item) => [item[key], item]) : []
		).values()
	] as T[];
