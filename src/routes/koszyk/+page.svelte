<script lang="ts">
	import type { Cart } from '$types';
	import Summary from './(components)/summary.svelte';
	import ProductsTable from './(components)/products-table.svelte';
	import { Input } from '$shadcn/input/index.js';
	import { Label } from '$shadcn/label/index.js';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';
	import * as RadioGroup from '$shadcn/radio-group';

	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { Button } from '$shadcn/button';
	import { order$, user$ } from '$lib/client/schemas/index.js';
	import { validUntil } from '$lib/client/schemas/promoCode.js';
	// import OrderForm from '$components/custom/Order/OrderForm.svelte';

	import * as Form from '$shadcn/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	// import type { OrderForm } from '$lib/client/schemas/order.js';
	import { page } from '$app/stores';
	import type { OrderForm } from '$lib/client/schemas/order.js';

	export let data;
	let form: SuperValidated<OrderForm> = data.orderForm;

	$: subtotal = data.cart
		? data.cart.products
				.map(({ quantity, price }) => [price, quantity])
				.reduce((prev, [price, quantity]) => prev + Number(price) * Number(quantity), 0)
				.toFixed(2)
		: '0.00';

	const defaultValues = {
		personalInfo: {
			fullName: data.cart?.customer.fullName || '',
			email: data.cart?.customer.email || '',
			phone: data.cart?.customer.phone || ''
		}
	};

	const {
		formId,
		submitting: productQuantitySubmitting,
		...rest
	} = superForm(data.productQuantityForm, {
		delayMs: 1000,
		onSubmit: ({ formData }) => {
			const id = formData.get('productId');
			$formId = id?.toString();
		}
	});
</script>

<svelte:head>
	<title>Koszyk • Twoje ALDO</title>
	<meta name="description" content="Dokończ składanie zamówienia." />
</svelte:head>

<!-- <SuperDebug data={form} /> -->

