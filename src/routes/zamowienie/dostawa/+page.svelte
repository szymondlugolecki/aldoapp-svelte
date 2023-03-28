<script lang="ts">
	import { ShoppingBag } from 'lucide-svelte';
	import { cart } from '$lib/client/stores/cart';
	import { onMount } from 'svelte';
	import dpdLogo from '$lib/assets/dpd_logo.png?run&width=225&height=100&format=webp';
	import Img from '@zerodevx/svelte-img';
	import DeliveryMethod from '$components/DeliveryMethod.svelte';
	import {
		deliveryValidation,
		orderCityValidation,
		orderEmailValidation,
		orderNameValidation,
		orderPhoneValidation,
		orderStreetValidation,
		orderZipCodeValidation
	} from '$lib/client/schemas/order';

	onMount(() => {
		cart.update((oldCart) => ({
			...oldCart,
			customerName: data.user?.fullName || '',
			delivery: {
				...oldCart.delivery,
				email: data.user?.email || ''
			}
		}));
	});

	export let data;

	$: deliveryValidation.safeParse($cart.delivery).success
		? ($cart.isAddressValid = true)
		: ($cart.isAddressValid = false);
</script>

<svelte:head>
	<title>Koszyk {$cart.products ? `(${$cart.products.length}) ` : ''}• Twoje ALDO</title>
	<meta name="description" content="Wybierz metodę dostawy. Dokończ zamówienie." />
</svelte:head>

<div class="text-left h-full flex flex-col xs:p-2 space-y-4 flex-1">
	<h1 class="text-3xl font-bold">Dostawa 🚚</h1>

	<h2 class="mb-5 text-lg font-medium">Wybierz metodę dostawy</h2>
	<ul class="flex flex-col w-full xs:max-w-[500px] space-y-4">
		<li>
			<DeliveryMethod
				name="Odbiór osobisty"
				description="Gotowe do odbioru w ciągu 3 dni"
				id="personal-pickup"
				price="Gratis!"
			>
				<ShoppingBag size={50} />
			</DeliveryMethod>
		</li>
		<li>
			<DeliveryMethod name="DPD" description="Transport zajmie 3 dni" id="dpd" price="167 PLN">
				<Img src={dpdLogo} height={50} width={112} alt="Logo DPD" />
			</DeliveryMethod>
		</li>
	</ul>

	{#if $cart.deliveryMethod && $cart.deliveryMethod !== 'personal-pickup'}
		<div class="flex flex-col space-y-2">
			<h3 class="text-lg font-medium">Dane do wysyłki</h3>
			<div class="form-control w-full">
				<label class="label" for="first-name">
					<span class="label-text">Imię i nazwisko*</span>
				</label>
				<input
					type="text"
					placeholder="Wpisz tu imię i nazwisko odbiorcy..."
					name="first-name"
					class="input input-bordered w-full"
					required
					bind:value={$cart.customerName}
					class:input-success={$cart.customerName.length > 0 &&
						orderNameValidation.safeParse($cart.customerName).success}
					class:input-error={$cart.customerName.length > 0 &&
						!orderNameValidation.safeParse($cart.customerName).success}
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="first-name">
					<span class="label-text">Ulica i numer*</span>
				</label>
				<input
					type="text"
					placeholder="Wpisz tu ulicę i numer..."
					name="first-name"
					class="input input-bordered w-full"
					required
					bind:value={$cart.delivery.street}
					class:input-success={$cart.delivery.street.length > 0 &&
						orderStreetValidation.safeParse($cart.delivery.street).success}
					class:input-error={$cart.delivery.street.length > 0 &&
						!orderStreetValidation.safeParse($cart.delivery.street).success}
				/>
			</div>
			<div class="flex space-x-3">
				<div class="form-control w-full">
					<label class="label" for="first-name">
						<span class="label-text">Kod pocztowy*</span>
					</label>
					<input
						type="text"
						placeholder="Wpisz tu kod pocztowy..."
						name="address-zip-code"
						class="input input-bordered w-full max-w-xs"
						required
						bind:value={$cart.delivery.zipCode}
						class:input-success={$cart.delivery.zipCode.length > 0 &&
							orderZipCodeValidation.safeParse($cart.delivery.zipCode).success}
						class:input-error={$cart.delivery.zipCode.length > 0 &&
							!orderZipCodeValidation.safeParse($cart.delivery.zipCode).success}
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
						class="input input-bordered w-full max-w-xs"
						required
						bind:value={$cart.delivery.city}
						class:input-success={$cart.delivery.city.length > 0 &&
							orderCityValidation.safeParse($cart.delivery.city).success}
						class:input-error={$cart.delivery.city.length > 0 &&
							!orderCityValidation.safeParse($cart.delivery.city).success}
					/>
				</div>
			</div>
			<div class="flex space-x-3">
				<div class="form-control w-full">
					<label class="label" for="first-name">
						<span class="label-text">Telefon*</span>
					</label>
					<input
						type="tel"
						placeholder="Wpisz tu numer telefonu do odbiorcy..."
						name="address-phone-number"
						class="input input-bordered w-full max-w-xs"
						class:input-success={$cart.delivery.phone.length > 0 &&
							orderPhoneValidation.safeParse($cart.delivery.phone).success}
						class:input-error={$cart.delivery.phone.length > 0 &&
							!orderPhoneValidation.safeParse($cart.delivery.phone).success}
						required
						bind:value={$cart.delivery.phone}
					/>
				</div>
				<div class="form-control w-full">
					<label class="label" for="first-name">
						<span class="label-text">Adres email*</span>
					</label>
					<input
						type="email"
						placeholder="Wpisz tu adres email odbiorcy..."
						name="address-email"
						class="input input-bordered w-full max-w-xs"
						class:input-success={$cart.delivery.email.length > 0 &&
							orderEmailValidation.safeParse($cart.delivery.email).success}
						class:input-error={$cart.delivery.email.length > 0 &&
							!orderEmailValidation.safeParse($cart.delivery.email).success}
						required
						bind:value={$cart.delivery.email}
					/>
				</div>
			</div>
		</div>
	{/if}
</div>
