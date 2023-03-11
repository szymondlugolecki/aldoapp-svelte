export const load = ({ locals }) => {
	return {
		user: locals.session?.user
	};
};
