<script lang="ts">
	import { createSelect } from '@melt-ui/svelte';
	import { Check, ChevronDown } from 'lucide-svelte';

	const { trigger, menu, option, isSelected } = createSelect();

	const options = {
		fruits: ['Apple', 'Banana', 'Pineapple'],
		vegetables: ['Broccoli', 'Potato', 'Tomato']
	};
</script>

<button
	class="flex h-10 w-[180px] items-center justify-between rounded-md bg-white px-3 py-2 text-magnum-700 outline-none hover:opacity-75 focus:ring focus:ring-magnum-400"
	{...$trigger}
	aria-label="Food"
>
	{'Select an option'}
	<!-- $selectedText ||  -->
	<ChevronDown />
</button>

<ul
	class="z-10 flex max-h-[360px] flex-col gap-2 overflow-y-auto rounded-md bg-white p-1"
	{...$menu}
>
	{#each Object.entries(options) as [key, arr]}
		<li class="py-1 pl-4 pr-4 font-semibold capitalize text-neutral-800">{key}</li>
		{#each arr as item}
			<li
				class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800 outline-none focus:bg-magnum-100 focus:text-magnum-700"
				{...$option({ value: item })}
			>
				{#if $isSelected(item)}
					<div class="check absolute left-2 top-1/2 text-magnum-500">
						<Check />
					</div>
				{/if}
				{item}
			</li>
		{/each}
	{/each}
</ul>

<style lang="postcss">
	.check {
		translate: 0 calc(-50% + 1px);
	}
</style>
