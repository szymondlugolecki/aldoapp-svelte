<script lang="ts">
	import { enhance } from '$app/forms';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import type { Product } from '@prisma/client';
	import { Button, Modal, Label, Input, Textarea } from 'flowbite-svelte';

	export let editProductModalOpen: boolean;
	export let editProductModal: Product | undefined;

	let descriptionProps = {
		id: 'description',
		name: 'description',
		rows: 4,
		placeholder: 'Brak opisu...'
	};
</script>

<Modal bind:open={editProductModalOpen} size="xs" autoclose={false} class="w-full">
	{#if editProductModal}
		<form
			class="flex flex-col space-y-6"
			method="post"
			action="?/edit"
			use:enhance={({ form, data, action, cancel }) => {
				return async ({ result, update }) => {
					handleFormResponse(result, 'Pomyślnie edytowano produkt');
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

			<Button type="submit" class="w-full">Zatwierdź</Button>
			<input type="hidden" hidden value={editProductModal.id} name="id" />
		</form>
	{:else}
		<p>Błąd. Ten produkt nie istnieje</p>
	{/if}
</Modal>
