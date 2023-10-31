import getCustomError from '$lib/client/constants/customErrors';
import { error } from '@sveltejs/kit';
import type { CustomError } from '$types';

export const load = ({ params }) => {
	const [statusCode, message] = getCustomError(params.code as CustomError);

	if (statusCode && message) {
		return {
			statusCode,
			message
		};
	}

	throw error(...getCustomError('not-found'));
};
