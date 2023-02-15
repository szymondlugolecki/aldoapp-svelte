import { toasts } from 'svelte-toasts';

type BasicToastProps = {
	title: string;
	description: string;
	duration?: number;
	uid?: number;
	onClick?: () => void;
	onRemove?: () => void;
};

export const successToast = ({
	title,
	description,
	duration = 10000,
	uid = undefined,
	onClick = undefined,
	onRemove = undefined
}: BasicToastProps) => {
	return toasts.add({
		title,
		description,
		duration,
		type: 'success',
		theme: 'dark',
		onClick,
		onRemove,
		uid
		// component: BootstrapToast, // allows to override toast component/template per toast
	});
};

export const errorToast = ({
	title,
	description,
	duration = 10000,
	uid = undefined,
	onClick = undefined,
	onRemove = undefined
}: BasicToastProps) => {
	return toasts.add({
		title,
		description,
		duration,
		type: 'error',
		theme: 'dark',
		onClick,
		onRemove,
		uid
		// component: BootstrapToast, // allows to override toast component/template per toast
	});
};
