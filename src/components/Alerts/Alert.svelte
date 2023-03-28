<script lang="ts">
	import AlertIcon from './AlertIcon.svelte';

	export let message: string;
	export let type: 'success' | 'error' | 'warning' | 'info';

	const alertTitle = {
		success: 'Sukces',
		error: 'Błąd',
		warning: 'Ostrzeżenie',
		info: 'Informacja'
	};
</script>

<div
	class="shadow-lg border-l-2 rounded flex flex-row bg-base-300 min-h-[72px] py-3 px-2 items-center"
	class:border-success={type === 'success'}
	class:border-error={type === 'error'}
	class:border-warning={type === 'warning'}
	class:border-info={type === 'info'}
>
	<div class="h-full mr-3 ml-1 flex items-center justify-center">
		<AlertIcon {type} />
	</div>
	<div class="h-full w-full flex flex-col items-start justify-center">
		<h3 class="font-bold text-lg">{alertTitle[type]}</h3>
		<span class="text-sm">{message}</span>
	</div>
</div>
