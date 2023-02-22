import {
	idValidation,
	nameValidation,
	symbolValidation,
	descriptionValidation,
	thumbnailValidation
} from '$lib/client/schemas/products';
import { prisma } from '$prisma';
import type { Product } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { error, fail } from '@sveltejs/kit';
import { z, ZodError } from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const products = await prisma.product.findMany({
		include: {
			author: {
				select: {
					id: true,
					fullName: true,
					email: true
				}
			}
		}
	});
	console.log(
		'products',
		products.map((u) => u.symbol)
	);

	return { products };
}) satisfies PageServerLoad;

const addProductSchema = z.object({
	name: nameValidation,
	symbol: symbolValidation,
	description: descriptionValidation,
	thumbnail: thumbnailValidation
});

const editProductSchema = z.object({
	id: idValidation,
	name: nameValidation,
	symbol: symbolValidation,
	description: descriptionValidation,
	thumbnail: thumbnailValidation
});

export const actions = {
	add: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());

		// Only moderators and admins are allowed to add a product
		if (!locals.session) {
			throw error(401, 'Nie jesteś zalogowany');
		}
		if (!['admin', 'moderator'].includes(locals.session?.user.role)) {
			throw error(403, 'Nie masz wystarczających uprawień');
		}

		try {
			const { name, symbol, description, thumbnail } = addProductSchema.parse(data);

			console.log(
				'name',
				name,
				'symbol',
				symbol,
				'description',
				description,
				'thumbnail',
				thumbnail
			);

			await prisma.product.create({
				data: {
					userId: locals.session.user.id,
					name,
					symbol,
					description,
					thumbnail
				}
			});
		} catch (err) {
			console.log('err', err);
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return fail(400, {
					errors
				});
			}

			if (err instanceof PrismaClientKnownRequestError) {
				console.log('prisma error', err.code, err.message);
				throw error(500, { message: 'Niespodziewany błąd. Spróbuj ponownie' });
			}

			throw error(500, { message: 'Niespodziewany błąd. Spróbuj ponownie' });
		}
	},
	edit: async ({ request, locals }) => {
		console.log('edit');
		const data = Object.fromEntries(await request.formData());

		// Only moderators and admins are allowed to edit a user
		if (!locals.session) {
			throw error(401, 'Nie jesteś zalogowany');
		}
		if (!['admin', 'moderator'].includes(locals.session?.user.role)) {
			throw error(403, 'Nie masz wystarczających uprawień');
		}

		try {
			const { id, name, symbol, description, thumbnail } = editProductSchema.parse(data);

			const productBeforeEdit = await prisma.product.findFirstOrThrow({
				where: {
					id
				},
				select: {
					id: true,
					name: true,
					symbol: true,
					description: true,
					thumbnail: true
				}
			});

			const oldProductObj = {
				name: productBeforeEdit.name,
				symbol: productBeforeEdit.symbol,
				description: productBeforeEdit.description,
				thumbnail: productBeforeEdit.thumbnail
			};

			const newProductObj: Partial<Product> = {
				name,
				symbol,
				description,
				thumbnail
			};

			// If nothing has changed, do not call the db to save resources
			if (JSON.stringify(oldProductObj) === JSON.stringify(newProductObj)) {
				return { success: true };
			}

			await prisma.product.update({
				where: {
					id
				},
				data: newProductObj,
				select: {
					id: true
				}
			});

			return { success: true };
		} catch (err) {
			console.log('err', err);
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return fail(400, {
					errors
				});
			}

			if (err instanceof PrismaClientKnownRequestError) {
				// if (err.code === 'P2002') {
				// 	throw error(400, { message: 'Użytkownik z tym mailem już istnieje' });
				// }
				console.log('prisma error', err.code, err.message);
				throw error(500, { message: 'Niespodziewany błąd. Spróbuj ponownie' });
			}
		}
	}
} satisfies Actions;
