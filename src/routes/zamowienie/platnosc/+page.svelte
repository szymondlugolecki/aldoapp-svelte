<script lang="ts">
	import { CreditCard, Landmark, Wallet } from 'lucide-svelte';
	import { cart } from '$lib/client/stores/cart';
	import PaymentMethod from '$components/PaymentMethod.svelte';
	import Alert from '$components/Alerts/Alert.svelte';
</script>

<svelte:head>
	<title>Koszyk {$cart.products ? `(${$cart.products.length}) ` : ''}• Twoje ALDO</title>
	<meta name="description" content="Wybierz metodę dostawy. Dokończ zamówienie." />
</svelte:head>

<div class="text-left h-full flex flex-col xs:p-2 space-y-4 flex-1">
	<h1 class="text-3xl font-bold">Płatność 💵</h1>

	<h2 class="mb-5 text-lg font-medium">Wybierz metodę płatności</h2>
	<Alert type="info" message="Możliwość płatności online pojawi się w przyszłości 💳" />
	<ul class="flex flex-col w-full xs:max-w-[500px] space-y-4">
		<li>
			<PaymentMethod name="Gotówka" description="Przy odbiorze" id="cash" checked={true}>
				<Wallet size={50} />
			</PaymentMethod>
		</li>
		<li>
			<PaymentMethod
				name="Przelew"
				description="Przelew bankowy online"
				id="bank-transfer"
				checked={false}
			>
				<Landmark size={50} />
			</PaymentMethod>
		</li>
		<li>
			<PaymentMethod
				name="Karta kredytowa"
				description="Płatność kartą online"
				id="credit-card"
				checked={false}
			>
				<CreditCard size={50} />
			</PaymentMethod>
		</li>
	</ul>
</div>
