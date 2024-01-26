import getCustomError from '$lib/client/constants/customErrors';
import { getRoleRank, isAtLeastModerator } from '$lib/client/functions';
import { user$ } from '$lib/client/schemas';
import { db } from '$lib/server/db';
import type { Address } from '$lib/server/db/schemas/orders';
import { userAddress } from '$lib/server/db/schemas/userAddress';
import { users, type User } from '$lib/server/db/schemas/users';
import { trytm } from '@bdsqqq/try';
import { error, type Action, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';

const edit = (async ({ request, locals }) => {
	const sessionUser = locals.session?.user;

	// Only moderators and admins are allowed to edit a user
	if (!sessionUser) {
		error(...getCustomError('not-logged-in'));
	}
	if (!isAtLeastModerator(sessionUser.role)) {
		error(...getCustomError('insufficient-permissions'));
	}

	const form = await superValidate(request, user$.editForm);
	if (!form.valid) {
		return fail(400, { form });
	}

	// Make sure something else other than id was provided
	if (Object.keys(form.data).length <= 1) {
		return setError(form, 'Nie podano żadnych danych do edycji', { status: 400 });
	}

	const { id, email, fullName, role, phone, city, zipCode, street, adviserId } = form.data;

	// Fetch the user from the database (before the edit)
	const [userBeforeEdit, userBeforeEditError] = await trytm(
		db.query.users.findFirst({
			columns: {
				id: true,
				email: true,
				fullName: true,
				role: true,
				phone: true
			},
			with: {
				adviser: {
					columns: {
						id: true,
						fullName: true,
						email: true
					}
				},
				address: {
					columns: {
						city: true,
						zipCode: true,
						street: true
					}
				}
			},
			where: (users, { eq }) => eq(users.id, id)
		})
	);

	// Check if the user exists
	if (userBeforeEditError) {
		return setError(form, 'Błąd serwera. Nie udało się znaleźć użytkownika', { status: 500 });
	}
	if (!userBeforeEdit) {
		return setError(form, 'Nie znaleziono użytkownika', { status: 400 });
	}

	// If the user is trying to edit themself
	if (userBeforeEdit.id === sessionUser.id) {
		// It's ok as long as they are not trying to block themself
		if (role === 'banned') {
			return setError(form, 'Nie możesz zablokować sam siebie', { status: 400 });
		}
	}
	// If the user is trying to edit another user
	else {
		// User is trying to edit a user with higher or equal role
		if (getRoleRank(sessionUser.role) <= getRoleRank(userBeforeEdit.role)) {
			return setError(form, 'Nie możesz edytować użytkowników z wyższą lub równą rolą', {
				status: 403
			});
		}
	}

	const newUser: Partial<Pick<User, 'email' | 'fullName' | 'phone' | 'role' | 'adviserId'>> = {};
	const newAddress: Partial<Address> = {};

	if (email) {
		newUser.email = email;
	}
	if (fullName) {
		newUser.fullName = fullName;
	}
	if (role) {
		newUser.role = role;
	}
	if (phone) {
		newUser.phone = phone;
	}
	if (adviserId) {
		if (sessionUser.role !== 'admin') {
			return setError(form, 'Tylko administrator może przypisać doradcę', { status: 403 });
		}
		newUser.adviserId = adviserId;
	}
	if (city) {
		newAddress.city = city;
	}
	if (zipCode) {
		newAddress.zipCode = zipCode;
	}
	if (street) {
		newAddress.street = street;
	}

	// if (claimAdviser !== undefined) {
	// 	if (claimAdviser) {
	// 		newUser.adviserId = sessionUser.id;
	// 	} else {
	// 		newUser.adviserId = null;
	// 	}
	// }

	if (Object.keys(newUser).length) {
		const [, editUserError] = await trytm(
			db
				.update(users)
				.set({
					...newUser
				})
				.where(eq(users.id, id))
		);
		if (editUserError) {
			return setError(form, 'Nie udało się edytować użytkownika', { status: 500 });
		}
	}

	console.log('userAddress', newAddress, Object.keys(newAddress).length);

	if (Object.keys(newAddress).length) {
		const [, editUserAddressError] = await trytm(
			db
				.insert(userAddress)
				.values({
					userId: id,
					street: newAddress.street || '',
					zipCode: newAddress.zipCode || '',
					city: newAddress.city || ''
				})
				.onDuplicateKeyUpdate({
					set: {
						...newAddress
					}
				})
		);
		if (editUserAddressError) {
			return setError(form, 'Nie udało się edytować adresu użytkownika', { status: 500 });
		}
	}

	return setMessage(form, 'Edytowano użytkownika');
}) satisfies Action;

export default edit;
