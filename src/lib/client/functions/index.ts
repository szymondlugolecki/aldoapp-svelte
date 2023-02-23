import type { ProductFilter, ProductWithAuthor, UserFilter } from '$types';
import type { User } from '@prisma/client';

export const capitalize = (text: string) => {
	return text.charAt(0).toUpperCase() + text.slice(1);
};

export const textCrusher = (text: string) => {
	return text.replace(/ /g, '').toLowerCase();
};

export const isValidObject = (obj: unknown): obj is Record<string, unknown> => {
	if (obj && !Array.isArray(obj) && typeof obj === 'object') return true;
	return false;
};

export function applyUserFilters(users: User[], filter: UserFilter) {
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
}

export function applyProductFilters(products: ProductWithAuthor[], filter: ProductFilter) {
	const authorsFilter = (product: ProductWithAuthor) => {
		if (!filter.excludedUserIds.includes(product.author.id)) return true;
		return false;
	};

	// Since date should be the very first milisecond of the day
	const sinceDate = filter.since ? new Date(new Date(filter.since).setHours(0, 0, 0, 1)) : null;
	// Until date should be the very last milisecond of the day
	const untilDate = filter.until
		? new Date(new Date(filter.until).setHours(23, 59, 59, 999))
		: new Date(new Date().setHours(23, 59, 59, 999));

	const dateFilter = (product: ProductWithAuthor) => {
		if (!sinceDate) return true;
		// Since date was provided
		// Check if user is in the right range
		if (product.createdAt >= sinceDate && product.createdAt <= untilDate) return true;
		return false;
	};

	return products.filter(dateFilter).filter(authorsFilter);
}

export const arrayUniqueByKey = <T>(arr: T, key: string) =>
	[
		...new Map(
			Array.isArray(arr) ? arr.filter(Boolean).map((item) => [item[key], item]) : []
		).values()
	] as T;
