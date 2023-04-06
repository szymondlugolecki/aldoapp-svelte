<script lang="ts">
	import { Wallet } from 'lucide-svelte';
	import { cart } from '$lib/client/stores/cart';
	import PaymentMethod from '$components/PaymentMethod.svelte';
	import Alert from '$components/Alerts/Alert.svelte';
	import StatusIcon from '$components/StatusIcon.svelte';

	export let data;
	const order = data.orders ? data.orders[0] : null;
</script>

<svelte:head>
	<title>Koszyk {$cart.products ? `(${$cart.products.length}) ` : ''}• Twoje ALDO</title>
	<meta name="description" content="Wybierz metodę dostawy. Dokończ zamówienie." />
</svelte:head>

{#if order}
	<div class="text-left h-full flex flex-col xs:p-2 space-y-4 flex-1">
		<h1 class="text-3xl font-bold">Zamówienie nr {order.id}</h1>
		<StatusIcon type="success" />
		<h2 class="mb-5 text-lg font-medium">Wybierz metodę płatności</h2>
	</div>
{:else}
	<div class="text-left h-full flex flex-col xs:p-2 space-y-4 flex-1">
		<h1 class="text-3xl font-bold">Nie znaleziono zamówienia</h1>
	</div>
{/if}
