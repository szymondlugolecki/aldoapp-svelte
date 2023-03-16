<script lang="ts">
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import type { ProductWithAuthorAndImage } from '$types';
	import { X } from 'lucide-svelte';

	export let product: ProductWithAuthorAndImage | undefined;
</script>

{#if product}
	<form
		class="flex flex-col space-y-4"
		method="post"
		action="?/remove"
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
		<div class="flex justify-between items-center">
			<h3 class="text-xl font-medium p-0 text-base-content">Usuń produkt</h3>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<label
				tabindex="0"
				on:keypress={function (event) {
					if (event.key === 'Enter') {
						event.currentTarget.click();
					}
				}}
				for="admin-drawer"
				class="btn btn-ghost rounded-full px-3"><X /></label
			>
		</div>

		<h4>Czy na pewno chcesz usunąć produkt?</h4>

		<p>
			<b>{product.name}</b> - {product.symbol}
		</p>

		<div class="w-full flex space-x-4">
			<button type="submit" class="btn btn-error flex-1">Tak, usuń ⚠️</button>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<label tabindex="0" for="admin-drawer" class="btn btn-info flex-1">Nie, cofnij 😮‍💨</label>
		</div>

		<input hidden value={product.id} name="id" id="id" />
	</form>
{:else}
	<p class="text-xl font-medium p-0 text-base-content">Nie znaleziono wybranego produktu 😥</p>
{/if}
