import {
	mainCategories,
	subcategories,
	type MainCategory,
	type Producent,
	producents
} from '$lib/client/constants/dbTypes.js';
import { isJSON } from '$lib/client/functions';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schemas/products';
import type { ProductSortableColumn, Subcategory } from '$types';
import { sql } from 'drizzle-orm';

const pageLimit = 10;
const sortableColumns: ProductSortableColumn[] = [
	'name',
	'price',
	'weight',
	'amountLeft',
	'producent',
	'category',
	'subcategory'
];

export const load = ({ url }) => {
	const page = !isNaN(Number(url.searchParams.get('strona')))
		? Math.max(Number(url.searchParams.get('strona')), 1)
		: 1;

	const category = url.searchParams.get('kategoria');
	const subcategory = url.searchParams.get('podkategoria');
	const producent = url.searchParams.get('producent');

	const sort = url.searchParams.get('sort');
	const desc = url.searchParams.get('desc');

	const descBool = desc && ['true', 'false'].includes(desc) ? isJSON<boolean>(desc) : null;
	const properSort = (sort: string | null): sort is ProductSortableColumn => {
		return !!sort && sortableColumns.includes(sort as ProductSortableColumn);
	};

	const isProperCategory = (category: unknown): category is MainCategory => {
		return (
			!!category &&
			typeof category === 'string' &&
			mainCategories.includes(category.toLowerCase() as MainCategory)
		);
	};

	const isProperSubategory = (subcategory: unknown): subcategory is Subcategory => {
		return (
			!!subcategory &&
			typeof subcategory === 'string' &&
			subcategories.includes(subcategory.toLowerCase() as Subcategory)
		);
	};

	const isProperProducent = (producent: unknown): producent is Producent => {
		return (
			!!producent &&
			typeof producent === 'string' &&
			producents.includes(producent.toLowerCase() as Producent)
		);
	};

	const atLeastOneWhereCondition =
		isProperCategory(category) || isProperSubategory(subcategory) || isProperProducent(producent);

	console.log('atLeastOneWhereCondition', atLeastOneWhereCondition);

	return {
		products: db.query.products.findMany({
			columns: {
				id: true,
				name: true,
				symbol: true,
				description: true,
				weight: true,
				price: true,
				category: true,
				subcategory: true,
				producent: true,
				encodedURL: true,
				amountLeft: true
			},
			...(atLeastOneWhereCondition
				? {
						where: (products, { eq, and }) =>
							and(
								isProperCategory(category) ? eq(products.category, category) : undefined,
								isProperSubategory(subcategory) ? eq(products.subcategory, subcategory) : undefined,
								isProperProducent(producent) ? eq(products.producent, producent) : undefined
							)
				  }
				: {}),
			with: {
				author: {
					columns: {
						id: true,
						fullName: true,
						email: true
					}
				},
				images: true
			},
			offset: (page - 1) * pageLimit,
			...(descBool !== null && properSort(sort)
				? {
						orderBy: (products, { asc, desc }) =>
							descBool ? desc(products[sort]) : asc(products[sort])
				  }
				: {}),
			limit: pageLimit
		}),
		pageLimit,
		count: db
			.select({
				count: sql<number>`count(*)`.mapWith(Number)
			})
			.from(products)
	};
};
