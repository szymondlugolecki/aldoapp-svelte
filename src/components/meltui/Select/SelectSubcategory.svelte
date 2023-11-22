<script lang="ts">
	import { fodderCategories2 } from '$lib/client/constants';
	import type { MainCategory } from '$lib/client/constants/dbTypes';
	import type { ExtendedCategory, Subcategory } from '$types';
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';
	import { cn, getSubcategories, getSubcategoryName } from '$lib/client/functions';

	export let combobox: ReturnType<typeof createCombobox<Subcategory>>;
	export let category: ExtendedCategory;

	export let required = false;

	const toOption = (subcategory: Subcategory): ComboboxOptionProps<Subcategory> => ({
		value: subcategory,
		label: getSubcategoryName(category, subcategory)
	});

	const {
		elements: { menu, input, option, label },
		states: { open, selected, touchedInput, inputValue },
		helpers: { isSelected }
	} = combobox;

	$: if (!$open) {
		$inputValue = $selected?.label ?? '';
	}

	$: filteredSubcategoryList = $touchedInput
		? subcategories.filter((subcategory) => {
				const normalizedInput = $inputValue.toLowerCase();
				return (
					subcategory.toLowerCase().includes(normalizedInput) ||
					normalizedInput.includes(subcategory.toLowerCase())
				);
		  })
		: subcategories;

	$: subcategories = getSubcategories(category);
</script>

<fieldset class="flex flex-col gap-1">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label use:melt={$label}>
		<span class={cn('font-medium text-right text-sm')}
			>Podkategoria<RequiredAsterisk {required} /></span
		>
	</label>

	<div class="relative col-span-4">
		{#if $selected}
			<input type="hidden" name="subcategory" value={$selected.value} />
		{/if}

		<input
			use:melt={$input}
			class="flex w-full h-10 px-3 py-2 text-sm bg-transparent border rounded-md border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			placeholder="Podkategoria"
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
</fieldset>
{#if $open}
	<ul
		class="z-20 flex max-h-[300px] flex-col overflow-hidden rounded-md bg-background"
		use:melt={$menu}
		transition:slide={{ duration: 150 }}
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div class="flex flex-col max-h-full gap-2 px-2 py-2 overflow-y-auto" tabindex="0">
			{#each filteredSubcategoryList as subcategory, index (index)}
				<li
					use:melt={$option(toOption(subcategory))}
					class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4 hover:bg-pink-100 data-[highlighted]:bg-pink-200 data-[highlighted]:text-pink-900 data-[disabled]:opacity-50"
				>
					{#if $isSelected(subcategory)}
						<div class="absolute z-10 text-pink-900 check left-2 top-1/2">
							<Check class="square-4" />
						</div>
					{/if}
					<div class="pl-4">
						<span class="font-medium">{getSubcategoryName(category, subcategory)}</span>
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