<section class="flex justify-center w-full pt-3 pb-3 sm:pt-6 sm:pb-40">
	{#if data.user && data.cart && data.cart.products.length}
		<Form.Root
			method="POST"
			{form}
			schema={order$.create}
			let:config
			let:formValues
			let:message
			let:delayed
			let:timeout
			let:submitting
			action="?/createOrder"
			class="flex flex-col items-start w-full max-w-6xl gap-8 px-4 pb-8 lg:flex-row sm:px-10"
		>
			{@const customerAddress = data.cart.customer.address}
			<!-- class="grid grid-cols-4 gap-x-4 gap-y-2" -->
			<!-- Form -->
			<div class="flex flex-col w-full gap-y-4">
				<h1 class="text-lg font-medium">Dane zamówienia</h1>

				<!-- Select customer -->
				{#if data.customers}
					<Form.Field {config} name="customerId">
						<Form.Item>
							<Form.Label>Klient</Form.Label>
							{#if data.customers.length}
								<Form.Select>
									<Form.SelectTrigger placeholder="Email klienta" />
									<Form.SelectContent>
										{#each data.customers as customer}
											<Form.SelectItem value={customer.id}>{customer.fullName}</Form.SelectItem>
										{/each}
									</Form.SelectContent>
								</Form.Select>
							{:else}
								<p class="text-sm">Nie masz przypisanych żadnych klientów!</p>
							{/if}
							<Form.Description
								>Jako moderator możesz złożyć zamówienie w imieniu klienta</Form.Description
							>
							<Form.Validation />
						</Form.Item>
					</Form.Field>
				{/if}

				<div class="grid grid-cols-4 gap-y-2 gap-x-4">
					<div class="flex flex-col col-span-4 sm:col-span-2 gap-y-2">
						<Label for="fullName" class="font-medium">Imię i nazwisko</Label>
						<Input name="fullName" value={defaultValues.personalInfo.fullName} disabled />
					</div>

					<div class="flex flex-col col-span-4 sm:col-span-2 gap-y-2">
						<Label for="phone" class="font-medium">Numer telefonu</Label>
						<Input
							name="phone"
							type="tel"
							placeholder="np. 123456789"
							disabled
							value={defaultValues.personalInfo.phone}
						/>
					</div>

					<div class="flex flex-col col-span-4 gap-y-2">
						<Label for="email" class="font-medium">Email</Label>
						<Input name="email" type="email" value={defaultValues.personalInfo.email} disabled />
					</div>
				</div>

				<div class="grid grid-cols-4 gap-x-4 gap-y-2">
					<Form.Field {config} name="city">
						<Form.Item class="col-span-4 sm:col-span-2">
							<Form.Label>Miasto<RequiredAsterisk /></Form.Label>
							<Form.Input spellcheck="false" required minlength={3} />
							<Form.Validation />
						</Form.Item>
					</Form.Field>

					<Form.Field {config} name="zipCode">
						<Form.Item class="col-span-4 sm:col-span-2">
							<Form.Label>Kod pocztowy<RequiredAsterisk /></Form.Label>
							<Form.Input spellcheck="false" required minlength={5} />
							<Form.Validation />
						</Form.Item>
					</Form.Field>

					<Form.Field {config} name="street">
						<Form.Item class="col-span-4">
							<Form.Label>Ulica i numer<RequiredAsterisk /></Form.Label>
							<Form.Input spellcheck="false" required minlength={3} />
							<Form.Validation />
						</Form.Item>
					</Form.Field>
				</div>

				<!-- If address changed -->
				{#if customerAddress.street !== formValues.street || customerAddress.city !== formValues.city || customerAddress.zipCode !== formValues.zipCode}
					<div class="grid">
						<Form.Field {config} name="saveAddress">
							<Form.Item
								class="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md"
							>
								<Form.Checkbox />
								<div class="space-y-1 leading-none">
									<Form.Label>Zapamiętaj adres</Form.Label>
									<Form.Description>
										Zostanie uzupełniony automatycznie przy następnych zamówieniach
									</Form.Description>
								</div>
							</Form.Item>
						</Form.Field>
					</div>
				{/if}

				<div class="grid grid-cols-4 gap-x-4 gap-y-2">
					<Form.Field {config} name="paymentMethod">
						<Form.Item class="flex flex-col col-span-2 gap-y-3">
							<Form.Label>Metoda płatności<RequiredAsterisk /></Form.Label>
							<Form.RadioGroup class="flex flex-col space-y-1" required>
								<Form.Item class="flex items-center space-x-3 space-y-0">
									<Form.RadioItem value="cash" id="cash" aria-required />
									<Label for="cash" class="font-normal">Gotówka lub przedpłata</Label>
								</Form.Item>
								<Form.Item class="flex items-center space-x-3 space-y-0">
									<Form.RadioItem value="transfer" id="transfer" aria-required />
									<Label for="transfer" class="font-normal">Przelew bankowy</Label>
								</Form.Item>
							</Form.RadioGroup>
							<Form.Validation />
						</Form.Item>
					</Form.Field>

					<Form.Field {config} name="deliveryMethod">
						<Form.Item class="flex flex-col col-span-2 gap-y-3">
							<Form.Label>Metoda dostawy<RequiredAsterisk /></Form.Label>
							<Form.RadioGroup class="flex flex-col space-y-1" required>
								<Form.Item class="flex items-center space-x-3 space-y-0">
									<Form.RadioItem value="personal-delivery" id="personal-delivery" aria-required />
									<Label for="personal-delivery" class="font-normal">Kierowca ALDO</Label>
								</Form.Item>
							</Form.RadioGroup>
							<Form.Validation />
						</Form.Item>
					</Form.Field>
				</div>
			</div>
			<!-- Cart Products & Summary -->
			<div class="w-full py-2 lg:max-w-lg">
				<div class="border rounded-sm shadow-sm border-border">
					<ProductsTable
						productQuantityForm={{
							...rest,
							submitting: productQuantitySubmitting,
							formId
						}}
						products={data.cart.products}
					/>
					<Summary
						{subtotal}
						processing={$productQuantitySubmitting}
						submittingOrder={submitting}
					/>
				</div>
			</div>
		</Form.Root>
	{:else}
		<div class="flex flex-col w-full px-5 pt-48 text-center sm:pt-64 mt-7 gap-y-2 pb-96 sm:px-8">
			<h1 class="text-4xl font-semibold">Twój koszyk jest pusty</h1>
			<a class="text-lg font-medium underline" href="/sklep">Kliknij tutaj, aby przejść do sklepu</a
			>
		</div>
	{/if}
</section>

<!-- <style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 text-accent;
		translate: 0 calc(-50% + 1px);
	}
</style> -->
