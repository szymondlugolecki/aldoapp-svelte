import type { ActionResult } from '@sveltejs/kit';
import { isValidObject } from '.';
import toast from 'svelte-french-toast';

export const handleFormResponse = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	result: ActionResult<Record<string, any>, Record<string, any>>,
	id: string,
	customMessage?: string
) => {
	console.log('result', result.type);

	switch (result.type) {
		case 'failure':
			if (result.data?.errors) {
				let errorList: Array<unknown> = [];

				if (isValidObject(result.data?.errors)) {
					errorList = Object.values(result.data?.errors).flatMap((x) => x);
				} else if (Array.isArray(result.data?.errors)) {
					errorList = result.data?.errors;
				}

				if (errorList.length) {
					const formatErrors = '• ' + errorList.join('\n• ');
					toast.error('Wystąpił błąd:\n' + formatErrors, { duration: 3500, id });
				} else {
					toast.error('Wystąpił nieznany błąd', { duration: 3500, id });
				}
			}
			break;
		case 'success': {
			let message = 'Sukces';
			if (result.data?.message && typeof result.data.message === 'string') {
				message = result.data?.message;
			}

			if (customMessage) {
				message = customMessage;
			}

			toast.success(message, { id, duration: 2500 });
			break;
		}
		case 'redirect':
			toast.success(customMessage || 'Przekierowano 🙂', { id, duration: 2000 });
			break;
		case 'error':
			toast.error('Wystąpił błąd 😟', { id, duration: 3000 });
			break;
		default:
			break;
	}
};
