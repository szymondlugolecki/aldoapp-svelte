import { getRoleRank, isAtLeastModerator } from '$lib/client/functions';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { editUserSchema } from '$lib/client/schemas/users';
import { db } from '$lib/server/db';
import { users, type User } from '$lib/server/db/schemas/users';
import { areObjectsEqual } from '$lib/server/functions/utils';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { error, fail, type Action } from '@sveltejs/kit';
import { eq } from 'drizzle-orm/expressions';

const edit: Action = async ({ request, locals }) => {
	// Only moderators and admins are allowed to edit a user
	if (!locals.session) {
		throw error(401, 'Nie jesteś zalogowany');
	}
	if (!isAtLeastModerator(locals.session?.user.role)) {
		throw error(403, 'Nie masz wystarczających uprawień');
	}

	// Validate the user input
	const [formData, formDataError] = await trytm(request.formData());
	if (formDataError) {
		return fail(400, {
			errors: ['Niepoprawne dane']
		});
	}
	const data = {
		...Object.fromEntries(formData),
		phone: Object.fromEntries(formData).phone.toString().replaceAll(' ', '') || null
	};

	const [editUserObj, editUserObjParseError] = betterZodParse(editUserSchema, data);
	if (editUserObjParseError) {
		return fail(400, {
			errors: ['Niepoprawne dane']
		});
	}

	const { id, email, fullName, role, access, phone } = editUserObj;

	// Fetch the user from the database (before the edit)
	const [usersBeforeEdit, usersBeforeEditError] = await trytm(
		db
			.select({
				id: users.id,
				email: users.email,
				fullName: users.fullName,
				role: users.role,
				access: users.access,
				phone: users.phone
			})
			.from(users)
			.where(eq(users.id, id))
	);

	// Check if the user exists
	if (usersBeforeEditError) {
		return fail(500, {
			errors: ['Niepowodzenie w znalezieniu użytkownika']
		});
	}
	if (!usersBeforeEdit.length) {
		return fail(400, {
			errors: ['Nie udało się znaleźć użytkownika, którego próbujesz edytować']
		});
	}

	const userBeforeEdit = usersBeforeEdit[0];

	// ! Handling permissions
	// If the user is trying to edit themself
	if (userBeforeEdit.id === locals.session.user.id) {
		// It's ok as long as they are not trying to block themselves
		if (access === false) {
			return fail(400, {
				errors: ['Nie możesz zablokować sam siebie']
			});
		}
	}
	// If the user is trying to edit another user
	else {
		// The other user is an admin
		if (userBeforeEdit.role === 'admin') {
			return fail(403, {
				errors: ['Nikt nie może edytować admina']
			});
		}

		// User is trying to edit a user with a higher or equal role
		if (getRoleRank(locals.session.user.role) <= getRoleRank(userBeforeEdit.role)) {
			return fail(403, {
				errors: ['Nie masz wystarczających uprawień']
			});
		}
	}

	const oldUser = {
		email: userBeforeEdit.email,
		role: userBeforeEdit.role,
		fullName: userBeforeEdit.fullName,
		access: userBeforeEdit.access,
		phone: userBeforeEdit.phone
	};

	const newUser = {
		email,
		role,
		fullName,
		access: !access,
		phone
	} satisfies Omit<User, 'id' | 'createdAt' | 'assignedAdviser'>;

	const nothingChanged = areObjectsEqual(oldUser, newUser);

	// If nothing has changed, do not update the user
	if (nothingChanged) {
		console.log('Nothing has changed');
		return { success: true, message: 'Pomyślnie edytowano użytkownika' };
	}

	const [, editUserError] = await trytm(db.update(users).set(newUser).where(eq(users.id, id)));

	if (editUserError) {
		return fail(500, {
			errors: ['Nie udało się edytować użytkownika']
		});
	}

	return { success: true, message: 'Pomyślnie edytowano użytkownika' };
};

export default edit;

// p.user.update({
// 	where: {
// 		id
// 	},
// 	data: newUserObj,
// 	select: {
// 		id: true
// 	}
// })

// p.user.findFirstOrThrow({
// 	where: {
// 		id
// 	},
// 	select: {
// 		id: true,
// 		email: true,
// 		fullName: true,
// 		role: true,
// 		banned: true
// 	}
// })
