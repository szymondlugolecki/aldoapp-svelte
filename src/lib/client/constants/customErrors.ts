const customErrors = {
	'not-logged-in': [401, 'Nie jesteś zalogowany'],
	'insufficient-permissions': [403, 'Nie masz wystarczających uprawień'],
	'not-found': [404, 'Nic nie znaleziono']
} as const;

type CustomErrors = typeof customErrors;

type ErrorArray = CustomErrors[keyof CustomErrors];

const getCustomError = (error: keyof CustomErrors): [ErrorArray['0'], ErrorArray['1']] => {
	const [errorKey, message] = customErrors[error];
	return [errorKey, message];
};

export default getCustomError;
