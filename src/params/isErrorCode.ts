import getCustomError from '$lib/client/constants/customErrors';
import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	return param in ['404', '500', '401', '403', '400'];
}) satisfies ParamMatcher;
