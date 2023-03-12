const customErrors = {
	'not-logged-in': [401, 'Nie jesteś zalogowany'],
	'insufficient-permissions': [403, 'Nie masz wystarczających uprawień']
} as const;

export default customErrors;
