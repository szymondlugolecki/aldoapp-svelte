import { settings$ } from '$lib/client/schemas/index.js';
import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schemas/users';
import { trytm } from '@bdsqqq/try';
import { error, fail, type Action, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { setMessage, superValidate } from 'sveltekit-superforms/server';

const email: Action = async (event) => {
	const sessionUser = event.locals.user;
	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}

	const form = await superValidate(event, settings$.emailForm);
	if (!form.valid) {
		return fail(400, { form });
	}

	const [, editEmailError] = await trytm(
		db
			.update(usersTable)
			.set({
				email: form.data.email
			})
			.where(eq(usersTable.id, sessionUser.id))
	);

	if (editEmailError) {
		// Unexpected-error
		console.error('editEmailError', editEmailError);
		error(500, 'Błąd podczas zmieniania adresu email');
	}

	return setMessage(form, 'Pomyślnie edytowano adres email');
};

export default email;
