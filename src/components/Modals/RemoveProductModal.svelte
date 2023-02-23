<script lang="ts">
	import { enhance } from '$app/forms';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import type { Product } from '@prisma/client';
	import { Button, Modal } from 'flowbite-svelte';
	import { Trash, CornerDownLeft } from 'lucide-svelte';

	export let removeProductModalOpen: boolean;
	export let removeProductModal: Product | undefined;
</script>

<Modal bind:open={removeProductModalOpen} size="xs" autoclose={false} class="w-full">
	{#if removeProductModal}
		<form
			class="flex flex-col space-y-6"
			method="post"
			action="?/remove"
			use:enhance={({ form, data, action, cancel }) => {
				return async ({ result, update }) => {
					handleFormResponse(result, 'Pomyślnie usunięto produkt');
					update();
					removeProductModalOpen = false;
				};
			}}
		>
			<h3 class="text-xl font-medium 1text-gray-900 dark:text-white p-0">Usuń produkt</h3>
			<div>
				<span class="block font-semibold">Nazwa</span>
				<span class="block">{removeProductModal.name}</span>
			</div>
			<div>
				<span class="block font-semibold">Symbol</span>
				<span class="block">{removeProductModal.symbol}</span>
			</div>

			<div class="flex space-x-4">
				<Button type="submit" color="red" class="w-full">Potwierdź <Trash class="ml-2" /></Button>
				<Button
					type="button"
					color="blue"
					class="w-full"
					on:click={() => (removeProductModalOpen = false)}
					>Anuluj <CornerDownLeft class="ml-2" /></Button
				>
			</div>

			<input type="hidden" hidden value={removeProductModal.id} name="id" />
		</form>
	{:else}
		<p>Błąd. Ten produkt nie istnieje</p>
	{/if}
</Modal>
