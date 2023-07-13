<script lang="ts">
	import { CreditCard, Landmark, Wallet } from 'lucide-svelte';
	import Alert from '$components/Alerts/Alert.svelte';
	import PaymentMethodMethodToggle from '$meltui/Toggle/PaymentMethod.svelte';
	import type { CartLayoutData } from '$types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let data;
	const cartData = getContext<Writable<CartLayoutData>>('cartData');

	$: console.log('cartData - podsumowanie', $cartData);
</script>

<svelte:head>
	<title>Koszyk ({data.cart?.products.length || 0}) • Twoje ALDO</title>
	<meta name="description" content="Podsumowanie zamówienia. Dokończ zamówienie." />
</svelte:head>

<div class="text-left h-full flex flex-col flex-1">
	{#if data.cart}
		<h1 class="text-3xl font-bold">Podsumowanie zamówienia</h1>
		<h2 class="mb-5 text-lg font-medium">Metoda dostawy</h2>
		<p>{data.cart.deliveryMethod}</p>
		<h3 class="mb-5 text-lg font-medium">Metoda płatności</h3>
		<p>{data.cart.paymentMethod}</p>
	{/if}
</div>
