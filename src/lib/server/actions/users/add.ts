import getCustomError from '$lib/client/constants/customErrors';
import { trytm } from '@bdsqqq/try';
import { error, type Action, fail, redirect } from '@sveltejs/kit';
import { type InsertUser } from '$lib/server/db/schemas/users';
import { isAtLeastModerator } from '$lib/client/functions';
import { user$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';
import { createUser } from '$lib/server/functions/db';
import { generateId } from 'lucia';

const add = (async ({ request, locals }) => {
	const sessionUser = locals.user;
	// Only moderators and admins are allowed to add a user
	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}
	if (!isAtLeastModerator(sessionUser.role)) {
		error(...getCustomError('insufficient-permissions'));
	}

	const form = await superValidate(request, user$.addForm);
	if (!form.valid) {
		return fail(400, { form });
	}

	const { email, fullName, phone, role } = form.data;

	const userId = generateId(15);

	const newUser = {
		id: userId,
		email,
		fullName,
		phone,
		role
	} satisfies InsertUser;

	// Add the user to the database
	const [, addUserError] = await trytm(createUser(newUser));

	if (addUserError) {
		// Unexpected-error
		console.error('addUserError', addUserError);
		return setError(form, 'Nie udało się dodać użytkownika', { status: 500 });
	}

	return setMessage(form, 'Dodano użytkownika');
}) satisfies Action;

export default add;
