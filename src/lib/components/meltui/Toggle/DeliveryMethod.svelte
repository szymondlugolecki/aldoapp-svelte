<script lang="ts">
	import type { DeliveryMethod } from '$lib/client/constants/dbTypes';
	import { cn } from '$lib/client/functions';
	import type { CartLayoutData } from '$types';
	import { createToggle } from '@melt-ui/svelte';
	import type { Writable } from 'svelte/store';

	export let method: DeliveryMethod;
	export let savedDeliveryMethod: DeliveryMethod;
	export let cartData: Writable<CartLayoutData>;

	const { toggle, pressed } = createToggle({
		pressed: method === savedDeliveryMethod
	});

	let className: string | undefined | null = undefined;
	export { className as class };
	export let ariaLabel: string;

	$: console.log(method, $pressed);

	// Uncomment when theres more than 1 delivery methods
	$: $pressed = method === $cartData.deliveryMethod;
	pressed.subscribe((v) => {
		// if (v) {
		$cartData.deliveryMethod = method;
		// }
		console.log('delivery method', $cartData.deliveryMethod);
	});
</script>

<button
	{...$toggle}
	aria-label={ariaLabel}
	use:toggle
	class={cn(
		'flex items-center justify-center rounded text-base leading-4 shadow-lg data-[disabled]:cursor-not-allowed',
		className
	)}
>
	<slot />
</button>
