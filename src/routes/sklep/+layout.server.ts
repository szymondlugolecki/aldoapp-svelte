import { db } from '$lib/server/db';
import { productsTable } from '$lib/server/db/schemas/products';
import { clauseConcat, extractParams } from '$lib/server/functions/utils';
import type { ProductSortableColumn } from '$types';
import { eq, gte, lte, sql } from 'drizzle-orm';

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

export const load = async ({ url }) => {
	const { page, sort, product } = extractParams<ProductSortableColumn>(url, sortableColumns);
	const defaultWhereClause = eq(productsTable.hidden, false);
	// or();
	// eq(productsTable.customerId, userId),
	// eq(productsTable.cartOwnerId, userId)

	const producentClause = product.producent && eq(productsTable.producent, product.producent);
	const categoryClause = product.category && eq(productsTable.category, product.category);
	const subcategoryClause =
		product.subcategory && eq(productsTable.subcategory, product.subcategory);
	const priceMinClause = product.priceMin && gte(productsTable.price, product.priceMin);
	const priceMaxClause = product.priceMax && lte(productsTable.price, product.priceMax);

	// console.log('Status', product.status);

	const clausesArr = [
		defaultWhereClause,
		producentClause,
		categoryClause,
		subcategoryClause,
		priceMinClause,
		priceMaxClause
	];

	const extendedWhereClause = clauseConcat(...clausesArr);

	return {
		products: await db.query.productsTable.findMany({
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
				amountLeft: true,
				image: true
			},
			where: extendedWhereClause,
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
			...(sort
				? {
						orderBy: (orders, { asc, desc }) =>
							sort.descending ? desc(orders[sort.by]) : asc(orders[sort.by])
				  }
				: {}),
			limit: pageLimit
		}),
		pageLimit,
		count: await db
			.select({
				count: sql<number>`count(*)`.mapWith(Number)
			})
			.from(productsTable)
	};
};
