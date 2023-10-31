<script lang="ts">
	import { createSwitch, melt } from '@melt-ui/svelte';
	import { writable } from 'svelte/store';
	import { isBrowser, sleep } from '@melt-ui/svelte/internal/helpers';
	import { onMount } from 'svelte';
	import Spinner from '$components/custom/Util/Spinner.svelte';

	export let isAdviser: boolean;

	const {
		elements: { root, input },
		states: { checked }
	} = createSwitch({
		defaultChecked: isAdviser
	});
</script>

<button
	use:melt={$root}
	class="relative h-6 w-11 cursor-default rounded-full transition-colors outline-none focus:ring data-[state=unchecked]:bg-input data-[state=checked]:bg-primary border-transparent"
>
	<span
		class="block h-5 w-5 translate-x-0.5 rounded-full bg-background transition-transform will-change-transform
        {$checked && 'translate-x-[22px]'}"
	/>
	<input use:melt={$input} />
	<input type="hidden" name="claimAdviser" value={$checked} />
</button>
