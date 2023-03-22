<script lang="ts">
	import { page } from '$app/stores';
	import { roleNames, salesmenMenu } from '$lib/client/constants';
	import { LogOut } from 'lucide-svelte';
	import type { CartProductWithQuantity, Role, SessionUser } from '../../types';
	import { fade, slide } from 'svelte/transition';
	import { cart } from '$lib/client/stores/cart';
	import { onMount } from 'svelte';
	import wretch from 'wretch';

	let cartLocalProducts: CartProductWithQuantity[] = $cart || [];
	let fetchingStatus: 'success' | 'error' | 'loading' | 'fetching' = 'fetching';

	onMount(async () => {
		console.log('cart', $cart);

		try {
			const data = await wretch('/api/cart').get().json();
			console.log('data', data);
		} catch (error) {
			cartLocalProducts = [];
			fetchingStatus = 'error';
		}
	});

	// export let data
</script>

<svelte:head>
	<title>Koszyk {$cart.length ? `(${$cart.length}) ` : ''}• Twoje ALDO</title>
	<meta
		name="description"
		content="Strona sklepu Twoje ALDO. Znajdź produkty, które Cię interesują. Zamów online."
	/>
</svelte:head>

<section class="w-full h-full flex flex-col flex-1">
	<div class="flex flex-col items-start">
		{#if cartLocalProducts === null}
			<div class="text-center">
				<h1 class="text-2xl font-bold">Wystąpił błąd</h1>
				<p class="text-gray-500">Nie udało się pobrać koszyka</p>
			</div>
		{:else if cartLocalProducts.length === 0}
			<div class="text-center">
				<h1 class="text-2xl font-bold">Twój koszyk jest pusty</h1>
				<p class="text-gray-500">Dodaj produkty do koszyka</p>
			</div>
		{:else}
			<div class="text-center">
				<h1 class="text-2xl font-bold">Twój koszyk</h1>
				{#each cartLocalProducts as product}
					<div>
						{product.name}
					</div>
				{/each}
			</div>
		{/if}
	</div>
	<div />
</section>
