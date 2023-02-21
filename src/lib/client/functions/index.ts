export const capitalize = (text: string) => {
	return text.charAt(0).toUpperCase() + text.slice(1);
};

export const textCrusher = (text: string) => {
	return text.replace(/ /g, '').toLowerCase();
};

export const isValidObject = (obj: unknown): obj is Record<string, unknown> => {
	if (obj && !Array.isArray(obj) && typeof obj === 'object') return true;
	return false;
};
