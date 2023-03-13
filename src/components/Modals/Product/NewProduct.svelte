<script lang="ts">
	import { enhance } from '$app/forms';
	import { fodderCategories, fodderNames } from '$lib/client/constants';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { MainCategories } from '@prisma/client';

	let files: FileList;
	let productImages: string[] = [];

	function getBase64(image: FileList[number], index: number) {
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			if (e.target) {
				const base64 = e.target.result?.toString();
				if (base64) {
					productImages[index] = base64;
				}
			}
		};
	}

	type Category = (typeof MainCategories)[keyof typeof MainCategories];

	// Default category - cattle
	let selectedCategory: Category = 'cattle';
	let selectedSubcategory: (typeof fodderCategories)[keyof typeof fodderCategories][number];

	$: subcategoriesList = fodderCategories[selectedCategory];

	$: {
		console.log(selectedCategory, selectedSubcategory && selectedSubcategory['name']);
	}
</script>

<form
	class="flex flex-col space-y-4"
	method="post"
	action="?/add"
	use:enhance={() => {
		const toastId = createLoadingToast('please-wait');
		return async ({ result, update }) => {
			handleFormResponse(result, toastId);
			update();
		};
	}}
>
	<h3 class="text-xl font-medium p-0 text-base-content">Dodaj nowy produkt</h3>
	<div>
		<label for="name" class="label label-text"> Nazwa </label>
		<input
			type="text"
			name="name"
			placeholder="np. Jęczmień - ziarno /Big Bag"
			class="input input-bordered w-full text-base-content"
			required
		/>
	</div>
	<div>
		<label for="name" class="label label-text"> Symbol </label>
		<input
			type="text"
			name="symbol"
			placeholder="np. 100004775"
			class="input input-bordered w-full text-base-content"
			required
		/>
	</div>
	<div>
		<label for="description" class="label label-text">Opis</label>
		<textarea
			placeholder="np. fajna pasza dla fajnej krowy 😉"
			class="textarea textarea-bordered textarea-lg w-full"
		/>
	</div>

	<div>
		<label for="name" class="label label-text"> Kategoria </label>
		<select
			id="category-selection"
			name="category"
			class="select select-bordered w-full"
			required
			bind:value={selectedCategory}
		>
			{#each Object.values(MainCategories) as mainCategory}
				<option value={mainCategory}>{fodderNames[mainCategory]}</option>
			{/each}
		</select>
	</div>

	<div>
		<label for="name" class="label label-text"> Podkategoria </label>
		<select
			id="subcategory-selection"
			name="subcategory"
			class="select select-bordered w-full"
			required
			bind:value={selectedSubcategory}
		>
			{#each subcategoriesList as secondCategory}
				<option value={secondCategory}>{secondCategory['name']}</option>
			{/each}
		</select>
	</div>

	<div>
		<label for="thumbnail" class="label label-text">Zdjęcie</label>
		<input
			name="thumbnail"
			multiple
			type="file"
			accept=".png,.jpg,.webp"
			class="file-input file-input-bordered file-input-secondary w-full"
			bind:files
			on:change={() => {
				for (let q = 0; q < files.length; q++) {
					const file = files.item(q);
					if (file) {
						getBase64(file, q);
					}
				}
			}}
		/>
		<div class="grid grid-cols-3 gap-2 py-2">
			{#each productImages as productImage}
				<img src={productImage} width="96px" height="96px" alt="Przesłane zdjęcie" />
			{/each}
		</div>
	</div>
	<button type="submit" class="btn btn-primary w-full">Dodaj</button>
</form>
