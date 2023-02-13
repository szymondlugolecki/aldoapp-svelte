<script>
	import '../app.css';
	import { toasts, ToastContainer, FlatToast, BootstrapToast } from 'svelte-toasts';

	const showToast = () => {
		const toast = toasts.add({
			title: 'Message title',
			description: 'Message body',
			duration: 10000, // 0 or negative to avoid auto-remove
			placement: 'bottom-right',
			type: 'info',
			theme: 'dark',
			placement: 'bottom-right',
			type: 'success',
			theme,
			onClick: () => {},
			onRemove: () => {}
			// component: BootstrapToast, // allows to override toast component/template per toast
		});

		// toast.remove()
	};
</script>

<slot />
