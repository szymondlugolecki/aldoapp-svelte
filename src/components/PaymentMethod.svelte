<script lang="ts">
	import type { PaymentMethod } from '$lib/client/constants/dbTypes';
	import { cart } from '$lib/client/stores/cart';

	export let name: string;
	export let description: string;
	export let id: PaymentMethod;
	export let checked = false;
</script>

<input
	type="radio"
	{id}
	name="payment"
	value={id}
	class="hidden peer"
	required
	{checked}
	bind:group={$cart.paymentMethod}
/>
<label
	for={id}
	class="inline-flex items-center justify-between w-full p-5 border border-base-300 hover:border-primary hover:text-primary-focus rounded-lg cursor-pointer dark:peer-checked:primary peer-checked:border-primary peer-checked:text-primary"
>
	<div class="flex justify-between items-center w-full space-x-3">
		<div class="w-full flex-1">
			<div class="w-full text-base xs:text-lg font-semibold">{name}</div>
			<div class="w-full text-sm xs:text-base text-base-content">{description}</div>
		</div>

		<div class="w-[60px] text-base-content">
			<slot />
		</div>
	</div>
</label>
