<script lang="ts">
	import Alert from '$components/Alerts/Alert.svelte';
	import StatusIcon from '$components/StatusIcon.svelte';
	import { orderStatusList } from '$lib/client/constants/index.js';
	import { dateParser } from '$lib/client/functions/index.js';
	import { onMount } from 'svelte';
	import OrderConfirmationCell from '$components/OrderConfirmationCell.svelte';
	import { AlertTriangle, Triangle } from 'lucide-svelte';
	import UserOrderCell from '$components/UserOrderCell.svelte';

	export let data;
	const { order } = data;
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
</script>

<svelte:head>
	<title>Zamówienie #{order.id} • Twoje ALDO</title>
	<meta name="description" content="Szczegóły zamówienia nr" />
</svelte:head>

<div class="w-full flex flex-col items-center justify-start">
	<div class="container space-y-2 ss:space-y-4 flex flex-col h-full px-1 ss:px-3 sm:px-6 pt-2 pb-4">
		<h1 class="text-3xl xs:text-4xl font-bold">Zamówienie #{order.id}</h1>
		<h2 class="ss:text-xl xs:text-2xl">Dane zamówienia</h2>
		<div class="grid grid-cols-3 gap-2">
			<UserOrderCell title="Kwota" value={order.price} />
			<UserOrderCell title="Rabat" value={order.discount} />
			<UserOrderCell
				title="Kwota bez rabatu"
				value={(Number(order.price) - Number(order.discount)).toFixed(2)}
			/>
		</div>

		<UserOrderCell title="Stan" value={orderStatusList[order.status]} />

		<div class="grid grid-cols-2 gap-2">
			<UserOrderCell title="Płatność" value={orderStatusList[order.paymentStatus]} />
			<UserOrderCell title="Dostawa" value={orderStatusList[order.deliveryStatus]} />
		</div>

		<div class="grid grid-cols-2 gap-2">
			<UserOrderCell title="Data złożenia zamówienia" value={dateParser(order.createdAt, 'long')} />
			<UserOrderCell
				title="Oczekiwana data realizacji"
				value={order.estimatedDeliveryDate
					? dateParser(order.estimatedDeliveryDate, 'long')
					: 'Jeszcze nie potwierdzono...'}
			/>
		</div>

		<div class="grid grid-cols-2 gap-2">
			<UserOrderCell
				title="Metoda płatności"
				value={order.paymentMethod === 'cash' ? 'Gotówka' : 'Płatność online'}
			/>
			<UserOrderCell
				title="Metoda dostawy"
				value={order.deliveryMethod === 'personal-delivery'
					? 'Dostawa osobista'
					: 'Odbiór osobisty'}
			/>
		</div>

		{#if order.address}
			<UserOrderCell
				title="Adres dostawy"
				value={[`${order.address.city}, ${order.address.zipCode}`, order.address.street]}
			/>
		{/if}

		{#if order.customer}
			<UserOrderCell
				title="Klient"
				value={[order.customer.fullName, order.customer.email, order.customer.phone]}
			/>
		{:else if data.user}
			<UserOrderCell
				title="Klient"
				value={[data.user.fullName, data.user.email, data.user.phone]}
			/>
		{/if}

		<h3 class="ss:text-xl xs:text-2xl">Produkty ({data.products.length})</h3>

		<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
			{#each data.products as product}
				<div class="flex flex-col items-center text-center shadow-md py-3 px-2 rounded-md">
					<span class="text-sm">{product.name}</span>
					<img alt="Zdjęcie produktu" src={product.images[0]} width="50px" />
					<span class="text-sm">{product.symbol}</span>
					<span class="text-lg font-bold">{product.price} zł</span>
				</div>
			{/each}
		</div>

		<div class="flex flex-col shadow-md p-4 rounded-md space-y-2">
			<span class="text-xl">Zarządzaj zamówieniem</span>
			<div class="grid grid-cols-2 gap-4">
				<button
					class="btn btn-info flex-1"
					on:click={() => {
						console.log('refund request');
					}}
					class:btn-disabled={order.deliveryStatus !== 'delivered'}>Zarządaj zwrot</button
				>
				<button
					class="btn btn-error flex-1"
					on:click={() => {
						console.log('cancel request');
					}}
					class:btn-disabled={order.deliveryStatus !== 'pending'}>Anuluj zamówienie</button
				>
			</div>
		</div>
	</div>
</div>
