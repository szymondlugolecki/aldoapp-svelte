// import getCustomError from '$lib/client/constants/customErrors.js';
import { redirect } from '@sveltejs/kit';
// import address from '$lib/server/actions/settings/address.js';
// import email from '$lib/server/actions/settings/email.js';
// import phone from '$lib/server/actions/settings/phone.js';
// import { settings$ } from '$lib/client/schemas/index.js';
// import { db } from '$lib/server/db';
// import { trytm } from '@bdsqqq/try';
// import { superValidate } from 'sveltekit-superforms/server';

// export const actions = {
// 	address,
// 	email,
// 	phone
// };

export const load = async ({ locals }) => {
	// Must be logged in
	const { session } = locals;
	if (!session) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}

	// const [user, fetchUserError] = await trytm(
	// 	db.query.usersTable.findFirst({
	// 		where: (users, { eq }) => eq(users.id, session.user.id),
	// 		columns: {
	// 			email: true,
	// 			phone: true
	// 		},
	// 		with: { address: { columns: { city: true, zipCode: true, street: true } } }
	// 	})
	// );
	// if (fetchUserError) {
	// 	throw error(500, 'Nie udało się pobrać danych użytkownika');
	// }

	// if (!user) {
	// 	throw error(404, 'Nie znaleziono użytkownika');
	// }

	// return {
	// 	addressForm: superValidate(user.address, settings$.addressForm),
	// 	emailForm: superValidate({ email: user.email }, settings$.emailForm),
	// 	phoneForm: superValidate({ phone: user.phone }, settings$.phoneForm)
	// };
};
