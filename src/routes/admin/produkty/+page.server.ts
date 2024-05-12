import add from '$lib/server/actions/product/add';
import { db } from '$lib/server/db';
import { productsTable } from '$lib/server/db/schemas/products';
import { like, or, sql } from 'drizzle-orm';
import type { ProductSortableColumn } from '$types';
import { clauseConcat, extractParams } from '$lib/server/functions/utils';
import { superValidate } from 'sveltekit-superforms';
import { products$ } from '$lib/client/schemas/index.js';
import { zod } from 'sveltekit-superforms/adapters';

const pageLimit = 8;
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
	const { search, page, sort } = extractParams<ProductSortableColumn>(url, sortableColumns);

	const searchTemplateString = `%${search}%`;
	const searchClause =
		search &&
		or(
			like(productsTable.id, searchTemplateString),
			like(productsTable.name, searchTemplateString),
			like(productsTable.symbol, searchTemplateString)
		);

	const clausesArr = [searchClause];

	const extendedWhereClause = clauseConcat(...clausesArr);

	const products = await db.query.productsTable.findMany({
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
			? (productsTable, { asc, desc }) =>
					sort.descending ? desc(productsTable[sort.by]) : asc(productsTable[sort.by])
			: (productsTable, { desc }) => desc(productsTable.createdAt),
		limit: pageLimit,
		where: extendedWhereClause
	});

	const { count } = (
		await db
			.select({
				count: sql<number>`count(*)`.mapWith(Number)
			})
			.from(productsTable)
			.where(extendedWhereClause)
	)[0];

	return {
		products,
		pageLimit,
		count,
		addForm: await superValidate(zod(products$.addForm))
	};
};

export const actions = {
	add
};
