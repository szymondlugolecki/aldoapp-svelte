<script lang="ts">
	import type { OrderStatus } from '$lib/client/constants/dbTypes';
	import { cn } from '$lib/client/functions';

	export let orderStatus: OrderStatus;
	let className: string | null | undefined;
	export { className as class };

	const statusPercentage = (status: OrderStatus): [string, number] => {
		switch (status) {
			case 'awaitingOffice':
				return ['w-[6.25%]', 0];
				break;
			case 'awaitingShipment':
				return ['w-[37.5%]', 1];
				break;
			case 'awaitingDelivery':
				return ['w-[62.5%]', 2];
				break;
			case 'delivered':
				return ['w-full', 3];
				break;
			default:
				return ['w-0', -1];
				break;
		}
	};

	const status = statusPercentage(orderStatus);
</script>

<div class={cn(className)}>
	<div class="rounded-full bg-muted w-full h-2">
		<div class={cn('bg-blue-600 rounded-full h-2', status[0])} />
	</div>
	<div class="grid grid-cols-4 mt-6 text-sm font-medium">
		<div class={cn('text-left', status[1] >= 0 && 'text-blue-600')}>Sprawdzanie dostępności</div>
		<div class={cn('text-center', status[1] >= 1 && 'text-blue-600')}>Oczekiwanie na wysyłkę</div>
		<div class={cn('text-center', status[1] >= 2 && 'text-blue-600')}>Wysłano</div>
		<div class={cn('text-right', status[1] >= 3 && 'text-blue-600')}>Dostarczono</div>
	</div>
</div>
