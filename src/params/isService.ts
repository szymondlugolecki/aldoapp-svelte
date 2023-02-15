import { services } from '$lib/client/constants';
import type { ShortService } from '$types';
import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	return services.includes(param as ShortService);
}) satisfies ParamMatcher;
