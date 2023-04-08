<script lang="ts">
	import { cart, clearCart, type CartStore } from '$lib/client/stores/cart';
	import Alert from '$components/Alerts/Alert.svelte';
	import StatusIcon from '$components/StatusIcon.svelte';
	import { orderStatusList } from '$lib/client/constants/index.js';
	import { dateParser } from '$lib/client/functions/index.js';
	import { onMount } from 'svelte';
	import OrderConfirmationCell from '$components/OrderConfirmationCell.svelte';

	export let data;
	const { order, message } = data;

	let innerWidth = 0;
	let innerHeight = 0;

	$: console.log(innerWidth, innerHeight);

	const DAY = 1000 * 60 * 60 * 24;

	const getEstimatedDeliveryTime = (orderCreatedAt: Date) => {
		// 3 days from now but not on weekends
		// and hour between 8 - 16
		const deliveryDays = 3;
		let orderCreatedAtTs = orderCreatedAt.getTime() + deliveryDays * DAY;
		const dayInXDays = new Date(orderCreatedAtTs).getDay();
		console.log('dayInXDays', dayInXDays);
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

	$: if ($cart && $cart.products.length && !cartSnapshot) {
		cartSnapshot = $cart;
	}

	onMount(() => {
		if (order && order.products.length && $cart && $cart.products.length) {
			console.log('passed 1');
			if (
				order.products.every((product) =>
					Boolean(
						$cart.products.find(
							(cartProduct) =>
								cartProduct.id === product.productId && cartProduct.quantity === product.quantity
						)
					)
				)
			) {
				console.log('clearing');
				clearCart();
				cartCleared = true;
			}
		}
	});
</script>

<svelte:head>
	<title>Potwierdzenie • Twoje ALDO</title>
	<meta name="description" content="Wybierz metodę dostawy. Dokończ zamówienie." />
</svelte:head>

<svelte:window bind:innerWidth bind:innerHeight />

{#if order}
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
			class="container space-y-2 ss:space-y-4 flex items-center justify-center flex-col h-full w-[448px] max-w-[320px] ss:max-w-[370px] xs:max-w-none px-3 ss:px-9 pt-2 pb-4 shadow-md"
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
					value={order.paymentMethod === 'cash' ? 'Gotówka' : 'Płatność internetowa'}
				/>
				<OrderConfirmationCell
					title="Metoda dostawy"
					value={order.deliveryMethod === 'personal-pickup' ? 'Odbiór osobisty' : 'Kurier'}
				/>
				{#if order.deliveryMethod !== 'personal-pickup'}
					<OrderConfirmationCell
						title="Adres dostawy"
						value={order.address
							? `${order.address.zipCode} ${order.address.city}, ${order.address.street}`
							: `Adres nie został podany! ⚠️`}
					/>
				{/if}
				<OrderConfirmationCell
					title="Oczekiwany czas dostawy"
					value={dateParser(getEstimatedDeliveryTime(order.createdAt), 'long')}
				/>
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

			<!-- <div class="flex flex-col space-y-4 w-full">
				<div class="flex flex-col space-y-2">
					<div class="flex justify-between space-x-1">
						<div class="flex flex-col space-y-1">
							<span class="text-sm">Numer zamówienia</span>
							<span class="text-sm xxs:text-base ss:text-lg font-bold">#{order.id}</span>
						</div>
						<div class="flex flex-col space-y-1">
							<span class="text-sm">Data złożenia zamówienia</span>
							<span class="text-sm xxs:text-base ss:text-lg font-bold"
								>{dateParser(order.createdAt, 'long')}</span
							>
						</div>
					</div>
				</div>
				<div class="flex justify-between space-x-1">
					<div class="flex flex-col space-y-2">
						<span class="text-base ss:text-lg">Dostawa</span>
						<div class="flex flex-col space-y-2">
							<div class="flex flex-col space-y-1">
								<span class="text-sm">Metoda dostawy</span>
								<span class="text-sm xxs:text-base ss:text-lg font-bold"
									>{order.deliveryMethod === 'personal-pickup' ? 'Odbiór osobisty' : 'Kurier'}</span
								>
							</div>
							{#if order.deliveryMethod !== 'personal-pickup'}
								<div class="flex flex-col space-y-1">
									<span class="text-sm">Adres dostawy</span>
									<span class="text-xs xs:text-lg font-bold">
										{order.address
											? `${order.address.zipCode} ${order.address.city}, ${order.address.street}`
											: `Adres nie został podany! ⚠️`}
									</span>
								</div>
							{/if}
							<div class="flex flex-col space-y-1">
								<span class="text-sm">Oczekiwany czas dostawy</span>
								<span class="text-sm xxs:text-base ss:text-lg font-bold"
									>{dateParser(getEstimatedDeliveryTime(order.createdAt), 'long')}</span
								>
							</div>
						</div>
					</div>
					<div class="flex flex-col flex-1 space-y-2">
						<h4 class="text-base ss:text-lg">Płatność</h4>
						<div class="flex flex-col space-y-2">
							<div class="flex flex-col space-y-1">
								<span class="text-sm">Kwota</span>
								<span class="text-sm xxs:text-base ss:text-lg font-bold">{order.price} zł</span>
							</div>
							<div class="flex flex-col space-y-1">
								<span class="text-sm">Metoda płatności</span>
								<span class="text-sm xxs:text-base ss:text-lg font-bold"
									>{order.paymentMethod === 'cash' ? 'Gotówka' : 'Płatność internetowa'}</span
								>
							</div>
							{#if order.paymentMethod !== 'cash'}
								<div class="flex flex-col space-y-1">
									<span class="text-sm">Status płatności</span>
									<span class="text-sm xxs:text-base ss:text-lg font-bold"
										>{orderStatusList[order.paymentStatus]}</span
									>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div> -->

			<Alert type="info" message="Na twojego maila wysłane zostało potwierdzenie zamówienia." />

			{#if cartSnapshot && cartSnapshot.products && cartSnapshot.products.length && cartCleared}
				<div class="flex flex-col items-start w-full space-y-1">
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
{:else}
	<div class="text-left h-full flex flex-col xs:p-2 space-y-4 flex-1">
		<h1 class="text-3xl font-bold">{message || 'Niespodziewany błąd'}</h1>
	</div>
{/if}

<style>
	:global(body) {
		overflow-x: hidden;
	}
</style>
