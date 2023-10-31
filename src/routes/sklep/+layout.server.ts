import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schemas/products';
import { clauseConcat, extractParams } from '$lib/server/functions/utils';
import type { ProductSortableColumn } from '$types';
import { eq, gte, lte, or, sql } from 'drizzle-orm';

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
	const { page, sort, product } = extractParams<ProductSortableColumn>(url, sortableColumns);
	const defaultWhereClause = or();
	// eq(products.customerId, userId),
	// eq(products.cartOwnerId, userId)

	const producentClause = product.producent && eq(products.producent, product.producent);
	const categoryClause = product.category && eq(products.category, product.category);
	const subcategoryClause = product.subcategory && eq(products.subcategory, product.subcategory);
	const priceMinClause = product.priceMin && gte(products.price, product.priceMin.toString());
	const priceMaxClause = product.priceMax && lte(products.price, product.priceMax.toString());

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
		count: db
			.select({
				count: sql<number>`count(*)`.mapWith(Number)
			})
			.from(products)
	};
};
