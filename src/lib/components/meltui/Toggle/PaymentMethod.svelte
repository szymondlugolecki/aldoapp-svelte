<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PaymentMethod } from '$lib/client/constants/dbTypes';
	import { cn } from '$lib/client/functions';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import type { CartLayoutData } from '$types';
	import { createToggle } from '@melt-ui/svelte';
	import type { Writable } from 'svelte/store';

	export let method: PaymentMethod;
	export let savedPaymentMethod: PaymentMethod;
	export let cartData: Writable<CartLayoutData>;

	const { toggle, pressed } = createToggle({
		pressed: method === savedPaymentMethod
	});

	let className: string | undefined | null = undefined;
	export { className as class };
	export let ariaLabel: string;

	$: $pressed = method === $cartData.paymentMethod;

	$: console.log(method, $pressed);

	pressed.subscribe((v) => {
		if (v) {
			$cartData.paymentMethod = method;
		}
	});
</script>

<button
	{...$toggle}
	aria-label={ariaLabel}
	use:toggle
	class={cn(
		'items-center text-base leading-4 shadow-lg data-[disabled]:cursor-not-allowed border-2 border-transparent data-[state=on]:border-border px-3 h-24 rounded-lg w-full flex justify-start',
		className
	)}
>
	<slot />
</button>
