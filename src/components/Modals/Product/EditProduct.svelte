<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_WEBSITE_URL } from '$env/static/public';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import type { ProductWithAuthorAndImage } from '$types';
	import { Button, Modal, Label, Input, Textarea } from 'flowbite-svelte';
	import { Eraser } from 'lucide-svelte';

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

	export let product: ProductWithAuthorAndImage | undefined;
</script>

{#if product}
	<form
		class="flex flex-col space-y-6"
		method="post"
		action="?/edit"
		use:enhance={() => {
			const toastId = createLoadingToast('please-wait');
			return async ({ result, update }) => {
				handleFormResponse(result, toastId);
				update();
			};
		}}
	>
		<h3 class="text-xl font-medium 1text-gray-900 dark:text-white p-0">Edytuj produkt</h3>

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
		<div>
			<label for="name" class="label label-text"> Symbol </label>
			<input
				type="text"
				name="symbol"
				class="input input-bordered w-full text-base-content"
				value={product.symbol}
				required
			/>
		</div>

		<div>
			<label for="description" class="label label-text">Opis</label>
			<textarea
				bind:value={product.description}
				placeholder="Opis produktu..."
				class="textarea textarea-bordered textarea-lg w-full"
			/>
		</div>

		<div>
			<label for="images" class="label label-text">Zdjęcie</label>
			<input
				name="images"
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

		<div class="flex justify-between items-end space-x-6">
			<button class="upload-btn" type="button" on:click={() => fileInput.click()}>
				{#if productImage}
					<div class="block">
						<img src={productImage} width="96px" height="96px" alt="Przesłane zdjęcie" />
					</div>
				{:else if product}
					<img
						width="96px"
						height="96px"
						src={`${PUBLIC_WEBSITE_URL}/products/${product.images[0]}`}
						alt="Dotychczasowe zdjęcie produktu"
					/>
				{:else}
					{'Kliknij aby wybrać'}
				{/if}
			</button>
			{#if productImage}
				<button
					class="px-4 py-2 font-semibold bg-orange-500 text-white rounded-lg flex hover:bg-orange-700 duration-100"
					type="button"
					on:click={() => {
						productImage = undefined;
						fileInput.value = '';
					}}><Eraser class="mr-2" /> Reset zdjęcia</button
				>
			{/if}
		</div>

		<Button type="submit" class="w-full">Zatwierdź</Button>

		<input type="hidden" hidden value={product.id} name="id" />
	</form>
{:else}
	<p>Nie znaleziono wybranego produktu 😥</p>
{/if}
