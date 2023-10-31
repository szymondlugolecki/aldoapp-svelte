<script lang="ts">
	import { createCheckbox, melt } from '@melt-ui/svelte';
	import { Check, Minus } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let checked = false;
	export let label: string;

	const {
		elements: { root, input },
		helpers: { isChecked }
	} = createCheckbox({
		defaultChecked: checked,
		onCheckedChange: (args) => {
			checked = typeof args.next === 'boolean' ? args.next : false;
			return checked;
		}
	});
	isChecked.subscribe((value) => {
		checked = value;
	});
</script>

<!-- flex h-6 w-6 appearance-none items-center justify-center rounded-sm bg-white text-magnum-600 shadow-lg hover:opacity-75 -->

<form>
	<div class="flex items-center justify-center">
		<button
			{...$root}
			use:root
			class="appearance-none square-5 flex justify-center items-center rounded-sm border border-primary peer hover:cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
			id="checkbox"
		>
			{#if $isChecked}
				<div transition:fade={{ duration: 150 }}>
					<Check size={16} />
				</div>
			{/if}
			<input {...$input} />
		</button>
		<label class="pl-[10px] text-sm leading-none hover:cursor-pointer" for="checkbox">
			{label}
		</label>
	</div>
</form>
