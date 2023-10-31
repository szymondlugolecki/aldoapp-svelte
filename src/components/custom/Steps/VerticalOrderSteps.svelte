<script lang="ts">
	import type { OrderStatus } from '$lib/client/constants/dbTypes';
	import { cn } from '$lib/client/functions';

	export let orderStatus: OrderStatus;
	const steps = ['Sprawdzanie dostępności', 'Oczekiwanie na wysyłkę', 'Wysłano', 'Dostarczono'];
	let className: string | null | undefined;
	export { className as class };

	const getCurrentStep = (status: OrderStatus): number => {
		switch (status) {
			case 'awaitingOffice':
				return 0;
			case 'awaitingShipment':
				return 1;
			case 'awaitingDelivery':
				return 2;
			case 'delivered':
				return 3;
			default:
				return -1;
		}
	};

	const currentStep = getCurrentStep(orderStatus);
</script>

<div class={cn(className)}>
	<ol>
		{#each steps as step, i}
			<li class="[&:not(:last-child)]:pb-10 flex justify-start relative">
				{#if currentStep > i && i < 3}
					<div class="w-[.125rem] h-full top-4 left-4 bg-blue-600 absolute mt-1" />
				{/if}
				<span class="flex items-center w-full h-9">
					{#if currentStep >= i + 1}
						<span
							class="relative z-10 flex items-center justify-center bg-blue-600 rounded-full square-8"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="white"
								aria-hidden="true"
								class="square-6"
								><path
									fill-rule="evenodd"
									d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
									clip-rule="evenodd"
								/></svg
							>
						</span>
					{:else if currentStep === i}
						<span
							class="bg-background relative flex justify-center items-center rounded-full square-8 z-10 border-[2px] border-blue-600"
						>
							<span class="bg-blue-600 rounded-full square-2" />
						</span>
					{:else}
						<span
							class="relative flex justify-center items-center rounded-full square-8 z-10 border-border border-[2px]"
						/>
					{/if}
					<div class="flex flex-col ml-4">
						<span class="text-sm font-medium">{step}</span>
					</div>
				</span>
			</li>
		{/each}
	</ol>
</div>

<!-- <div class={cn('p-8', className)}>
	<h2 class="text-xl font-medium">Status zamówienia</h2>
	<div class="flex flex-row-reverse justify-center mt-6 gap-x-8">
		<div class="w-2 h-64 rounded-full bg-muted">
			<div class={cn('bg-blue-600 rounded-full w-2', status[0])} />
		</div>
		<div class="grid grid-rows-4 text-sm font-medium">
			<div class={cn('self-center text-right', currentStep >= 0 && 'text-blue-600')}>
				Sprawdzanie dostępności
			</div>
			<div class={cn('self-center text-right', currentStep >= 1 && 'text-blue-600')}>
				Oczekiwanie na wysyłkę
			</div>
			<div class={cn('self-center text-right', currentStep >= 2 && 'text-blue-600')}>Wysłano</div>
			<div class={cn('self-center text-right', currentStep >= 3 && 'text-blue-600')}>Dostarczono</div>
		</div>
	</div>
</div> -->
