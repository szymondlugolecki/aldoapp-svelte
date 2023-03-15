<script lang="ts">
	import { enhance } from '$app/forms';
	import { fodderCategories, fodderNames } from '$lib/client/constants';
	import { arrayUniqueByKey } from '$lib/client/functions';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { MainCategories } from '@prisma/client';
	import { X } from 'lucide-svelte';

	interface UniqueFile extends File {
		id: string;
		base64?: string;
	}

	let files: UniqueFile[] = [];

	function getBase64(image: UniqueFile) {
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			if (e.target) {
				const base64 = e.target.result?.toString();
				if (base64) {
					const fileIndex = files.findIndex((file) => file.id === image.id);
					if (fileIndex !== -1) {
						files[fileIndex]['base64'] = base64;
						files = files;
					}
				}
			}
		};
	}

	function onAddImages(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		const uploadedFiles = e.currentTarget.files;
		if (uploadedFiles) {
			for (let q = 0; q < uploadedFiles.length; q++) {
				const uploadedFile = uploadedFiles[q];
				const uuid = crypto.randomUUID();
				const fileWithId: UniqueFile = Object.assign(uploadedFile, { id: uuid });
				files = arrayUniqueByKey([...files, fileWithId], 'id');
				getBase64(fileWithId);
			}
		}
	}

	$: {
		console.log(files);
	}

	type Category = (typeof MainCategories)[keyof typeof MainCategories];

	// Default category - cattle
	let selectedCategory: Category = 'cattle';
	let selectedSubcategory: (typeof fodderCategories)[keyof typeof fodderCategories][number];

	$: subcategoriesList = fodderCategories[selectedCategory];
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
	<div class="flex space-x-4">
		<div class="flex-1">
			<label for="name" class="label label-text"> Symbol </label>
			<input
				type="text"
				name="symbol"
				placeholder="np. 100004775"
				class="input input-bordered w-full text-base-content"
				required
			/>
		</div>
		<div class="w-28 sm:w-36">
			<label for="price" class="label label-text"> Cena </label>
			<input
				type="number"
				name="price"
				placeholder="np. 49,99"
				class="input input-bordered w-full text-base-content"
				required
			/>
		</div>
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
			on:change={() => {
				if (subcategoriesList[0]) {
					selectedSubcategory = subcategoriesList[0];
				}
			}}
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
		<label for="images" class="label label-text">Zdjęcie</label>
		<input
			name="images"
			multiple
			type="file"
			accept="image/*"
			class="file-input file-input-bordered file-input-secondary w-full"
			on:change={onAddImages}
		/>
		<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2">
			{#each files as image, index}
				<div class="w-fit flex items-center">
					<input
						type="file"
						accept="image/*"
						class="file-input file-input-ghost"
						name="file-input-{image.id}"
						id="file-input-{image.id}"
						hidden
					/>
					<!-- on:change={(e) => {
							const newFile = e.currentTarget.files && e.currentTarget.files[0];
							if (newFile) {
								// const newLength = files.push(newFile);
								getBase64(newFile, index);
							}
						}} -->
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<label
						for="file-input-{image.id}"
						tabindex="0"
						class="cursor-pointer p-1 indicator group h-full"
					>
						<div class="indicator h-full">
							<!-- {#if index === 0}
								<span class="indicator-item indicator-center badge badge-accent">Miniaturka</span>
							{/if} -->
							<img
								src={image['base64']}
								width="96px"
								height="96px"
								alt="Przesłane zdjęcie"
								class="max-h-24"
							/>
							<div class="indicator-item indicator-bottom">
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<button
									class="hidden group-hover:flex bg-transparent rounded-full border border-base-content p-0.5 h-auto min-h-0"
									type="button"
									on:click={() => {
										files = files.filter((file) => file.id !== image.id);
									}}><X /></button
								>
							</div>
						</div>
					</label>
				</div>
			{/each}
		</div>
		<!-- {#if fileImages.length}
				<div class="h-24 w-24">
					<input
						type="file"
						name="add-new-image"
						id="add-new-image"
						accept="image/*"
						class="file-input file-input-ghost"
						hidden
						on:change={function (e) {
							const newFile = e.currentTarget.files && e.currentTarget.files[0];
							if (newFile) {
								const newLength = files.push(newFile);
								getBase64(newFile, newLength - 1);
								this.files = null;
							}
						}}
					/>
					svelte-ignore a11y-no-noninteractive-tabindex
					<label
						for="add-new-image"
						tabindex="0"
						class="label cursor-pointer p-1 hover:bg-base-content hover:bg-opacity-30 duration-150 justify-center h-full rounded-md"
					>
						<PlusCircle size={36} />
					</label>
				</div>
			{/if} -->
	</div>
	<button type="submit" class="btn btn-primary w-full">Dodaj</button>
</form>
