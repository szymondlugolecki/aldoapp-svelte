export const load = async ({ locals, depends, url }) => {
	depends('session');

	// console.log('load function', 'session user', locals.session?.user);

	return {
		user: locals.session?.user,
		url: url.href
	};
};
