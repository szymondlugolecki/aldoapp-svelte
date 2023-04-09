import { isCuid } from '@paralleldrive/cuid2';

export const match = (param) => {
	return isCuid(param) || param.toLowerCase() === 'ja';
};
