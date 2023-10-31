<script lang="ts">
	import { type PaymentMethod, paymentMethods } from '$lib/client/constants/dbTypes';
	import type { CartLayoutData } from '$types';
	import type { Writable } from 'svelte/store';

	export let cartData: Writable<CartLayoutData>;

	import { createToggleGroup, melt } from '@melt-ui/svelte';
	import { deliveryMethodsList, paymentMethodsList } from '$lib/client/constants';
	import { Car, Landmark, LucideComponent, Wallet } from 'lucide-svelte';

	const {
		elements: { root, item }
	} = createToggleGroup({
		type: 'single',
		onValueChange: ({ next }) => {
			$cartData.paymentMethod = next as PaymentMethod | undefined;
			return next;
		},
		defaultValue: $cartData.paymentMethod,
		orientation: 'vertical'
	});

	const icon: Record<PaymentMethod, typeof LucideComponent> = {
		cash: Wallet,
		transfer: Landmark
	};
</script>

<div
	use:melt={$root}
	class="flex items-center data-[orientation='vertical']:flex-col"
	aria-label="Metoda dostawy"
>
	{#each paymentMethods as method}
		<button
			class="flex text-left space-x-4 w-80 px-4 py-1 h-full rounded-md transition-colors data-[state='on']:bg-primary/90 data-[state='on']:text-primary-foreground focus:z-10"
			use:melt={$item(method)}
		>
			<svelte:component this={icon[method]} size={50} class="self-center" />
			<div class="self-start py-2">
				<bold class="font-semibold text-lg">{paymentMethodsList[method]}</bold>
				{#if method === 'cash'}
					<p class="text-sm">Przy odbiorze</p>
				{:else if method === 'transfer'}
					<p class="text-sm">Na podany rachunek bankowy</p>
				{/if}
			</div>
		</button>
	{/each}
</div>
