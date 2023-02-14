// import { toasts, ToastContainer, FlatToast, BootstrapToast } from 'svelte-toasts';
import type { ToastProps } from 'svelte-toasts/types/common';

export const VerificationToast: Partial<ToastProps> = {
	title: 'Pomyślna weryfikacja',
	description: 'Zostałeś zalogowany',
	duration: 5000,
	placement: 'bottom-right',
	type: 'success',
	theme: 'dark'
	// onClick: () => {},
	// onRemove: () => {}
};
