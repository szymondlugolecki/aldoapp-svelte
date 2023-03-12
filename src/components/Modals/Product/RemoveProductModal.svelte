<script lang="ts">
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
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
			class="flex flex-col space-y-4"
			method="post"
			action="?/remove"
			use:enhance={({ form, data, action, cancel }) => {
				const toastId = createLoadingToast('please-wait');
				return async ({ result, update }) => {
					handleFormResponse(result, toastId);
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

			<div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 text-white">
				<button
					type="button"
					class="flex justify-center items-center w-full text-sm sm:text-base py-1.5 sm:py-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-lg"
					on:click={() => (removeProductModalOpen = false)}
					>Anuluj <CornerDownLeft class="ml-2 w-4 h-4 sm:w-6 sm:h-6" /></button
				>
				<button
					type="submit"
					class="flex justify-center items-center w-full text-sm sm:text-base py-1.5 sm:py-2.5 bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 rounded-lg"
					>Potwierdź <Trash class="ml-2 w-4 h-4 sm:w-6 sm:h-6" /></button
				>
			</div>

			<input type="hidden" hidden value={removeProductModal.id} name="id" />
		</form>
	{:else}
		<p>Błąd. Ten produkt nie istnieje</p>
	{/if}
</Modal>
