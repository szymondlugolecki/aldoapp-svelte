<script lang="ts">
	import { Car } from 'lucide-svelte';
	// import DeliveryMethod from '$components/DeliveryMethod.svelte';

	import Checkbox from '$meltui/Checkbox.svelte';
	import { Input } from '$shadcn/input/index.js';
	import { Label } from '$shadcn/label/index.js';
	import DeliveryMethodToggle from '$meltui/Toggle/DeliveryMethod.svelte';
	import {
		orderStreetValidation,
		orderZipCodeValidation,
		orderCityValidation
	} from '$lib/client/schemas/order.js';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { CartLayoutData } from '$types';
	import type { DeliveryMethod } from '$lib/client/constants/dbTypes.js';

	export let data;

	$: isStreetValid = orderStreetValidation.safeParse($cartData.customAddress.street);
	$: isZipCodeValid = orderZipCodeValidation.safeParse($cartData.customAddress.zipCode);
	$: isCityValid = orderCityValidation.safeParse($cartData.customAddress.city);
	// getContext<Writeable<CartLayoutData>>('cartData')

	const cartData = getContext<Writable<CartLayoutData>>('cartData');

	$: console.log('cartData - dostawa', $cartData);

	// $: $cart && ($cart.isAddressValid = orderAddressValidation.safeParse($cart.address).success);
</script>

<svelte:head>
	<title>Koszyk {data.cart ? `(${data.cart.products.length})` : ''} • Twoje ALDO</title>
	<meta name="description" content="Wybierz metodę dostawy. Dokończ zamówienie." />
</svelte:head>

<div class="text-left h-full flex flex-col flex-1">
	<h1 class="text-3xl font-bold">Dostawa</h1>
	<h2 class="mb-5 text-lg font-medium">Wybierz metodę dostawy</h2>
	{#if data.cart}
		<ul class="flex flex-col w-full xs:max-w-[360px] space-y-4">
			<li>
				<DeliveryMethodToggle
					{cartData}
					ariaLabel="Kierowca ALDO"
					class="border-2 border-transparent data-[state=on]:border-border px-3 h-24 rounded-lg"
					method="personal-delivery"
					savedDeliveryMethod={data.cart.deliveryMethod}
				>
					<div class="flex text-left space-x-4 h-full">
						<Car size={50} class="-scale-x-100 self-center" />
						<div class="self-start py-2">
							<bold class="font-semibold text-lg">Kierowca ALDO</bold>
							<p class="text-sm">Nasz kierowca dostarczy do Ciebie w ciągu 3 dni</p>
						</div>
					</div>
				</DeliveryMethodToggle>
			</li>
		</ul>

		<div class="max-w-[180px] my-6">
			<Checkbox label="Inny adres dostawy" bind:checked={$cartData.useCustomAddress} />
		</div>

		{#if $cartData.useCustomAddress}
			<div class="flex flex-col space-y-4">
				<h2 class="text-lg font-medium">Wpisz inny adres dostawy</h2>

				<!-- <div class="space-y-3"> -->
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for="street">Ulica i numer<span class="text-red-400">*</span></Label>
					<Input
						id="street"
						required
						bind:value={$cartData.customAddress.street}
						placeholder={data.user?.address?.street || 'Ulica i numer'}
						class={isStreetValid && $cartData.customAddress.street.length > 0
							? 'border-green-400'
							: ''}
					/>
				</div>

				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for="zipCode">Kod pocztowy<span class="text-red-400">*</span></Label>
					<Input
						id="zipCode"
						required
						bind:value={$cartData.customAddress.zipCode}
						placeholder={data.user?.address?.zipCode || 'Kod pocztowy'}
						class={isZipCodeValid && $cartData.customAddress.zipCode.length > 0
							? 'border-green-400'
							: ''}
					/>
				</div>

				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for="city">Miasto<span class="text-red-400">*</span></Label>
					<Input
						id="city"
						required
						bind:value={$cartData.customAddress.city}
						placeholder={data.user?.address?.city || 'Miasto'}
						class={isCityValid && $cartData.customAddress.city.length > 0 ? 'border-green-400' : ''}
					/>
				</div>
				<!-- </div> -->
			</div>
		{/if}
	{/if}
</div>
