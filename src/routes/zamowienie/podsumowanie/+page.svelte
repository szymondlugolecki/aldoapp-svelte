<script lang="ts">
	import { CreditCard, Landmark, Wallet } from 'lucide-svelte';
	import Alert from '$components/Alerts/Alert.svelte';
	import PaymentMethodMethodToggle from '$meltui/Toggle/PaymentMethod.svelte';
	import type { CartLayoutData } from '$types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { paymentMethodsList } from '$lib/client/constants/index.js';

	export let data;
	const cartData = getContext<Writable<CartLayoutData>>('cartData');

	$: console.log('cartData - podsumowanie', $cartData);
</script>

<svelte:head>
	<title>Koszyk ({data.cart?.products.length || 0}) • Twoje ALDO</title>
	<meta name="description" content="Podsumowanie zamówienia. Dokończ zamówienie." />
</svelte:head>

<div class="text-left h-full flex flex-col flex-1 space-y-4">
	{#if data.cart}
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			Potwierdzenie zamówienia
		</h1>

		<div>
			<b class="mb-5 text-lg font-medium">Metoda dostawy</b>
			<p>{data.cart.deliveryMethod === 'personal-delivery' ? 'Kierowca ALDO' : '?'}</p>
		</div>

		<div>
			<b class="mb-5 text-lg font-medium">Metoda płatności</b>
			<p>{paymentMethodsList[data.cart.paymentMethod]}</p>
		</div>
	{/if}
</div>
