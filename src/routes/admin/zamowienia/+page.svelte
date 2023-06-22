<script lang="ts">
	import type { OrderFilter, OrderWithCustomer } from '$types';
	import toast from 'svelte-french-toast';
	import type { OrderStatus } from '$lib/client/constants/dbTypes';
	import Preview from '$components/Modals/Preview.svelte';
	import { orderStatusList } from '$lib/client/constants/index.js';
	import { dateParser } from '$lib/client/functions/index.js';

	// const orderParser = (orders: DefaultOrderList) => {
	// 	return orders.reduce<OrderWithCustomer[]>((acc, row) => {
	// 		const { attachedDriver, attachedCustomer, order } = row;

	// 		if (attachedCustomer) {
	// 			return [
	// 				...acc,
	// 				{
	// 					...order,
	// 					attachedCustomer,
	// 					attachedDriver
	// 				}
	// 			];
	// 		} else {
	// 			return acc;
	// 		}
	// 	}, []);
	// };

	// id, produkty, cena, status, kierowca, klient, platnosc i dostawa, złożono
</script>

<svelte:head>
	<title>Zamówienia • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista zamówień złożonych w Twoje ALDO."
	/>
</svelte:head>

<section class="w-full h-full p-2 space-y-3" />
