<script lang="ts">
	import Alert from '$components/Alerts/Alert.svelte';
	import StatusIcon from '$components/StatusIcon.svelte';
	import { orderStatusList } from '$lib/client/constants/index.js';
	import { dateParser } from '$lib/client/functions/index.js';
	import { onMount } from 'svelte';
	import OrderConfirmationCell from '$components/OrderConfirmationCell.svelte';
	import { AlertTriangle, Triangle } from 'lucide-svelte';
	import type { Order } from '$types';

	export let data;

	const { user } = data;

	const moneySpent = user.orders.reduce((acc, { price, discount }) => {
		return acc + Number(price) - Number(discount);
	}, 0);

	const moneySaved = user.orders.reduce((acc, { discount }) => {
		return acc + Number(discount);
	}, 0);

	const ordersCount = user.orders.length;

	// const productsCount = user.orders.reduce((acc, {  }) => {
	// 	return acc + productIds.length;
	// }, 0);

	// const oldestOrder = user.orders.sort((a, b) => {
	// 	return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
	// })[0];

	const completedOrdersCount = user.orders.filter(({ status }) => status === 'completed').length;
</script>

<svelte:head>
	<title>{user.fullName} • Twoje ALDO</title>
	<meta name="description" content="Profil użytkownika {user.fullName}" />
</svelte:head>

<div class="w-full flex flex-col items-center justify-start">
	<div class="container space-y-2 ss:space-y-4 flex flex-col h-full px-1 md:px-2 lg:px-4 pt-2 pb-4">
		<h1 class="text-3xl xs:text-4xl font-bold">Profil użytkownika | Design do poprawy!</h1>
		<h2 class="ss:text-xl xs:text-2xl">{user.fullName}</h2>

		<div class="flex flex-col">
			<div class="overflow-x-auto">
				<h3 class="ss:text-lg xs:text-xl">Historia zamówień</h3>
				<table class="table w-full">
					<!-- head -->
					<thead>
						<tr>
							<th>Id</th>
							<th>Status</th>
							<th>Akcja</th>
							<th>Złożono</th>
						</tr>
					</thead>
					<tbody>
						{#each user.orders as order}
							<tr>
								<th>#{order.id}</th>
								<td
									><div class="flex flex-col">
										<span class="font-semibold">{orderStatusList[order.status]}</span>
										<span class="">Dostawa: {orderStatusList[order.deliveryStatus]}</span>
										<span class="">Płatność: {orderStatusList[order.paymentStatus]}</span>
									</div></td
								>
								<td><a href="/zamowienie/sprawdz/{order.id}" class="btn btn-ghost">Sprawdź</a></td>
								<td>{order.createdAt ? dateParser(order.createdAt, 'medium') : '-'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
				{#if user.orders.length === 0}
					<div class="w-full h-20 flex justify-center items-center text-center mb-8">
						<span class="text-2xl sm:text-3xl">Brak zamówień... 🧐</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
