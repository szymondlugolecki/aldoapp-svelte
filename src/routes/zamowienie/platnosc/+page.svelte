<script lang="ts">
	import { CreditCard, Landmark, Wallet } from 'lucide-svelte';
	import Alert from '$components/Alerts/Alert.svelte';
	import PaymentMethodMethodToggle from '$meltui/Toggle/PaymentMethod.svelte';
	import type { CartLayoutData } from '$types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let data;
	const cartData = getContext<Writable<CartLayoutData>>('cartData');

	$: console.log('cartData - platnosc', $cartData);
</script>

<svelte:head>
	<title>Koszyk ({data.cart?.products.length || 0}) • Twoje ALDO</title>
	<meta name="description" content="Wybierz metodę płatności. Dokończ zamówienie." />
</svelte:head>

<div class="text-left h-full flex flex-col flex-1">
	<h1 class="text-3xl font-bold">Płatność</h1>
	<h2 class="mb-5 text-lg font-medium">Wybierz metodę płatności</h2>
	{#if data.cart}
		<ul class="flex flex-col w-full xs:max-w-[360px] space-y-4">
			<li>
				<PaymentMethodMethodToggle
					{cartData}
					ariaLabel="Gotówka/Przedpłata"
					method="cash"
					savedPaymentMethod={data.cart.paymentMethod}
				>
					<div class="flex text-left space-x-4 h-full">
						<Wallet size={50} class="-scale-x-100 self-center" />
						<div class="self-start py-2">
							<bold class="font-semibold text-lg">Gotówka/Przedpłata</bold>
							<p class="text-sm">Przy odbiorze</p>
						</div>
					</div>
				</PaymentMethodMethodToggle>
			</li>
			<li>
				<PaymentMethodMethodToggle
					{cartData}
					ariaLabel="Gotówka/Przedpłata"
					method="transfer"
					savedPaymentMethod={data.cart.paymentMethod}
				>
					<div class="flex text-left space-x-4 h-full">
						<Landmark size={50} class="-scale-x-100 self-center" />
						<div class="self-start py-2">
							<bold class="font-semibold text-lg">Przelew</bold>
							<p class="text-sm">Na podany rachunek bankowy</p>
						</div>
					</div>
				</PaymentMethodMethodToggle>
			</li>
		</ul>
	{/if}
</div>
