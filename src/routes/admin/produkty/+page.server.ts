// import { p } from '$lib/server/clients/pClient';

import add from '$lib/server/actions/product/add';
import edit from '$lib/server/actions/product/edit';
import remove from '$lib/server/actions/product/remove';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schemas/products';
import { sql } from 'drizzle-orm';
import type { Config } from '@sveltejs/adapter-vercel';
import { isJSON } from '$lib/client/functions';
import type { ProductSortableColumn } from '$types';

export const config: Config = {
	runtime: 'nodejs18.x'
};

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
	const page = !isNaN(Number(url.searchParams.get('strona')))
		? Math.max(Number(url.searchParams.get('strona')), 1)
		: 1;

	const sort = url.searchParams.get('sort');
	const desc = url.searchParams.get('desc');

	const descBool = desc && ['true', 'false'].includes(desc) ? isJSON<boolean>(desc) : null;
	const properSort = (sort: string | null): sort is ProductSortableColumn => {
		return !!sort && sortableColumns.includes(sort as ProductSortableColumn);
	};

	return {
		products: db.query.products.findMany({
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

export const actions = {
	add,
	edit,
	remove
};
