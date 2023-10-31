import getCustomError from '$lib/client/constants/customErrors';
import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	return param in customErrors;
}) satisfies ParamMatcher;
