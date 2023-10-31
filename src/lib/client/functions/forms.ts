import type { ActionResult } from '@sveltejs/kit';
import toast from 'svelte-french-toast';

export const handleFormResponse = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	result: ActionResult<Record<string, any>, Record<string, any>>,
	id: string,
	customMessage?: string,
	justLoading = false
) => {
	const showErrorToast = (message: string) => {
		toast.error(message, { duration: 3500, id });
	};

	switch (result.type) {
		case 'failure': {
			if (!result.data || !('errors' in result.data)) {
				showErrorToast('Wystąpił niespodziewany błąd');
				return;
			}

			const { errors } = result.data;

			if (!Array.isArray(errors) || !errors.length) {
				showErrorToast('Wystąpił niespodziewany błąd');
				return;
			}

			showErrorToast(errors[0]);
			break;
		}
		case 'success': {
			let message = customMessage;
			if (result.data && 'message' in result.data) {
				message = result.data.message || customMessage;
			}

			if (justLoading) {
				toast.dismiss(id);
				return;
			}

			if (!message) {
				message = 'Sukces 🎉';
			}

			toast.success(message, { id, duration: 2500 });
			break;
		}
		case 'redirect':
			if (justLoading) {
				toast.dismiss(id);
				return;
			}

			toast.success(customMessage || 'Przekierowano 🙂', { id, duration: 2000 });
			break;
		case 'error':
			toast.error('Wystąpił błąd 😟', { id, duration: 3000 });
			break;
		default:
			break;
	}
};
