<script lang="ts">
	import { page } from '$app/stores';
	import { roleNames, salesmenMenu } from '$lib/client/constants';
	import { ArrowRight, LogOut } from 'lucide-svelte';
	import type { CartProductWithQuantity, Role, SessionUser } from '../../../types';
	import { fade, slide } from 'svelte/transition';
	import { cart, changeCartState, removeProduct } from '$lib/client/stores/cart';
	import { onMount } from 'svelte';
	import wretch from 'wretch';
	import toast from 'svelte-french-toast';
	import { error } from '@sveltejs/kit';
	import Alert from '$components/Alerts/Alert.svelte';
</script>

<svelte:head>
	<title>Koszyk {$cart.products.length ? `(${$cart.products.length}) ` : ''}• Twoje ALDO</title>
	<meta
		name="description"
		content="Strona sklepu Twoje ALDO. Znajdź produkty, które Cię interesują. Zamów online."
	/>
</svelte:head>

<div class="text-left container h-full flex flex-col p-2 space-y-6">
	<h1 class="text-3xl font-bold">Twój koszyk 🛒</h1>

	{#if $cart.status === 'verified'}
		<div class="flex flex-col space-y-3">
			{#each $cart.products as product}
				<div class="flex">
					<div class="rounded">
						<img width="96px" height="96px" src={product.images[0]} alt={product.name} />
					</div>
					<div class="flex-1 py-0.5 px-3 flex">
						<div class="flex flex-col items-start flex-1">
							<bold class="font-bold">{product.name}</bold>
							<small>{product.symbol}</small>
							<bold class="font-bold mt-auto">{product.price} PLN</bold>
						</div>
						<div>
							<button class="btn btn-ghost btn-sm" on:click={() => removeProduct(product.id)}
								>Usuń</button
							>
						</div>
					</div>
				</div>
				<div class="divider " />
			{/each}
		</div>
	{:else if $cart.status === 'error'}
		<Alert message="Nieudało się pobrać koszyka" type="error" />
	{:else if $cart.status === 'loading'}
		<span class="sr-only">Ładowanie produktów</span>
		<div class="flex flex-col space-y-3">
			{#each Array(3) as _, i}
				<div role="status" class="flex animate-pulse md:space-x-4 md:flex md:items-center max-h-24">
					<div class="rounded">
						<svg
							class="w-24 h-24 text-base-content"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
							fill="currentColor"
							viewBox="0 0 640 512"
							><path
								d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"
							/></svg
						>
					</div>
					<div class="flex-1 py-0.5 px-3 flex h-full">
						<div class="flex flex-col pb-3">
							<div class="h-2.5 bg-base-content rounded-full w-[200px] mb-4" />
							<div class="h-2 bg-base-content rounded-full w-16" />
							<div class="h-2 bg-base-content rounded-full w-16 mt-auto" />
						</div>
					</div>
				</div>
				<div class="divider" />
			{/each}
		</div>
	{/if}
</div>
