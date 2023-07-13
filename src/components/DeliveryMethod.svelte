<script lang="ts">
	import type { DeliveryMethod } from '$lib/client/constants/dbTypes';
	import type { CartLayoutData } from '$types';
	import type { Writable } from 'svelte/store';

	export let cartData: Writable<CartLayoutData>;
	export let name: string;
	export let description: string;
	export let id: DeliveryMethod;
	export let price: string;
</script>

<input
	type="radio"
	{id}
	name="delivery"
	value={id}
	class="hidden peer"
	required
	bind:group={$cartData.deliveryMethod}
	checked={id === $cartData.deliveryMethod}
/>

<label
	for={id}
	class="inline-flex items-center justify-between w-full p-5 border border-base-300 hover:border-primary hover:text-primary-focus rounded-lg cursor-pointer dark:peer-checked:primary peer-checked:border-primary peer-checked:text-primary"
>
	<div class="flex justify-between items-center w-full space-x-3">
		<div class="w-full flex-1">
			<div class="w-full text-sm xxs:text-base xs:text-lg font-semibold">{name}</div>
			<div class="w-full text-xs xxs:text-sm xs:text-base text-base-content">{description}</div>
		</div>

		<div class="">
			<span class="text-sm xs:text-base font-semibold">{price}</span>
		</div>

		<div class="w-[48px] xs:w-[60px] text-base-content">
			<slot />
		</div>
	</div>
</label>
