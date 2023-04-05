import { PUBLIC_WEBSITE_URL } from '$env/static/public';
import type { Order } from '$lib/server/db/schemas/products';
import type {
	ProductAuthor,
	ProductFilter,
	ProductWithAuthorAndImage,
	User,
	UserFilter,
	OrderFilter
} from '$types';
import type { Thing, WithContext } from 'schema-dts';

export type Schema = Thing | WithContext<Thing>;

export const serializeSchema = (thing: Schema) => {
	return `<script type="application/ld+json">${JSON.stringify(thing, null, 2)}</script>`;
};

export const productURLParser = (name: string, symbol: string) => {
	return encodeURIComponent(
		`${name}-${symbol}`.replaceAll('  ', ' ').replaceAll(' ', '-').toLowerCase().trim()
	);
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

export const applyOrdersFilters = (orders: Order[], filter: OrderFilter) => {
	const orderStatus = (order: Order) => {
		if (filter.order === order.status) return true;
		return false;
	};

	return orders.filter(orderStatus);
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
