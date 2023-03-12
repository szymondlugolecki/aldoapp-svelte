<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_WEBSITE_URL } from '$env/static/public';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import type { ProductWithAuthorAndImage } from '$types';
	import { Button, Modal, Label, Input, Textarea } from 'flowbite-svelte';
	import { Eraser } from 'lucide-svelte';
	import toast from 'svelte-french-toast';

	export let editProductModalOpen: boolean;
	export let editProductModal: ProductWithAuthorAndImage | undefined;

	let descriptionProps = {
		id: 'description',
		name: 'description',
		rows: 4,
		placeholder: 'Brak opisu...'
	};

	let fileInput: HTMLInputElement;
	let files: FileList;
	let productImage: string | undefined;

	function getBase64(image: FileList[number]) {
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			if (e.target) {
				productImage = e.target.result?.toString();
			}
		};
	}
</script>

<Modal bind:open={editProductModalOpen} size="xs" autoclose={false} class="w-full">
	{#if editProductModal}
		<form
			class="flex flex-col space-y-6"
			method="post"
			action="?/edit"
			use:enhance={() => {
				const toastId = createLoadingToast('please-wait');
				return async ({ result, update }) => {
					handleFormResponse(result, toastId);
					update();
					editProductModalOpen = false;
				};
			}}
		>
			<h3 class="text-xl font-medium 1text-gray-900 dark:text-white p-0">Edytuj produkt</h3>
			<Label class="space-y-2">
				<span>Nazwa</span>
				<Input
					type="text"
					name="name"
					placeholder="Jęczmień - ziarno /Big Bag"
					required
					value={editProductModal.name}
				/>
			</Label>
			<Label class="space-y-2">
				<span>Symbol</span>
				<Input
					type="text"
					name="symbol"
					placeholder="100004775"
					required
					value={editProductModal.symbol}
				/>
			</Label>
			<div>
				<label for="description" class="block text-sm font-medium text-gray-900 dark:text-white"
					>Opis</label
				>
				<Textarea {...descriptionProps} bind:value={editProductModal.description} />
			</div>

			<div>
				<label for="thumbnail" class="block text-sm font-medium text-gray-900 dark:text-white"
					>Zdjęcie</label
				>
				<input
					class="hidden"
					name="thumbnail"
					type="file"
					accept=".png,.jpg,.webp"
					bind:files
					bind:this={fileInput}
					on:change={() => getBase64(files[0])}
				/>
				<div class="flex justify-between items-end space-x-6">
					<button class="upload-btn" type="button" on:click={() => fileInput.click()}>
						{#if productImage}
							<div class="block">
								<img src={productImage} width="96px" height="96px" alt="Przesłane zdjęcie" />
							</div>
						{:else if editProductModal}
							<img
								width="96px"
								height="96px"
								src={`${PUBLIC_WEBSITE_URL}/products/${editProductModal.images[0]}`}
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
			</div>

			<Button type="submit" class="w-full">Zatwierdź</Button>

			<input type="hidden" hidden value={editProductModal.id} name="id" />
		</form>
	{:else}
		<p>Błąd. Ten produkt nie istnieje</p>
	{/if}
</Modal>
