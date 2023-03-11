import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { editUserSchema } from '$lib/client/schemas/users';
import { compareObjects } from '$lib/server/functions/utils';
import { prisma } from '$lib/server/clients/prismaClient';
import { trytm } from '@bdsqqq/try';
import type { User } from '@prisma/client';
import { error, fail, type Action } from '@sveltejs/kit';

const edit: Action = async ({ request, locals }) => {
	// Only moderators and admins are allowed to edit a user
	if (!locals.session) {
		throw error(401, 'Nie jesteś zalogowany');
	}
	if (!['admin', 'moderator'].includes(locals.session?.user.role)) {
		throw error(403, 'Nie masz wystarczających uprawień');
	}

	// Validate the user input
	const data = Object.fromEntries(await request.formData());

	const [editUserObj, editUserObjParseError] = betterZodParse(editUserSchema.parse(data));
	if (editUserObjParseError) {
		return fail(400, {
			errors: ['Niepoprawne dane']
		});
	}
	const { id, email, name, role, banned } = editUserObj;

	const [userBeforeEdit, userBeforeEditError] = await trytm(
		prisma.user.findFirstOrThrow({
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
		})
	);
	if (userBeforeEditError) {
		return fail(400, {
			errors: ['Niepowodzenie w znalezieniu użytkownika']
		});
	}

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
		// Here the user is trying to edit himself
		// It's ok as long as they are not trying to block themselves
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

	const nothingChanged = compareObjects(oldUserObj, { email, name, role, banned: isNowBanned });

	// If nothing has changed, do not call the db to save resources
	if (nothingChanged) {
		return { success: true, message: 'Pomyślnie edytowano użytkownika' };
	}

	const [, editUserError] = await trytm(
		prisma.user.update({
			where: {
				id
			},
			data: newUserObj,
			select: {
				id: true
			}
		})
	);

	if (editUserError) {
		return fail(500, {
			errors: ['Nie udało się edytować użytkownika']
		});
	}

	return { success: true, message: 'Pomyślnie edytowano użytkownika' };
};

export default edit;
