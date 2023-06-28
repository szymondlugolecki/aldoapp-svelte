<script lang="ts">
	import { fodderNames, fodderCategories2 } from '$lib/client/constants';
	import type { MainCategory } from '$lib/client/constants/dbTypes';
	import Select from '$meltui/Select.svelte';
	import Label from '$shadcn/label/Label.svelte';
	import type { Subcategory } from '$types';
	import { writable } from 'svelte/store';

	export let defaultCategory: MainCategory | undefined = undefined;
	export let defaultSubcategory: Subcategory | undefined = undefined;

	let selectedCategory = writable<MainCategory | null>(defaultCategory || null);
	let selectedSubcategory: Subcategory | null = defaultSubcategory || null;

	const categoriesOptions = {
		all: fodderNames as Record<string, string>
	};

	$: subcategoriesOptions = {
		all: $selectedCategory ? fodderCategories2[$selectedCategory] : []
	};

	selectedCategory.subscribe(() => {
		selectedSubcategory = null;
	});
</script>

<fieldset class="space-y-2">
	<div class="grid grid-cols-6 items-center gap-4">
		<Label
			for="category"
			class="text-right flex justify-end col-span-2 text-xs xss:text-sm xs:text-base"
			>Kategoria
			<span class="text-red-500">*</span>
		</Label>
		<div class="col-span-4">
			<Select
				bind:selectedValue={$selectedCategory}
				options={categoriesOptions}
				placeholder="Wybierz kategorię"
				ariaLabel="Kategoria"
				name="category"
			/>
		</div>
	</div>

	{#key $selectedCategory}
		{#if $selectedCategory && $selectedCategory !== 'backyard'}
			<div class="grid grid-cols-6 items-center gap-4">
				<Label
					for="subcategory"
					class="text-right flex justify-end col-span-2 text-xs xss:text-sm xs:text-base"
					>Podkategoria
					<span class="text-red-500">*</span>
				</Label>
				<div class="col-span-4">
					<Select
						bind:selectedValue={selectedSubcategory}
						options={subcategoriesOptions}
						placeholder="Wybierz podkategorię"
						ariaLabel="Podkategoria"
						name="subcategory"
					/>
				</div>
			</div>
		{/if}
	{/key}
</fieldset>
