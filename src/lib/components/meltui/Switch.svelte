<script lang="ts">
	import { createSwitch } from '@melt-ui/svelte';
	import { sleep } from '@melt-ui/svelte/internal/helpers';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';

	export let defaultChecked = false;
	export let onChange:
		| undefined
		| ((isChecked: boolean) => Promise<boolean>)
		| ((isChecked: boolean) => void) = undefined;
	export let loading = false;
	export let id: string | undefined = undefined;

	let firstRun = true;
	$: previousState = $isChecked;

	const { root, input, isChecked } = createSwitch({
		checked: firstRun ? defaultChecked : previousState,
		disabled: loading
	});

	let unsubscribe: Unsubscriber | undefined = undefined;

	onMount(() => {
		if (!onChange) return;
		unsubscribe = isChecked.subscribe(async (newValue) => {
			if (!onChange) return;
			if (firstRun) {
				firstRun = false;
				return;
			}
			const subscribed = await onChange(newValue);
		});
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});

	// let className: string | undefined | null = undefined;
	// export { className as class };
</script>

<button
	{...$root}
	use:root.action
	class="relative h-6 w-11 cursor-default rounded-full transition-colors outline-none
			focus:ring focus:ring-magnum-400 data-[state=unchecked]:bg-input data-[state=checked]:bg-primary border-transparent"
	{id}
	disabled={loading}
>
	<span
		class="block h-5 w-5 translate-x-0.5 rounded-full bg-background transition-transform will-change-transform
					{$isChecked && 'translate-x-[22px]'}"
	/>
	<input {...$input} />
</button>
