export const customErrors = {
	'not-logged-in': [401, 'Nie jesteś zalogowany'],
	'insufficient-permissions': [403, 'Nie masz wystarczających uprawień'],
	'not-found': [404, 'Nic nie znaleziono']
} as const;

type CustomErrors = typeof customErrors;

type ErrorArray = CustomErrors[keyof CustomErrors];

type RedirectStatus = 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;

const getCustomError = (error: keyof CustomErrors): [ErrorArray['0'], ErrorArray['1']] => {
	const [errorKey, message] = customErrors[error];
	return [errorKey, message];
};

const customRedirects = ['login-required'] as const;

const getCustomRedirect = (
	type: (typeof customRedirects)[number],
	redirectTo: string
): [RedirectStatus, string] => {
	switch (type) {
		case 'login-required':
			return [302, `/zaloguj?redirectTo=${redirectTo}`];
		default:
			return [302, '/'];
	}
};

export default getCustomError;
export { getCustomRedirect };
