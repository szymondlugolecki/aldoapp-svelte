import { settings$ } from '$lib/client/schemas/index.js';
import { db } from '$lib/server/db';
import type { Address } from '$lib/server/db/schemas/orders.js';
import { userAddressTable } from '$lib/server/db/schemas/userAddress.js';
import { trytm } from '@bdsqqq/try';
import { error, type Action, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const address: Action = async (event) => {
	const sessionUser = event.locals.user;
	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}

	// await sleep(3);

	const form = await superValidate(event, zod(settings$.addressForm));
	if (!form.valid) {
		return fail(400, { form });
	}

	const address: Address = {
		street: form.data.street || '',
		zipCode: form.data.zipCode || '',
		city: form.data.city || ''
	};

	// This is nonsense*:
	// Needed to avoid empty fields overwriting existing ones
	// const editAddress: Partial<Address> = {}
	// Object.entries(address).forEach(([key, value]) => {
	// 	if (value) {
	// 		editAddress[key as keyof typeof form.data] = value;
	// 	}
	// });

	const [, editAddressError] = await trytm(
		db
			.update(userAddressTable)
			.set({ ...address })
			.where(eq(userAddressTable.userId, sessionUser.id))
	);

	if (editAddressError) {
		// Unexpected-error
		console.error('editAddressError', editAddressError);
		error(500, 'Błąd podczas zmieniania adresu');
	}

	console.log('success');
	return message(form, 'Edytowano adres');
};

export default address;
