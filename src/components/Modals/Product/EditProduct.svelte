<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { PUBLIC_WEBSITE_URL } from '$env/static/public';
	import { fodderCategories, fodderNames } from '$lib/client/constants';
	import { mainCategories } from '$lib/client/constants/dbTypes';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import type {
		Category,
		FileInputEvent,
		FileWithBase64,
		ImagesList,
		ProductWithAuthorAndImage
	} from '$types';
	import { Edit, PlusCircle, Trash2, X } from 'lucide-svelte';
	import ModalHeader from '../ModalHeader.svelte';

	export let product: ProductWithAuthorAndImage | undefined;

	let images: ImagesList = {};

	const randomId = function (length = 6) {
		return Math.random()
			.toString(36)
			.substring(2, length + 2);
	};

	function addBase64ToFile(imageId: string) {
		// This will find the image with by the given id
		// Convert it to base64 and add it to the file object
		const reader = new FileReader();
		const image = images[imageId];

		console.log('image', typeof image, image);
		if (image) {
			reader.readAsDataURL(image);
			reader.onload = (e) => {
				if (e.target) {
					const base64 = e.target.result?.toString();
					if (base64) {
						images[imageId]['base64'] = base64;
						e.target;
					}
				}
			};
		}
	}

	function onImageChange(event: FileInputEvent, id: string) {
		console.log(id, 'input change', event.currentTarget.files);
		const newFile = event.currentTarget.files && event.currentTarget.files[0];
		if (newFile) {
			images[id] = newFile;
			addBase64ToFile(id);
		}
	}

	function onImageAdd(e: FileInputEvent) {
		// New image is added
		// Generate a random uuid for the image
		// And start converting it to base64, to display it in the preview
		if (!browser) return;
		const newFile = e.currentTarget.files && e.currentTarget.files[0];
		if (newFile) {
			const imageId = crypto.randomUUID();
			const uniqueFile: FileWithBase64 = Object.assign(newFile, { base64: undefined });
			images[imageId] = uniqueFile;
			addBase64ToFile(imageId);
		}
	}

	$: {
		console.log('selectedSubcategory', selectedSubcategory);
	}

	// Default category - cattle
	let selectedCategory: Category | undefined = product?.category;
	let selectedSubcategory: string;

	$: subcategoriesList = selectedCategory ? fodderCategories[selectedCategory] : [];

	$: {
		if (product && selectedCategory) {
			selectedSubcategory = product.subcategory;
		}
	}
</script>

{#if product}
	<form
		class="flex flex-col space-y-6"
		method="post"
		action="?/edit"
		on:submit={() => {
			drawer.update((value) => {
				if (!value) return undefined;
				return {
					...value,
					open: false
				};
			});
		}}
		use:enhance={() => {
			const toastId = createLoadingToast('please-wait');
			return async ({ result, update }) => {
				handleFormResponse(result, toastId);
				drawer.set(undefined);
				update();
			};
		}}
	>
		<ModalHeader title="Edytuj produkt" />

		<div>
			<label for="name" class="label label-text"> Nazwa </label>
			<input
				type="text"
				name="name"
				class="input input-bordered w-full text-base-content"
				value={product.name}
				required
			/>
		</div>
		<div class="flex space-x-4">
			<div class="flex-1">
				<label for="name" class="label label-text"> Symbol </label>
				<input
					type="text"
					name="symbol"
					class="input input-bordered w-full text-base-content"
					value={product.symbol}
					required
				/>
			</div>
			<div class="w-28 sm:w-36">
				<label for="price" class="label label-text"> Cena </label>
				<input
					type="number"
					name="price"
					value={product.price}
					class="input input-bordered w-full text-base-content"
					required
				/>
			</div>
		</div>
		<div>
			<label for="description" class="label label-text">Opis</label>
			<textarea
				name="description"
				id="description"
				value={product.description}
				class="textarea textarea-bordered textarea-lg w-full"
			/>
		</div>

		<div>
			<label for="name" class="label label-text"> Kategoria </label>
			<select
				id="category"
				name="category"
				class="select select-bordered w-full"
				required
				bind:value={selectedCategory}
				on:change={() => {
					if (subcategoriesList[0]) {
						selectedSubcategory = subcategoriesList[0].id;
					}
				}}
			>
				{#each mainCategories as mainCategory}
					<option value={mainCategory}>{fodderNames[mainCategory]}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="name" class="label label-text"> Podkategoria </label>
			<select
				id="subcategory"
				name="subcategory"
				class="select select-bordered w-full"
				bind:value={selectedSubcategory}
			>
				{#each subcategoriesList as secondCategory}
					<option value={secondCategory.id}>{secondCategory['name']}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="images" class="label label-text">Zdjęcie</label>
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2">
				{#each Object.entries(images) as [id, imageFile] (id)}
					<div class="w-fit flex-col">
						<input
							type="file"
							accept="image/*"
							hidden
							class="file-input file-input-ghost"
							name="image-{id}"
							id="image-{id}"
							on:change={(e) => onImageChange(e, id)}
						/>

						<img
							src={imageFile['base64']}
							width="96px"
							height="96px"
							alt="Przesłane zdjęcie"
							class="max-h-24"
						/>

						<div class="flex justify-between items-center">
							<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
							<label
								for="image-{id}"
								tabindex="0"
								class="label cursor-pointer hover:bg-base-content hover:bg-opacity-30 duration-150 rounded-md py-1.5 px-1.5"
							>
								<Edit />
							</label>
							<button
								class="cursor-pointer hover:bg-base-content hover:bg-opacity-30 duration-150 rounded-md py-1.5 px-1.5"
								type="button"
								on:click={(e) => {
									delete images[id];
									images = images;
									e.preventDefault();
								}}><Trash2 color="#ff6b6b" /></button
							>
						</div>
					</div>
				{/each}
				<div class="h-24 w-24">
					<input
						type="file"
						name="add-new-image"
						id="add-new-image"
						accept="image/*"
						class="file-input file-input-ghost"
						hidden
						on:change={function (event) {
							onImageAdd(event);
							this.files = null;
							this.value = '';
						}}
					/>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<label
						for="add-new-image"
						tabindex="0"
						class="label cursor-pointer p-1 bg-opacity-10 bg-base-content hover:bg-opacity-30 duration-150 justify-center h-full rounded-md"
					>
						<PlusCircle size={36} />
					</label>
				</div>
			</div>
		</div>
		<button type="submit" class="btn btn-primary w-full">Dodaj</button>

		<input type="hidden" hidden value={product.id} name="id" />
	</form>
{:else}
	<p>Nie znaleziono wybranego produktu 😥</p>
{/if}
