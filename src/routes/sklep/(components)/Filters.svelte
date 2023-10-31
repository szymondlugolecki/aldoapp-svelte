<script lang="ts">
	import { page } from '$app/stores';
	import SelectCategories from '$components/meltui/Select/SelectCategoriesFilter.svelte';
	import SelectProducent from '$components/meltui/Select/SelectProducentFilter.svelte';
	import { fodderNames, producentsList } from '$lib/client/constants';
	import { getSubcategoryName } from '$lib/client/functions';
	import type { ExtendedCategory, ExtendedSubcategory, ExtendedProducent } from '$types';
	import { createSlider, melt, createCombobox } from '@melt-ui/svelte';

	export let selectedCategory: ExtendedCategory;
	export let selectedSubcategory: ExtendedSubcategory;
	export let selectedProducent: ExtendedProducent;

	$: priceMin = Number($page.url.searchParams.get('cena_min')) || undefined;
	$: priceMax = Number($page.url.searchParams.get('cena_max')) || undefined;

	const {
		elements: { root, range, thumb },
		states: { value }
	} = createSlider({
		defaultValue: [0, 300],
		min: 0,
		max: 300,
		step: 5
	});

	$: {
		$value[0] = priceMin || 0;
		$value[1] = priceMax || 300;
	}

	$: subcategoryCombobox = createCombobox<ExtendedSubcategory>({
		forceVisible: true,
		defaultSelected:
			!selectedSubcategory || selectedSubcategory === 'all'
				? {
						value: 'all',
						label: 'Wszystkie'
				  }
				: {
						value: selectedSubcategory,
						label: getSubcategoryName(selectedCategory, selectedSubcategory)
				  }
	});

	$: ({
		states: { selected: selectedSubcategoryStore }
	} = subcategoryCombobox);

	$: categoryCombobox = createCombobox<ExtendedCategory>({
		forceVisible: true,
		defaultSelected:
			selectedCategory === 'all'
				? {
						value: 'all',
						label: 'Wszystkie'
				  }
				: { value: selectedCategory, label: fodderNames[selectedCategory] },
		onSelectedChange: ({ curr, next }) => {
			if (curr?.value !== next?.value) {
				$selectedSubcategoryStore = {
					value: 'all',
					label: 'Wszystkie'
				};
			}
			return next;
		}
	});

	$: producentCombobox = createCombobox<ExtendedProducent>({
		forceVisible: true,
		defaultSelected:
			selectedProducent === 'all'
				? {
						value: 'all',
						label: 'Wszyscy'
				  }
				: { value: selectedProducent, label: producentsList[selectedProducent] }
	});
</script>

<form class="grid gap-4 py-4" id="store-filter-form" method="get" action="/sklep">
	<SelectCategories bind:combobox={categoryCombobox} bind:subcategoryCombobox />

	<fieldset class="grid gap-y-1">
		<SelectProducent bind:combobox={producentCombobox} />
	</fieldset>

	<div class="grid gap-y-1">
		<span class="text-sm font-medium">Przedział cenowy</span>

		<span>{$value[0]} zł - {$value[1]} zł</span>

		<input type="hidden" name="cena_min" value={$value[0]} />
		<input type="hidden" name="cena_max" value={$value[1]} />
	</div>

	<div class="pl-[10px]">
		<span use:melt={$root} class="relative flex h-[20px] w-[200px] items-center">
			<span class="block h-[3px] w-full bg-black/40">
				<span use:melt={$range} class="h-[3px] bg-white" />
			</span>

			{#each $value as _}
				<span
					use:melt={$thumb()}
					class="block w-5 h-5 bg-white rounded-full focus:ring-4 focus:ring-black/40"
				/>
			{/each}
		</span>
	</div>
</form>
