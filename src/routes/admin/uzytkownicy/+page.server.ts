import {
	emailValidation,
	idValidation,
	nameValidation,
	roleValidation
} from '$lib/client/schemas/users';
import { prisma } from '$prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { error, fail } from '@sveltejs/kit';
import { z, ZodError } from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const users = await prisma.user.findMany({});
	console.log(
		'users',
		users.map((u) => u.email)
	);

	return { users };
}) satisfies PageServerLoad;

const addUserSchema = z.object({
	name: nameValidation,
	email: emailValidation,
	role: roleValidation
});

const editUserSchema = z.object({
	id: idValidation,
	name: nameValidation,
	email: emailValidation,
	role: roleValidation
});

// TODO Handle permissions
export const actions = {
	add: async ({ request }) => {
		console.log('add');
		const data = Object.fromEntries(await request.formData());

		try {
			const { email, name, role } = addUserSchema.parse(data);

			console.log('email', email, 'name', name, 'role', role);

			await prisma.user.create({
				data: {
					email,
					role,
					fullName: name
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
				if (err.code === 'P2002') {
					throw error(400, { message: 'Użytkownik z tym mailem już istnieje' });
				}
				console.log('prisma error', err.code, err.message);
				throw error(500, { message: 'Niespodziewany błąd. Spróbuj ponownie' });
			}

			throw error(500, { message: 'Niespodziewany błąd. Spróbuj ponownie' });
		}
	},
	edit: async ({ request }) => {
		console.log('edit');
		const data = Object.fromEntries(await request.formData());

		try {
			const { id, email, name, role } = editUserSchema.parse(data);

			console.log('email', email, 'name', name, 'role', role);

			await prisma.user.update({
				where: {
					id
				},
				data: {
					email,
					role,
					fullName: name
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
				// if (err.code === 'P2002') {
				// 	throw error(400, { message: 'Użytkownik z tym mailem już istnieje' });
				// }
				console.log('prisma error', err.code, err.message);
				throw error(500, { message: 'Niespodziewany błąd. Spróbuj ponownie' });
			}

			throw error(500, { message: 'Niespodziewany błąd. Spróbuj ponownie' });
		}
	}
} satisfies Actions;
