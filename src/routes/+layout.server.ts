export const load = ({ locals, depends, url }) => {
	depends('session');

	return {
		user: locals.session?.user,
		url: url.href
	};
};
