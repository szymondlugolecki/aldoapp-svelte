<script lang="ts">
	import RequiredAsterisk from '$components/custom/required-asterisk.svelte';
	import { producentsList } from '$lib/client/constants';
	import { producents, type Producent } from '$lib/client/constants/dbTypes';
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { cn } from '$lib/client/functions';
	import type { ExtendedProducent } from '$types';

	export let required = false;
	export let horizontal = false;

	export let combobox: ReturnType<typeof createCombobox<ExtendedProducent>>;

	const extendedProducentsList: ['all', ...Producent[]] = ['all', ...producents];
	const toOption = (producent: ExtendedProducent): ComboboxOptionProps<ExtendedProducent> => ({
		value: producent,
		label: producent === 'all' ? 'Wszyscy' : producentsList[producent]
	});

	const {
		elements: { menu, input, option, label },
		states: { open, selected, touchedInput, inputValue },
		helpers: { isSelected }
	} = combobox;

	$: if (!$open) {
		$inputValue = $selected?.label ?? '';
	}

	$: filteredProducentList = $touchedInput
		? extendedProducentsList.filter((producent) => {
				const normalizedInput = $inputValue.toLowerCase();
				return (
					producent.toLowerCase().includes(normalizedInput) ||
					normalizedInput.includes(producent.toLowerCase())
				);
		  })
		: extendedProducentsList;
</script>

<div class={cn(horizontal ? 'grid grid-cols-6 gap-4 items-center' : 'flex flex-col gap-1')}>
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label use:melt={$label} class={cn('col-span-2', horizontal && 'text-end')}>
		<span class="text-sm font-medium text-right">Producent<RequiredAsterisk {required} /></span>
	</label>
	<!-- class="flex items-center justify-between h-10 px-3 pr-12 rounded-md" -->

	<div class="relative col-span-4">
		{#if $selected}
			<input type="hidden" name="producent" value={$selected.value} />
		{/if}
		<input
			use:melt={$input}
			class="flex w-full h-10 px-3 py-2 text-sm bg-transparent border rounded-md border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			placeholder="Producent"
			spellcheck="false"
		/>
		<div class="absolute z-10 -translate-y-1/2 right-1 top-1/2">
			{#if $open}
				<ChevronUp class="square-4" />
			{:else}
				<ChevronDown class="square-4" />
			{/if}
		</div>
	</div>
</div>
{#if $open}
	<ul
		class="z-20 flex max-h-[300px] flex-col overflow-hidden rounded-md bg-background"
		use:melt={$menu}
		transition:slide={{ duration: 150 }}
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div
			class="flex flex-col max-h-full gap-2 px-2 py-2 overflow-y-auto border rounded-md bg-popover"
			tabindex="0"
		>
			{#each filteredProducentList as producent, index (index)}
				<li
					use:melt={$option(toOption(producent))}
					class="relative cursor-pointer scroll-my-2 text-sm rounded-md py-2 pl-4 pr-4 hover:bg-accent data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50"
				>
					{#if $isSelected(producent)}
						<div class="absolute z-10 text-blue-900 check left-2 top-1/2">
							<Check class="square-4" />
						</div>
					{/if}
					<div class="pl-4">
						<span class="font-medium"
							>{producent === 'all' ? 'Wszyscy' : producentsList[producent]}</span
						>
					</div>
				</li>
			{:else}
				<li class="relative py-1 pl-8 pr-4 rounded-md cursor-pointer">Brak wyników</li>
			{/each}
		</div>
	</ul>
{/if}

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2;
		translate: 0 calc(-50% + 1px);
	}
</style>
