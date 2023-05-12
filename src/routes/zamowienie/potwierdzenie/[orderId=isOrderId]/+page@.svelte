<script lang="ts">
	import { cart, clearCart, type CartStore } from '$lib/client/stores/cart';
	import Alert from '$components/Alerts/Alert.svelte';
	import StatusIcon from '$components/StatusIcon.svelte';
	import { orderStatusList } from '$lib/client/constants/index.js';
	import { dateParser } from '$lib/client/functions/index.js';
	import { onMount } from 'svelte';
	import OrderConfirmationCell from '$components/OrderConfirmationCell.svelte';

	export let data;
	const { order } = data;

	let innerWidth = 0;
	let innerHeight = 0;

	// $: console.log(innerWidth, innerHeight);

	const DAY = 1000 * 60 * 60 * 24;

	const getEstimatedDeliveryTime = (orderCreatedAt: Date) => {
		// 3 days from now but not on weekends
		// and hour between 8 - 16
		const deliveryDays = 3;
		let orderCreatedAtTs = orderCreatedAt.getTime() + deliveryDays * DAY;
		const dayInXDays = new Date(orderCreatedAtTs).getDay();
		// console.log('dayInXDays', dayInXDays);
		if (dayInXDays === 6) {
			// if its saturday in X days, add 2 more days (so its monday)
			orderCreatedAtTs += 2 * DAY;
		} else if (dayInXDays === 0) {
			// respectively
			orderCreatedAtTs += DAY;
		}

		const estimatedDeliveryTime = new Date(new Date(orderCreatedAtTs).setHours(12, 0, 0, 0));

		return estimatedDeliveryTime;
	};

	let cartSnapshot: CartStore | null = null;
	let cartCleared = false;

	$: if ($cart && $cart.productsQuantity.length && !cartSnapshot) {
		cartSnapshot = $cart;
	}

	onMount(() => {
		if (order && order.products.length && $cart && $cart.productsQuantity.length) {
			if (
				order.products.every((product) =>
					Boolean(
						$cart.productsQuantity.find(
							(cartProduct) =>
								cartProduct.id === product.productId && cartProduct.quantity === product.quantity
						)
					)
				)
			) {
				clearCart();
				cartCleared = true;
			}
		}
	});
</script>

<svelte:head>
	<title>Potwierdzenie zamówienia • Twoje ALDO</title>
	<meta name="description" content="Potwierdzenie złożonego zamówienia." />
</svelte:head>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="w-full flex flex-col items-center justify-start">
	{#if innerWidth && innerHeight}
		{#await import('@neoconfetti/svelte') then { confetti }}
			<div
				class="w-full"
				use:confetti={{
					duration: 2750,
					force: 0.3,
					particleCount: 75,
					destroyAfterDone: true,
					stageWidth: innerWidth - 20,
					stageHeight: 900 // innerHeight - 65
				}}
			/>
		{/await}
	{/if}
	<div
		class=" border-x border-base-content border-opacity-10 container space-y-2 ss:space-y-4 flex items-center justify-center flex-col h-full w-[448px] max-w-[320px] ss:max-w-[370px] xs:max-w-none px-3 ss:px-9 pt-2 pb-4 shadow-md"
	>
		<div class="flex items-center space-x-4 text-center">
			<h1 class="text-3xl xs:text-4xl font-bold">Dziękujemy Ci</h1>
			<StatusIcon type="success" />
		</div>
		<h2 class="ss:text-xl xs:text-2xl text-center">Twoje zamówienie zostało przyjęte</h2>

		<h3>Twoje zamówienie</h3>
		<div class="grid grid-cols-2 gap-2">
			<OrderConfirmationCell title="Numer zamówienia" value="#{order.id}" />
			<OrderConfirmationCell title="Kwota" value="{order.price} zł" />
			<OrderConfirmationCell
				title="Metoda płatności"
				value={order.paymentMethod === 'cash' ? 'Gotówka' : 'Przelew bankowy'}
			/>
			<OrderConfirmationCell title="Metoda dostawy" value="Kurier" />
			<!-- {#if order.deliveryMethod !== 'personal-pickup'} -->
			<!-- <OrderConfirmationCell
				title="Adres dostawy"
				value={order.address
					? `${order.address.zipCode} ${order.address.city}, ${order.address.street}`
					: `Adres nie został podany! ⚠️`}
			/> -->
			<!-- {/if} -->
			<OrderConfirmationCell title="Czas dostawy" value="W ciągu 3 dni roboczych" />
			<OrderConfirmationCell
				title="Data złożenia zamówienia"
				value={dateParser(order.createdAt, 'long')}
			/>

			{#if order.paymentMethod !== 'cash'}
				<OrderConfirmationCell
					title="Status płatności"
					value={orderStatusList[order.paymentStatus]}
				/>
			{/if}
		</div>

		<Alert type="info" message="Na twojego maila wysłane zostało potwierdzenie zamówienia." />

		{#if cartSnapshot && cartSnapshot.productsQuantity && cartSnapshot.productsQuantity.length && cartCleared}
			<div class="flex flex-col items-center w-full space-y-1">
				<span>Koszyk został wyczyszczony</span>
				<button
					class="btn btn-ghost"
					on:click={() => {
						if (cartSnapshot) {
							cart.set(cartSnapshot);
							import('svelte-french-toast').then(({ toast }) =>
								toast('Przywrócono koszyk', { icon: '🛒' })
							);
						}
					}}>Przywróć mój koszyk!</button
				>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}
</style>
