import { getRoleRank, isAtLeastModerator } from '$lib/client/functions';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import {
	editUserSchema,
	userPropertySchemas,
	type EditUserSchema
} from '$lib/client/schemas/users';
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

	// data.access is a string in reality - ts wont let me change the type tho
	if (data.access !== undefined) {
		data.access = JSON.parse(data.access.toString());
	}

	console.log('formData', formData, data);

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

	console.log('data', data);

	// Make sure something else other than id was provided
	if (Object.keys(data).length <= 1) {
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

	const { id, email, fullName, role, access, phone, adviserId, city, zipCode, street } =
		editUserObj;

	// Fetch the user from the database (before the edit)
	const [userBeforeEdit, userBeforeEditError] = await trytm(
		db.query.users.findFirst({
			columns: {
				id: true,
				email: true,
				fullName: true,
				role: true,
				access: true,
				phone: true,
				address: true
			},
			where: (users, { eq }) => eq(users.id, id)
		})
	);

	// Check if the user exists
	if (userBeforeEditError) {
		return fail(500, {
			errors: ['Błąd serwera. Nie udało się znaleźć tego użytkownika']
		});
	}
	if (!userBeforeEdit) {
		return fail(400, {
			errors: ['Nie udało się znaleźć użytkownika, którego próbujesz edytować']
		});
	}

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
		// User is trying to edit a user with higher or equal role
		if (getRoleRank(locals.session.user.role) <= getRoleRank(userBeforeEdit.role)) {
			return fail(403, {
				errors: ['Nie masz wystarczających uprawień']
			});
		}
	}

	const newUser: Partial<
		Pick<User, 'email' | 'fullName' | 'access' | 'phone' | 'role' | 'adviserId' | 'address'>
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

	if (access !== undefined) {
		newUser.access = access;
	}

	if (phone) {
		newUser.phone = phone.toString().replaceAll(' ', '');
	}

	if (adviserId) {
		newUser.adviserId = adviserId;
	}

	if (city && street && zipCode) {
		const [address, addressParseError] = betterZodParse(userPropertySchemas.address, {
			city,
			street,
			zipCode
		});
		if (addressParseError) {
			return fail(400, {
				errors: [addressParseError[0]]
			});
		}
		newUser.address = address;
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
