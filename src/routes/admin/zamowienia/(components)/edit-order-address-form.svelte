<script lang="ts">
	import { Input } from '$shadcn/input';
	import { Label } from '$shadcn/label';
	import type { Order } from '$types';
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import type { Address } from '$lib/server/db/schemas/orders';
	import { cn, parseAddress } from '$lib/client/functions';
	import type { Product } from '$lib/server/db/schemas/products';
	import { orderStatusList } from '$lib/client/constants';
	import SelectStatus from '$meltui/Select/SelectStatus.svelte';
	import Paid from '$meltui/Switch/Paid.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import * as Dialog from '$shadcn/dialog';
	import { buttonVariants } from '$components/ui/button';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { OrderAddressForm } from '$lib/client/schemas/order';
	import OrderId from './order-id.svelte';

	import * as Form from '$shadcn/form';
	import { order$ } from '$lib/client/schemas';
	import Feedback from '$components/custom/Form/Feedback.svelte';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	type ExtendedOrder = import('../$types').PageServerData['orders'];

	export let order: ExtendedOrder[number];

	export let form: SuperValidated<OrderAddressForm>;
	export let open: boolean;
</script>

<Form.Root
	method="POST"
	action="?/changeOrderAddress"
	{form}
	let:message
	let:delayed
	let:timeout
	let:submitting
	schema={order$.orderAddressForm}
	let:config
	class="flex flex-col gap-y-2"
	options={{
		onResult: ({ result }) => {
			console.log('result', result);
			if (result.type === 'success') {
				open = false;
			}
		},
		id: order.id.toString(),
		delayMs: 1000,
		timeoutMs: 8000
	}}
>
	<Form.Field {config} name="city">
		<Form.Item>
			<Form.Label>Miasto</Form.Label>
			<Form.Input required value={order.address.city} spellcheck="false" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="zipCode">
		<Form.Item>
			<Form.Label>Kod pocztowy</Form.Label>
			<Form.Input required minlength={5} value={order.address.zipCode} spellcheck="false" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="street">
		<Form.Item>
			<Form.Label>Ulica i numer domu</Form.Label>
			<Form.Input required value={order.address.street} spellcheck="false" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="id">
		<OrderId orderId={order.id} />
	</Form.Field>

	<Feedback {message} {timeout} />

	<div class="flex justify-end">
		<Form.Button class="w-20" disabled={submitting}>
			{#if delayed}
				<Spinner />
			{:else}
				Zapisz
			{/if}
		</Form.Button>
	</div>
</Form.Root>
