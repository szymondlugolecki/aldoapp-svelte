<script lang="ts">
	import { createCheckbox } from '@melt-ui/svelte';
	import { Check, Minus } from 'lucide-svelte';

	export let checked: boolean | 'indeterminate' = false;

	const { root, input, isChecked, isIndeterminate } = createCheckbox({
		checked
	});

	isChecked.subscribe((value) => {
		checked = value;
	});
	export let label: string;
</script>

<!-- flex h-6 w-6 appearance-none items-center justify-center rounded-sm bg-white text-magnum-600 shadow-lg hover:opacity-75 -->

<form>
	<div class="flex items-center justify-center">
		<button
			{...$root}
			use:root
			class="appearance-none peer h-6 w-6 shrink-0 rounded-sm border border-primary 
			ring-offset-background focus-visible:outline-none 
			focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
			disabled:cursor-not-allowed disabled:opacity-50 
			data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
			id="checkbox"
		>
			{#if $isIndeterminate}
				<Minus size={22} />
			{:else if $isChecked}
				<Check size={22} />
			{/if}
			<input {...$input} />
		</button>
		<label class="pl-[15px] text-[15px] leading-none text-white" for="checkbox">
			{label}
		</label>
	</div>
</form>
