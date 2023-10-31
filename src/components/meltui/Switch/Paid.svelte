<script lang="ts">
	import { createSwitch, melt } from '@melt-ui/svelte';
	export let hadPaid: boolean;

	const {
		elements: { root, input },
		states: { checked }
	} = createSwitch({
		defaultChecked: hadPaid
	});
</script>

<button
	use:melt={$root}
	class="relative h-6 w-11 cursor-default rounded-full transition-colors outline-none focus:ring data-[state=unchecked]:bg-destructive/80 data-[state=checked]:bg-success border-transparent"
>
	<span
		class="block h-5 w-5 translate-x-0.5 rounded-full bg-background transition-transform will-change-transform
        {$checked && 'translate-x-[22px]'}"
	/>
	<input use:melt={$input} />
	<input type="hidden" name="paid" value={$checked || false} />
</button>
