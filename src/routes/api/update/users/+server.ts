import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { getRoleRank } from '$lib/client/functions/index.js';
import { userPropertySchemas } from '$lib/client/schemas/users.js';
import { db } from '$lib/server/db/index.js';
import { users, type Role } from '$lib/server/db/schemas/users.js';
import type { Optional } from '$types/UtilityTypes.js';
import { trytm } from '@bdsqqq/try';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const userUpdateSchema = z.object({
	id: userPropertySchemas.id,
	fullName: userPropertySchemas.fullName.optional(),
	email: userPropertySchemas.email.optional(),
	role: userPropertySchemas.role.optional(),
	access: userPropertySchemas.access.optional(),
	phone: userPropertySchemas.phone.optional()
});

type UserUpdateSchema = Optional<z.infer<typeof userUpdateSchema>, 'id'>;

export async function POST({ locals }) {
	const requestingUser = locals.session?.user;
	if (!requestingUser) {
		throw error(400, 'Nie jesteś zalogowany');
	}

	const updateData = locals.updateData;
	if (!updateData) {
		throw error(400, 'Nieprawidłowe dane');
	}

	const updatedUser: UserUpdateSchema = {};

	// Validate the request body
	const [userData, parseError] = betterZodParse(userUpdateSchema, updateData);
	if (parseError) {
		console.error('Failed to validate the order', parseError);
		throw error(400, parseError[0]);
	}

	const [usersBefore, userBeforeError] = await trytm(
		db
			.select({ id: users.id, role: users.role })
			.from(users)
			.limit(1)
			.where(eq(users.id, userData.id))
	);
	if (userBeforeError) {
		console.error('Failed to fetch the before user', parseError);
		throw error(400, 'Nie udało się pobrać użytkownika');
	}

	const userBefore = usersBefore[0];

	if (!userBefore) {
		throw error(400, 'Nie znaleziono użytkownika');
	}

	const shouldChangeField = (field: keyof UserUpdateSchema) => {
		return field in userData && userData[field] !== undefined;
	};

	// fullName, email, phone, role, access

	const isEditingSelf = requestingUser.id === userData.id;

	if (getRoleRank(requestingUser.role) < getRoleRank(userBefore.role)) {
		throw error(403, 'Nie możesz edytować użytkownika z wyższą rolą');
	}

	if (shouldChangeField('fullName')) {
		updatedUser.fullName = userData.fullName;
	}

	if (shouldChangeField('email')) {
		updatedUser.email = userData.email;
	}

	if (shouldChangeField('access')) {
		if (isEditingSelf) {
			// do not allow users to take away their own access
			if (userData.access === false && requestingUser.access === true) {
				throw error(400, 'Nie można zablokować samego siebie');
			}
		}
		updatedUser.access = userData.access;
	}

	if (shouldChangeField('role')) {
		if (isEditingSelf) {
			// do not allow users to upgrade themselves
			if (getRoleRank(userData.role as Role) > getRoleRank(requestingUser.role)) {
				throw error(400, 'Nie można zmienić roli na admina');
			}
		}

		updatedUser.role = userData.role;
	}

	if (shouldChangeField('phone')) {
		updatedUser.phone = userData.phone;
	}

	if (Object.keys(updatedUser).length === 0) {
		throw error(400, 'Nie podano żadnych danych do edycji');
	}

	const [, updateUserError] = await trytm(
		db.update(users).set(updatedUser).where(eq(users.id, userData.id))
	);
	if (updateUserError) {
		console.log('updatedUser', updatedUser);
		console.error('Failed to update the user', parseError);
		throw error(400, 'Nie udało się zaktualizować użytkownika');
	}

	return json({ message: 'Pomyślnie edytowano użytkownika' });
}
