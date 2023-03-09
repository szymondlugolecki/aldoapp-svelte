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
import { writeFileSync } from 'fs';
import { createId } from '@paralleldrive/cuid2';

export const load = (() => {
	return {
		products: prisma.product.findMany({
			include: {
				author: {
					select: {
						id: true,
						fullName: true,
						email: true
					}
				}
			}
		})
	};
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

const removeProductSchema = z.object({
	id: idValidation
});

const createThumbnailFileName = (thumbnail: File) => {
	const fileNameId = createId();
	const fileFormat = thumbnail.type.split('/')[1];
	const fullFile = `${fileNameId}.${fileFormat}`;

	return fullFile;
};

const createNewThumbnail = async (thumbnail: File, fileName: string) => {
	const thumbnailArrBuffer = await thumbnail.arrayBuffer();

	writeFileSync(`static/products/${fileName}`, Buffer.from(thumbnailArrBuffer), 'base64');
};

export const actions = {
	add: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());

		console.log('data', data);

		// Only moderators and admins are allowed to add a product
		if (!locals.session) {
			throw error(401, 'Nie jesteś zalogowany');
		}
		if (!['admin', 'moderator'].includes(locals.session?.user.role)) {
			throw error(403, 'Nie masz wystarczających uprawień');
		}

		try {
			const { name, symbol, description, thumbnail } = addProductSchema.parse(data);

			// maybe add a restriction to filesize here...

			let thumbnailFilename: string | undefined;

			if (thumbnail) {
				thumbnailFilename = createThumbnailFileName(thumbnail);
				createNewThumbnail(thumbnail, thumbnailFilename);
			}

			await prisma.product.create({
				data: {
					userId: locals.session.user.id,
					name,
					symbol,
					description,
					thumbnail: thumbnailFilename
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
			const editProductData = editProductSchema.parse(data);
			const { id, name, symbol, description } = editProductData;
			let { thumbnail } = editProductData;

			if (thumbnail?.size === 0) {
				thumbnail = undefined;
			}

			console.log('thumbnail', thumbnail);

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

			let thumbnailFileName: string | undefined;
			if (thumbnail) {
				thumbnailFileName = createThumbnailFileName(thumbnail);
				createNewThumbnail(thumbnail, thumbnailFileName);
			}

			const newProductObj: Partial<Product> = {
				name,
				symbol,
				description,
				thumbnail: thumbnailFileName
			};

			// If nothing has changed, do not call the db to save resources
			if (
				JSON.stringify({
					name,
					symbol,
					description
				}) ===
					JSON.stringify({
						name: productBeforeEdit.name,
						symbol: productBeforeEdit.symbol,
						description: productBeforeEdit.description
					}) &&
				!thumbnail
			) {
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
	},
	remove: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());

		console.log('data', data);

		// Only moderators and admins are allowed to add a product
		if (!locals.session) {
			throw error(401, 'Nie jesteś zalogowany');
		}
		if (!['admin', 'moderator'].includes(locals.session?.user.role)) {
			throw error(403, 'Nie masz wystarczających uprawień');
		}

		try {
			const { id } = removeProductSchema.parse(data);

			await prisma.product.delete({
				where: {
					id
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
	}
} satisfies Actions;
