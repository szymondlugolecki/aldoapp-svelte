import type customErrors from '$lib/client/constants/customErrors';

export type CustomError = keyof typeof customErrors;
export type ErrorLocation = `/error/${CustomError}`;

export type NotificationContent = {
	title: string;
	options: {
		body: string;
	};
};
