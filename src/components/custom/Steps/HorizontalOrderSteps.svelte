<script lang="ts">
	import type { DeliveryMethod, OrderStatus } from '$lib/client/constants/dbTypes';
	import { cn } from '$lib/client/functions';

	export let orderStatus: OrderStatus;
	export let deliveryMethod: DeliveryMethod;
	let className: string | null | undefined;
	export { className as class };

	const statusClass = {
		'-1': 'w-0',
		0: 'w-[6.25%]',
		1: 'w-[37.5%]',
		2: 'w-[62.5%]',
		3: 'w-full'
	};

	const getStatusNumber = (status: OrderStatus) => {
		switch (status) {
			case 'awaitingOffice':
				return 0;
			case 'awaitingShipment':
				return 1;
			case 'preparingForPickup':
				return 1;
			case 'awaitingDelivery':
				return 2;
			case 'awaitingPickup':
				return 2;
			case 'delivered':
				return 3;
			case 'pickedUp':
				return 3;
			default:
				return -1;
		}
	};

	const statusQuantified = getStatusNumber(orderStatus);
</script>

<div class={cn(className)}>
	<div class="w-full h-2 rounded-full bg-muted">
		<div class={cn('bg-blue-600 rounded-full h-2', statusClass[statusQuantified])} />
	</div>
	<div class="grid grid-cols-4 mt-6 text-sm font-medium">
		{#if deliveryMethod === 'personal-delivery'}
			<div class={cn('text-left', statusQuantified >= 0 && 'text-blue-600')}>
				Weryfikowanie zamówienia
			</div>
			<div class={cn('text-center', statusQuantified >= 1 && 'text-blue-600')}>
				Oczekiwanie na wysyłkę
			</div>
			<div class={cn('text-center', statusQuantified >= 2 && 'text-blue-600')}>Wysłano</div>
			<div class={cn('text-right', statusQuantified >= 3 && 'text-blue-600')}>Dostarczono</div>
		{:else if deliveryMethod === 'personal-pickup'}
			<div class={cn('text-left', statusQuantified >= 0 && 'text-blue-600')}>
				Weryfikowanie zamówienia
			</div>
			<div class={cn('text-center', statusQuantified >= 1 && 'text-blue-600')}>
				Przygotowywanie przesyłki
			</div>
			<div class={cn('text-center', statusQuantified >= 2 && 'text-blue-600')}>
				Oczekiwanie na odbiór
			</div>
			<div class={cn('text-right', statusQuantified >= 3 && 'text-blue-600')}>Odebrano</div>
		{/if}
	</div>
</div>
