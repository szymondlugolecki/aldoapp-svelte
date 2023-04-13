<script lang="ts">
	import Alert from '$components/Alerts/Alert.svelte';
	import StatusIcon from '$components/StatusIcon.svelte';
	import { orderStatusList } from '$lib/client/constants/index.js';
	import { dateParser } from '$lib/client/functions/index.js';
	import { onMount } from 'svelte';
	import OrderConfirmationCell from '$components/OrderConfirmationCell.svelte';
	import { AlertTriangle, Triangle } from 'lucide-svelte';
	import UserOrderCell from '$components/UserOrderCell.svelte';
	import type { Order } from '$types';

	export let data;

	const { orders, userData } = data;

	type UserOrder = Pick<
		Order,
		| 'id'
		| 'price'
		| 'discount'
		| 'status'
		| 'productIds'
		| 'createdAt'
		| 'deliveryStatus'
		| 'paymentStatus'
	>;

	// const orders = data.userData.reduce<UserOrder[]>((acc, { orders }) => {
	// 	if (!orders) return acc;
	// 	const { id, price, discount, status, products, createdAt, deliveryStatus, paymentStatus } =
	// 		orders;
	// 	return [
	// 		...acc,
	// 		{ id, price, discount, status, products, createdAt, deliveryStatus, paymentStatus }
	// 	];
	// }, []);

	const moneySpent = orders.reduce((acc, { price, discount }) => {
		return acc + Number(price) - Number(discount);
	}, 0);

	const moneySaved = orders.reduce((acc, { discount }) => {
		return acc + Number(discount);
	}, 0);

	const ordersCount = orders.length;

	const productsCount = orders.reduce((acc, { productIds }) => {
		return acc + productIds.length;
	}, 0);

	const oldestOrder = orders.sort((a, b) => {
		return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
	})[0];

	const completedOrdersCount = orders.filter(({ status }) => status === 'completed').length;
</script>

<svelte:head>
	<title>{userData.fullName} • Twoje ALDO</title>
	<meta name="description" content="Profil użytkownika {userData.fullName}" />
</svelte:head>

<div class="w-full flex flex-col items-center justify-start">
	<div class="container space-y-2 ss:space-y-4 flex flex-col h-full px-1 md:px-2 lg:px-4 pt-2 pb-4">
		<h1 class="text-3xl xs:text-4xl font-bold">Profil użytkownika</h1>
		<h2 class="ss:text-xl xs:text-2xl">{userData.fullName}</h2>

		<div class="flex flex-col">
			<div class="overflow-x-auto">
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
						{#each orders as order}
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
								<td>{dateParser(order.createdAt, 'medium')}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
