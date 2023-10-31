<script lang="ts">
	import { type DeliveryMethod, deliveryMethods } from '$lib/client/constants/dbTypes';
	import type { CartLayoutData } from '$types';
	import type { Writable } from 'svelte/store';

	export let cartData: Writable<CartLayoutData>;

	import { createToggleGroup, melt } from '@melt-ui/svelte';
	import { deliveryMethodsList } from '$lib/client/constants';
	import { Car, LucideComponent } from 'lucide-svelte';

	const {
		elements: { root, item }
	} = createToggleGroup({
		type: 'single',
		onValueChange: ({ next }) => {
			$cartData.deliveryMethod = next as DeliveryMethod | undefined;
			return next;
		},
		defaultValue: $cartData.deliveryMethod,
		orientation: 'vertical'
	});

	const icon: Record<DeliveryMethod, typeof LucideComponent> = {
		'personal-delivery': Car
	};
</script>

<div
	use:melt={$root}
	class="flex items-center data-[orientation='vertical']:flex-col"
	aria-label="Metoda dostawy"
>
	{#each deliveryMethods as method}
		<button
			class="max-w-[400px] flex text-left space-x-4 px-4 py-1 h-full border rounded-md transition-colors data-[state='on']:border-primary data-[state='on']:text-primary focus:z-10 bg-muted"
			use:melt={$item(method)}
		>
			<svelte:component this={icon[method]} size={50} class="self-center" />
			<div class="self-start py-1">
				<bold class="font-semibold text-base">{deliveryMethodsList[method]}</bold>
				<p class="text-sm mt-1">Nasz kierowca dostarczy do Ciebie w ciągu 3 dni</p>
			</div>
		</button>
	{/each}
</div>
