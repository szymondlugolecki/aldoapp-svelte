<script lang="ts">
	import { Car } from 'lucide-svelte';
	import { cart } from '$lib/client/stores/cart';
	import { onMount } from 'svelte';
	import DeliveryMethod from '$components/DeliveryMethod.svelte';
	import {
		orderAddressValidation,
		orderCityValidation,
		orderStreetValidation,
		orderZipCodeValidation
	} from '$lib/client/schemas/order';

	onMount(() => {
		cart.update((oldCart) => ({
			...oldCart,
			address: {
				...oldCart.address,
				email: data.user?.email || ''
			}
		}));
	});

	export let data;

	$: $cart && ($cart.isAddressValid = orderAddressValidation.safeParse($cart.address).success);
</script>

<svelte:head>
	<title
		>Koszyk {$cart?.productsQuantity ? `(${$cart.productsQuantity.length}) ` : ''}• Twoje ALDO</title
	>
	<meta name="description" content="Wybierz metodę dostawy. Dokończ zamówienie." />
</svelte:head>

<div class="text-left h-full flex flex-col xs:p-2 space-y-4 flex-1">
	<h1 class="text-3xl font-bold">Dostawa 🚚</h1>

	<h2 class="mb-5 text-lg font-medium">Wybierz metodę dostawy</h2>
	<ul class="flex flex-col w-full xs:max-w-[500px] space-y-4">
		<li>
			<DeliveryMethod
				name="Kierowca ALDO"
				description="Nasz kierowca dostarczy do Ciebie w ciągu 3 dni"
				id="personal-delivery"
				price="Gratis!"
			>
				<Car size={50} class="-scale-x-100" />
			</DeliveryMethod>
		</li>
	</ul>

	<div class="form-control max-w-[180px]">
		<label class="label cursor-pointer">
			<span class="label-text">Inny adres dostawy</span>
			<input
				type="checkbox"
				bind:checked={$cart.isAddressDifferent}
				class="checkbox checkbox-primary"
			/>
		</label>
	</div>

	{#if $cart && $cart.deliveryMethod === 'personal-delivery' && $cart.isAddressDifferent}
		<div class="flex flex-col space-y-2">
			<h3 class="text-lg font-medium">Dane do wysyłki</h3>
			<div class="form-control w-full">
				<label class="label" for="first-name">
					<span class="label-text">Ulica i numer*</span>
				</label>
				<input
					type="text"
					placeholder="Wpisz tu ulicę i numer..."
					name="first-name"
					class="input input-bordered w-full max-w-3xl text-sm xs:text-base"
					required
					bind:value={$cart.address.street}
					class:input-success={$cart.address.street?.length > 0 &&
						orderStreetValidation.safeParse($cart.address.street).success}
					class:input-error={$cart.address.street?.length > 0 &&
						!orderStreetValidation.safeParse($cart.address.street).success}
				/>
			</div>
			<div class="flex space-x-3 max-w-3xl ">
				<div class="form-control w-full">
					<label class="label" for="first-name">
						<span class="label-text">Kod pocztowy*</span>
					</label>
					<input
						type="text"
						placeholder="Wpisz tu kod pocztowy..."
						name="address-zip-code"
						class="input input-bordered w-full max-w-xs text-sm xs:text-base"
						required
						bind:value={$cart.address.zipCode}
						class:input-success={$cart.address.zipCode?.length > 0 &&
							orderZipCodeValidation.safeParse($cart.address.zipCode).success}
						class:input-error={$cart.address.zipCode?.length > 0 &&
							!orderZipCodeValidation.safeParse($cart.address.zipCode).success}
					/>
				</div>
				<div class="form-control w-full">
					<label class="label" for="first-name">
						<span class="label-text">Miasto*</span>
					</label>
					<input
						type="text"
						placeholder="Wpisz tu miasto..."
						name="address-city"
						class="input input-bordered w-full text-sm xs:text-base"
						required
						bind:value={$cart.address.city}
						class:input-success={$cart.address.city?.length > 0 &&
							orderCityValidation.safeParse($cart.address.city).success}
						class:input-error={$cart.address.city?.length > 0 &&
							!orderCityValidation.safeParse($cart.address.city).success}
					/>
				</div>
			</div>
		</div>
	{/if}
</div>
