// import { p } from '$lib/server/clients/pClient';

import add from '$lib/server/actions/product/add';
import edit from '$lib/server/actions/product/edit';
// import remove from '$lib/server/actions/product/remove';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schemas/products';
import { sql } from 'drizzle-orm';
import type { ProductSortableColumn } from '$types';
import { extractParams } from '$lib/server/functions/utils';
import { superValidate } from 'sveltekit-superforms/server';
import { products$ } from '$lib/client/schemas/index.js';

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
	const { page, sort } = extractParams<ProductSortableColumn>(url, sortableColumns);

	const addForm = await superValidate(products$.addForm);
	const editForm = await superValidate(products$.editForm);

	return {
		products: db.query.products.findMany({
			columns: {
				id: true,
				name: true,
				price: true,
				weight: true,
				producent: true,
				category: true,
				subcategory: true,
				createdAt: true,
				symbol: true,
				encodedURL: true,
				description: true,
				image: true,
				hidden: true
			},
			with: {
				author: {
					columns: {
						id: true,
						fullName: true,
						email: true
					}
				},
				images: {
					columns: {
						id: true,
						url: true
					}
				}
			},
			offset: (page - 1) * pageLimit,
			orderBy: sort
				? (products, { asc, desc }) =>
						sort.descending ? desc(products[sort.by]) : asc(products[sort.by])
				: (products, { desc }) => desc(products.createdAt),
			limit: pageLimit
		}),
		pageLimit,
		count: db
			.select({
				count: sql<number>`count(*)`.mapWith(Number)
			})
			.from(products),
		addForm,
		editForm
	};
};

export const actions = {
	add,
	edit
	// remove
};
