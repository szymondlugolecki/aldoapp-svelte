<script lang="ts">
	import Alert from '$components/Alerts/Alert.svelte';
	import StatusIcon from '$components/StatusIcon.svelte';
	import { orderStatusList } from '$lib/client/constants/index.js';
	import { dateParser } from '$lib/client/functions/index.js';
	import { onMount } from 'svelte';
	import OrderConfirmationCell from '$components/OrderConfirmationCell.svelte';

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
	<div
		class="container space-y-2 ss:space-y-4 flex items-center justify-center flex-col h-full w-[448px] max-w-[320px] ss:max-w-[370px] xs:max-w-none px-3 ss:px-9 pt-2 pb-4 shadow-md"
	>
		<div class="flex items-center space-x-4 text-center">
			<h1 class="text-3xl xs:text-4xl font-bold">Dziękujemy Ci</h1>
			<StatusIcon type="success" />
		</div>
		<h2 class="ss:text-xl xs:text-2xl text-center">Twoje zamówienie zostało przyjęte</h2>

		<h3>Twoje zamówienie</h3>

		<Alert type="info" message="Na twojego maila wysłane zostało potwierdzenie zamówienia." />
	</div>
</div>
