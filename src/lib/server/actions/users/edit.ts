import { getRoleRank, isAtLeastModerator } from '$lib/client/functions';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { editUserSchema, type EditUserSchema } from '$lib/client/schemas/users';
import { db } from '$lib/server/db';
import { users, type User } from '$lib/server/db/schemas/users';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { isCuid } from '@paralleldrive/cuid2';
import { error, fail, type Action } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

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
	const data: Partial<EditUserSchema> = Object.fromEntries(formData);

	// Only id is required, the rest is optional
	if (!data.id) {
		return fail(400, {
			errors: ['Brak id edytowanego użytkownika']
		});
	}
	if (!isCuid(data.id)) {
		return fail(400, {
			errors: ['Niepoprawne id edytowanego użytkownika']
		});
	}

	// Make sure anything else other than id was provided
	if (Object.keys(data).length === 1) {
		return fail(400, {
			errors: ['Brak danych do edycji']
		});
	}

	// Zod parse the data
	const [editUserObj, editUserObjParseError] = betterZodParse(editUserSchema, data);
	if (editUserObjParseError) {
		return fail(400, {
			errors: [editUserObjParseError[0]]
		});
	}

	const { id, email, fullName, role, access, phone, assignedAdviser } = editUserObj;

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
			errors: ['Błąd serwera. Nie udało się znaleźć tego użytkownika']
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
		// It's ok as long as they are not trying to block themself
		if (access === false) {
			return fail(400, {
				errors: ['Nie możesz zablokować sam siebie']
			});
		}
	}
	// If the user is trying to edit another user
	else {
		// // The other user is an admin
		// if (userBeforeEdit.role === 'admin') {
		// 	return fail(403, {
		// 		errors: ['Nikt nie może edytować admina']
		// 	});
		// }

		// User is trying to edit a user with higher or equal role
		if (getRoleRank(locals.session.user.role) <= getRoleRank(userBeforeEdit.role)) {
			return fail(403, {
				errors: ['Nie masz wystarczających uprawień']
			});
		}
	}

	const newUser: Partial<
		Pick<User, 'email' | 'fullName' | 'access' | 'phone' | 'role' | 'assignedAdviser'>
	> = {};

	if (email) {
		newUser.email = email.toLowerCase();
	}

	if (fullName) {
		newUser.fullName = fullName;
	}

	if (role) {
		newUser.role = role;
	}

	if (access) {
		newUser.access = access;
	}

	if (phone) {
		newUser.phone = phone.toString().replaceAll(' ', '');
	}

	if (assignedAdviser) {
		newUser.assignedAdviser = assignedAdviser;
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
