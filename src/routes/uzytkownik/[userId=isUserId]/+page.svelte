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
		| 'products'
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

	const productsCount = orders.reduce((acc, { products }) => {
		return acc + products.length;
	}, 0);

	const oldestOrder = orders.sort((a, b) => {
		return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
	})[0];

	const completedOrdersCount = orders.filter(({ status }) => status === 'completed').length;
	const refundedOrdersCount = orders.filter(({ status }) => status === 'refunded').length;
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

			<div class="flex flex-col md:flex-row lg:flex-col lg:space-y-4 md:space-y-0 space-y-4">
				<div class="collapse">
					<input type="checkbox" />
					<div class="collapse-title text-xl font-medium">Statystyki zamówień</div>
					<div class="collapse-content">
						<div class="stats shadow stats-vertical lg:stats-horizontal">
							<div class="stat">
								<div class="stat-figure text-primary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										class="inline-block w-8 h-8 stroke-current"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/></svg
									>
								</div>
								<div class="stat-title">Ilość zamówień</div>
								<div class="stat-value text-primary text-3xl ss:text-4xl">{ordersCount}</div>
								<div class="stat-desc">Od {dateParser(oldestOrder.createdAt, 'short')}</div>
							</div>

							<div class="stat">
								<div class="stat-figure text-secondary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										class="inline-block w-8 h-8 stroke-current"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/></svg
									>
								</div>
								<div class="stat-title">Ilość produktów</div>
								<div class="stat-value text-secondary text-3xl ss:text-4xl">
									{productsCount}
								</div>
								<div class="stat-desc">kupionych przez aplikację</div>
							</div>

							<div class="stat">
								<div class="stat-figure text-secondary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										class="inline-block w-8 h-8 stroke-current"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/></svg
									>
								</div>
								<div class="stat-value text-3xl ss:text-4xl">
									{((completedOrdersCount / ordersCount) * 100).toFixed(2)}%
								</div>
								<div class="stat-title">Pomyślnych zamówień</div>
								<div class="stat-desc text-secondary">
									{((refundedOrdersCount / ordersCount) * 100).toFixed(2)}% zwróconych
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="collapse">
					<input type="checkbox" />
					<div class="collapse-title text-xl font-medium">Statystyki finansowe</div>
					<div class="collapse-content">
						<div class="stats shadow stats-vertical lg:stats-horizontal">
							<div class="stat">
								<div class="stat-figure text-primary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										class="inline-block w-8 h-8 stroke-current"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/></svg
									>
								</div>
								<div class="stat-title">Łączna kwota zamówień</div>
								<div class="stat-value text-primary text-3xl ss:text-4xl">
									{moneySpent.toFixed(2)} zł
								</div>
								<div class="stat-desc">Kwota uwzględnia kody rabatowe</div>
							</div>

							<div class="stat">
								<div class="stat-figure text-secondary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										class="inline-block w-8 h-8 stroke-current"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/></svg
									>
								</div>
								<div class="stat-title">Kwota bez rabatów</div>
								<div class="stat-value text-secondary text-3xl ss:text-4xl">
									{(moneySpent + moneySaved).toFixed(2)} zł
								</div>
							</div>

							<div class="stat">
								<div class="stat-figure text-secondary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										class="inline-block w-8 h-8 stroke-current"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/></svg
									>
								</div>
								<div class="stat-title">Zaoszczędzono</div>
								<div class="stat-value text-3xl ss:text-4xl">
									{moneySaved.toFixed(2)} zł
								</div>
								<div class="stat-desc">Dzięki kodom rabatowym</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
