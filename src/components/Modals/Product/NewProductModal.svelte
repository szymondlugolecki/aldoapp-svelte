<script lang="ts">
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { Button, Modal, Label, Input, Textarea } from 'flowbite-svelte';
	import toast from 'svelte-french-toast';

	export let newProductModalOpen: boolean;

	let descriptionProps = {
		id: 'description',
		name: 'description',
		rows: 4,
		placeholder: 'Opis produktu...'
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

<!-- New Product Modal -->
<Modal bind:open={newProductModalOpen} size="xs" autoclose={false} class="w-full">
	<form
		class="flex flex-col space-y-6"
		method="post"
		action="?/add"
		use:enhance={() => {
			const toastId = createLoadingToast('please-wait');
			return async ({ result, update }) => {
				handleFormResponse(result, toastId);
				update();
				newProductModalOpen = false;
			};
		}}
	>
		<h3 class="text-xl font-medium 1text-gray-900 dark:text-white p-0">Dodaj nowy produkt</h3>
		<Label class="space-y-2">
			<span>Nazwa</span>
			<Input type="text" name="name" placeholder="Jęczmień - ziarno /Big Bag" required />
		</Label>
		<Label class="space-y-2">
			<span>Symbol</span>
			<Input type="text" name="symbol" placeholder="100004775" required />
		</Label>
		<div>
			<label for="description" class="block text-sm font-medium text-gray-900 dark:text-white"
				>Opis</label
			>
			<Textarea {...descriptionProps} />
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
			<button class="upload-btn" type="button" on:click={() => fileInput.click()}>
				{#if productImage}
					<div class="block">
						<img src={productImage} width="96px" height="96px" alt="Przesłane zdjęcie" />
					</div>
				{:else}
					{'Kliknij aby wybrać'}
				{/if}
			</button>
		</div>
		<Button type="submit" class="w-full">Dodaj</Button>
	</form>
</Modal>
