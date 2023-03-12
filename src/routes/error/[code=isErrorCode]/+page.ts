import customErrors from '$lib/client/constants/customErrors';
import { errorResponses } from '$lib/client/constants/errorResponses';
import { error } from '@sveltejs/kit';
import type { CustomError } from '$types';

export const load = ({ params }) => {
	const [statusCode, message] = customErrors[params.code as CustomError];

	if (statusCode && message) {
		return {
			statusCode,
			message
		};
	}

	throw error(...errorResponses[404]);
};
