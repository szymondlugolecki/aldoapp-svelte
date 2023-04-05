import type { ParamMatcher } from '@sveltejs/kit';
import { z } from 'zod';

export const match = ((param) => {
	return z.string().safeParse(param).success;
}) satisfies ParamMatcher;
