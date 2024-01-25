<script lang="ts">
	import Summary from './(components)/summary.svelte';
	import ProductsTable from './(components)/products-table.svelte';
	import { Input } from '$shadcn/input/index.js';
	import { Label } from '$shadcn/label/index.js';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';
	import * as RadioGroup from '$shadcn/radio-group';

	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { Button } from '$shadcn/button';
	import { cart$, order$, user$ } from '$lib/client/schemas/index.js';
	import { validUntil } from '$lib/client/schemas/promoCode.js';
	// import OrderForm from '$components/custom/Order/OrderForm.svelte';

	import * as Form from '$shadcn/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	// import type { OrderForm } from '$lib/client/schemas/order.js';
	import { page } from '$app/stores';
	import type { OrderForm } from '$lib/client/schemas/order.js';
	import { changeCartCustomer } from '$lib/client/schemas/cart';
	import CustomerForm from './(components)/customer-form.svelte';
	import OrderInfoForm from './(components)/order-info-form.svelte';

	export let data;

	$: subtotal = data.cart
		? data.cart.products
				.map(({ quantity, price }) => [price, quantity])
				.reduce((prev, [price, quantity]) => prev + Number(price) * Number(quantity), 0)
				.toFixed(2)
		: '0.00';

	const {
		formId: pQFormId,
		submitting: productQuantitySubmitting,
		...pQFormRest
	} = superForm(data.productQuantityForm, {
		delayMs: 1000,
		onSubmit: ({ formData }) => {
			const id = formData.get('productId');
			$pQFormId = id?.toString();
		},
		resetForm: true
	});

	const {
		formId: orderFormId,
		submitting: orderSubmitting,
		...orderFormRest
	} = superForm(data.orderForm, {
		resetForm: true
	});

	$: defaultValues = {
		fullName: data.cart?.customer.fullName || '',
		email: data.cart?.customer.email || '',
		phone: data.cart?.customer.phone || '',
		address: data.cart?.customer.address || {
			city: '',
			street: '',
			zipCode: ''
		}
	};

	$: console.log('orderFormId', orderFormId);
</script>

<svelte:head>
	<title>Koszyk • Twoje ALDO</title>
	<meta name="description" content="Dokończ składanie zamówienia." />
</svelte:head>

<!-- <SuperDebug data={form} /> -->

<section class="flex justify-center w-full pt-3 pb-3 sm:pt-6 sm:pb-40">
	{#if data.user && data.cart && data.cart.products.length}
		<div class="flex flex-col items-start w-full max-w-6xl gap-8 px-4 pb-8 lg:flex-row sm:px-10">
			<!-- Form -->
			<div class="flex flex-col w-full gap-y-4">
				<h1 class="text-lg font-medium">Dane zamówienia</h1>

				{#if data.customers}
					<CustomerForm
						customers={data.customers}
						user={{
							id: data.user.id,
							fullName: data.user.fullName
						}}
						setCustomerForm={data.setCustomerForm}
					/>
				{/if}

				<OrderInfoForm
					orderForm={{
						...orderFormRest,
						submitting: orderSubmitting,
						formId: orderFormId
					}}
					{defaultValues}
				/>
			</div>
			<!-- Cart Products & Summary -->
			<div class="w-full py-2 lg:max-w-lg">
				<div class="border rounded-sm shadow-sm border-border">
					<ProductsTable
						productQuantityForm={{
							...pQFormRest,
							submitting: productQuantitySubmitting,
							formId: pQFormId
						}}
						products={data.cart.products}
					/>
					{#if $orderFormId}
						<Summary
							{subtotal}
							orderFormId={$orderFormId}
							isRecalculating={$productQuantitySubmitting}
							disableOrderButton={$orderSubmitting}
						/>
					{/if}
				</div>
			</div>
		</div>
	{:else}
		<div class="flex flex-col w-full px-5 pt-48 text-center sm:pt-64 mt-7 gap-y-2 pb-96 sm:px-8">
			<h1 class="text-4xl font-semibold">Twój koszyk jest pusty</h1>
			<a class="text-lg font-medium underline" href="/sklep">Kliknij tutaj, aby przejść do sklepu</a
			>
		</div>
	{/if}
</section>
