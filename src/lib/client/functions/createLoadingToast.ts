import toast from 'svelte-french-toast';

type MessageType = 'please-wait' | 'redirecting' | 'logout';

const createLoadingToast = (m: MessageType) => {
	let message = '?';
	if (m === 'please-wait') message = 'Proszę czekać...';
	else if (m === 'redirecting') message = 'Przekierowywanie...';
	else if (m === 'logout') message = 'Wylogowywanie...';
	return toast.loading(message);
};

export default createLoadingToast;
