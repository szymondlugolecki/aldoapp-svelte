import type { ActionResult } from '@sveltejs/kit';
import { isValidObject } from '.';
import { errorToast, infoToast, successToast } from './toasts';

export const handleFormResponse = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	result: ActionResult<Record<string, any>, Record<string, any>>,
	successMessage: string,
	useInfoInstead = false
) => {
	console.log('result', result.type);
	try {
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
						errorToast({ title: 'Wystąpił błąd', description: formatErrors });
					} else {
						errorToast({ title: 'Wystąpił błąd', description: 'Nie wiemy co się stało 🤔' });
					}
				}
				break;
			case 'success':
				if (useInfoInstead) {
					infoToast({ title: 'Informacja', description: successMessage });
				}
				successToast({ title: 'Sukces', description: successMessage });
				break;
			default:
				break;
		}
	} catch (error) {
		errorToast({ title: 'Wystąpił błąd', description: 'Nieoczekiwany błąd 🤔' });
	}
};
