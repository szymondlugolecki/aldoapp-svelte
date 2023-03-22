<script lang="ts">
	import { page } from '$app/stores';
	import { roleNames, salesmenMenu } from '$lib/client/constants';
	import { ArrowRight, LogOut } from 'lucide-svelte';
	import type { CartProductWithQuantity, Role, SessionUser } from '../../types';
	import { fade, slide } from 'svelte/transition';
	import { cart, changeCartState, removeProduct } from '$lib/client/stores/cart';
	import { onMount } from 'svelte';
	import wretch from 'wretch';
	import toast from 'svelte-french-toast';
	import { error } from '@sveltejs/kit';
	import type { Product } from '@prisma/client';
	import { dataset_dev } from 'svelte/internal';

	export let data;

	onMount(async () => {
		const productIds = $cart.products.map((product) => product.id);

		console.log('urlXD', data.url);

		if (!data.url.toLowerCase().endsWith('/zamowienie/koszyk')) return;

		try {
			changeCartState('loading');

			const data = await wretch(`/api/mycart?cart=${productIds.join(',')}`)
				.get()
				.json<{
					success: true;
					products: {
						images: string[];
						symbol: string;
						id: string;
						name: string;
						price: number;
						amountLeft: number;
					}[];
				}>();

			console.log('data', data);

			const cartLocalProducts = data.products.map((product) => {
				return {
					...product,
					quantity: $cart.products.find((p) => p.id === product.id)?.quantity || 1
				};
			});

			cart.update((cartObj) => {
				return { ...cartObj, status: 'verified', products: cartLocalProducts };
			});
		} catch (error) {
			let errorMessage = 'Wystąpił błąd podczas pobierania koszyka';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			toast.error(errorMessage);
			cart.update((cartObj) => {
				return { ...cartObj, status: 'error' };
			});
		}
	});

	$: subtotal = $cart.products
		? $cart.products.map(({ price, quantity }) => price * quantity).reduce((a, b) => a + b, 0)
		: 0;

	const stageNames = ['Koszyk', 'Dostawa', 'Płatność', 'Potwierdzenie'];
	const stages = ['cart', 'delivery', 'payment', 'confirmation'] as const;
	let stageIndex: number = 0;

	// export let data

	$: console.log('cart', $cart);
</script>

<section class="w-full flex flex-col items-center">
	<ul class="steps py-2">
		<li data-content="🛒" class="step {stageIndex >= 0 ? 'step-primary' : 'step-neutral'}">
			{stageNames[0]}
		</li>
		<li data-content="🚚" class="step {stageIndex >= 1 ? 'step-primary' : 'step-neutral'}">
			{stageNames[1]}
		</li>
		<li data-content="💵" class="step {stageIndex >= 2 ? 'step-primary' : 'step-neutral'}">
			{stageNames[2]}
		</li>
		<li data-content="👍" class="step {stageIndex >= 3 ? 'step-primary' : 'step-neutral'}">
			{stageNames[3]}
		</li>
	</ul>

	<div class="divider" />

	{#if $cart.products && $cart.products.length === 0}
		<div class="text-center">
			<h1 class="text-2xl xxs:text-3xl sm:text-5xl font-bold mb-1 xxs:mb-1.5 sm:mb-2">
				Koszyk jest pusty 😔
			</h1>
			<a
				class="xxs:text-lg sm:text-xl text-base-content hover:text-primary py-1 xxs:py-1.5 sm:py-2"
				href="/sklep">Kliknij tutaj, aby przejść do sklepu 🛍️</a
			>
		</div>
	{:else}
		<div class="w-full h-full flex">
			<slot />
			<div class="divider divider-horizontal" />
			<div class="min-w-[300px] h-full flex flex-col space-y-6 sticky top-0">
				<h2 class="text-2xl font-bold">Podsumowanie 📒</h2>
				<div class="flex flex-col space-y-2">
					<div class="flex justify-between items-center">
						<span>Suma częściowa</span>
						<bold class="font-semibold">{subtotal.toFixed(2)} PLN</bold>
					</div>
					<div class="flex justify-between items-center">
						<span>Przesyłka</span>
						<bold class="font-semibold">{(10).toFixed(2)} PLN</bold>
					</div>
					<div class="flex justify-between items-center">
						<span>VAT</span>
						<bold class="font-semibold">{(subtotal * 0.23).toFixed(2)} PLN</bold>
					</div>
					<div class="flex justify-between items-center">
						<bold class="font-bold">Suma całkowita</bold>
						<bold class="font-bold">{(subtotal + 10 + subtotal * 0.23).toFixed(2)} PLN</bold>
					</div>
				</div>
				<a href="/zamowienie/dostawa" class="btn btn-primary"
					>{stageNames[stageIndex + 1]} <ArrowRight /></a
				>
			</div>
		</div>
	{/if}
</section>
