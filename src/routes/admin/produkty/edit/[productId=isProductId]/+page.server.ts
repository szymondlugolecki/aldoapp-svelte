import { products$ } from '$lib/client/schemas/index.js';
import edit from '$lib/server/actions/product/edit';
import { db } from '$lib/server/db';
import type { Subcategory } from '$types';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';
import type { Optional } from '$types/UtilityTypes.js';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
	runtime: 'nodejs20.x'
};

export const load = async ({ params }) => {
	const { productId } = params;
	const product = await db.query.productsTable.findFirst({
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
		where: (productsTable, { eq }) => eq(productsTable.id, parseInt(productId))
	});

	if (!product) {
		error(404, {
			message: 'Nie znaleziono użytkownika'
		});
	}

	type DefaultProduct = typeof product;

	const defaultProductValues = {
		...product,
		description: product.description || undefined,
		subcategory: (product.subcategory as Subcategory) || undefined,
		images: undefined
	};

	return {
		product,
		form: await superValidate(defaultProductValues, zod(products$.editForm))
	};
};

export const actions = {
	edit
};
