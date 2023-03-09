import {
	emailValidation,
	idValidation,
	nameValidation,
	roleValidation,
	bannedValidation
} from '$lib/client/schemas/users';
import { prisma } from '$prisma';
import type { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { error, fail } from '@sveltejs/kit';
import { z, ZodError } from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load = (() => {
	// console.log(
	// 	'users',
	// 	users.map((u) => u.email)
	// );

	return { users: prisma.user.findMany({}) };
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
	role: roleValidation,
	banned: bannedValidation
});

export const actions = {
	add: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());

		// Only moderators and admins are allowed to add a user
		if (!locals.session) {
			throw error(401, 'Nie jesteś zalogowany');
		}
		if (!['admin', 'moderator'].includes(locals.session?.user.role)) {
			throw error(403, 'Nie masz wystarczających uprawień');
		}

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
			const { id, email, name, role, banned } = editUserSchema.parse(data);

			const userBeforeEdit = await prisma.user.findFirstOrThrow({
				where: {
					id
				},
				select: {
					id: true,
					email: true,
					fullName: true,
					role: true,
					banned: true
				}
			});

			const isNowBanned = banned === 'true' ? true : false;

			// The edited user is someone else
			if (userBeforeEdit.id !== locals.session.user.id) {
				// A user is trying to edit another user that is an admin
				if (userBeforeEdit.role === 'admin') {
					return fail(403, {
						errors: ['Nie możesz edytować admina']
					});
				}

				// Non admin user is trying to edit a moderator
				if (userBeforeEdit.role === 'moderator' && locals.session.user.role !== 'admin') {
					return fail(403, {
						errors: ['Nie masz wystarczających uprawień']
					});
				}
			} else {
				// A user is trying to block themself
				if (isNowBanned) {
					return fail(400, {
						errors: ['Nie możesz zablokować sam siebie']
					});
				}
			}

			const oldUserObj = {
				email: userBeforeEdit.email,
				name: userBeforeEdit.fullName,
				role: userBeforeEdit.role,
				banned: userBeforeEdit.banned
			};

			const newUserObj: Partial<User> = {
				email,
				role,
				fullName: name,
				banned: isNowBanned
			};

			// If nothing has changed, do not call the db to save resources
			if (
				JSON.stringify(oldUserObj) === JSON.stringify({ email, name, role, banned: isNowBanned })
			) {
				return { success: true };
			}

			await prisma.user.update({
				where: {
					id
				},
				data: newUserObj,
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
