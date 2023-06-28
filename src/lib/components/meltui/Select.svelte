<script lang="ts">
	import { createSelect } from '@melt-ui/svelte';
	import { Check, ChevronDown } from 'lucide-svelte';

	export let options: Record<string, Record<string, string>>;
	export let placeholder: string;
	export let ariaLabel: string;
	export let showSections = false;
	export let selectedValue: string | null = null;
	export let name: string | undefined = undefined;

	const { trigger, menu, option, isSelected, label, value } = createSelect({
		required: true,
		value: selectedValue
	});

	value.subscribe((v) => {
		selectedValue = v as string | null;
	});
</script>

<button
	class="trigger xxs:w-[200px] xs:w-[260px] w-[150px] text-xs xs:text-base truncate"
	type="button"
	{...$trigger}
	aria-label={ariaLabel}
>
	{$label || placeholder}
	<ChevronDown />
</button>

{#if name}
	<input type="hidden" aria-hidden="true" {name} value={$value} />
{/if}

<ul
	class="flex rounded-md p-1 max-h-[360px] flex-col gap-2 overflow-y-auto z-40 bg-background border border-border"
	{...$menu}
>
	{#each Object.entries(options) as [key, arr]}
		{#if showSections}
			<li class="py-1 px-4 font-semibold capitalize">{key}</li>
		{/if}
		{#each Object.entries(arr) as [key, item]}
			<li class="option" {...$option({ value: key })}>
				{#if $isSelected(key)}
					<div class="check absolute left-2 top-1/2 text-primary">
						<Check size={20} />
					</div>
				{/if}
				{item}
			</li>
		{/each}
	{/each}
</ul>

<style lang="postcss">
	.label {
		@apply py-1 pl-4 pr-4 font-semibold capitalize text-foreground;
	}

	.option {
		@apply relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-foreground;
		@apply focus:bg-background focus:text-foreground;
	}
	.trigger {
		@apply flex h-10 items-center justify-between rounded-md px-3;
		@apply py-2 text-foreground hover:opacity-75;
	}
	.check {
		translate: 0 calc(-50% + 1px);
	}
</style>
