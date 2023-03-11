export const load = ({ locals, depends }) => {
	depends('session');

	return {
		user: locals.session?.user
	};
};
