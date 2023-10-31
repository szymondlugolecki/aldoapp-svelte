import { invalidate } from '$app/navigation';
import { trytm } from '@bdsqqq/try';
import toast from 'svelte-french-toast';
import createLoadingToast from '../createLoadingToast';

const logout = async () => {
	const id = createLoadingToast('please-wait');

	const [, logoutError] = await trytm(
		fetch('/api/logout', {
			method: 'POST',
			credentials: 'include'
		})
	);

	if (logoutError) {
		toast.error('Wystąpił błąd podczas wylogowywania', { id, duration: 2500 });
		return;
	}

	invalidate('session');
	toast.success('Wylogowano', { id, duration: 2500 });
};

export default logout;
