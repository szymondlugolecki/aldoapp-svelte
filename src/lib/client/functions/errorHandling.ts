import toast from 'svelte-french-toast';

type ClientError = {
	status: number;
	response: Response;
	url: string;
	message: string;
	json: ReturnType<JSON['parse']>;
	text: string;
	cause: unknown;
};

export const errorHandler = (error: unknown) => {
	const isExpectedError = (error: unknown): error is ClientError => {
		return (
			error instanceof Error &&
			'status' in error &&
			'response' in error &&
			'url' in error &&
			'message' in error &&
			'json' in error &&
			'text' in error &&
			'cause' in error
		);
	};

	if (isExpectedError(error)) {
		const { type } = error.json;
		if (type && typeof type === 'string') {
			switch (type) {
				case 'success': {
					const successMessage = error.json.message || 'Sukces';
					toast.success(successMessage);
					break;
				}
				case 'error': {
					const errorMessage = error.json.message || 'Błąd';
					toast.error(errorMessage);
					break;
				}

				case 'info': {
					const infoMessage = error.json.message;
					if (!infoMessage) return;
					toast(infoMessage, {
						icon: 'ℹ️'
					});
					break;
				}

				case 'warning': {
					const warningMessage = error.json.message;
					if (!warningMessage) return;
					toast(warningMessage, {
						icon: '⚠️'
					});
					break;
				}
				default:
					break;
			}
		}
	}
};
