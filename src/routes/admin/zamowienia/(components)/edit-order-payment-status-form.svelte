<script lang="ts">
	import { orderEventsList, orderStatusList } from '$lib/client/constants';
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { cn } from '$lib/client/functions';
	import { getNextEvents } from '$lib/client/machines/orderStatus';
	import type { OrderEvent } from '$types';
	import type { OrderStatus } from '$lib/client/constants/dbTypes';

	import type { SuperValidated } from 'sveltekit-superforms';
	import type { EventForm, PaymentForm } from '$lib/client/schemas/order';
	import OrderId from './order-id.svelte';

	import * as Form from '$shadcn/form';
	import { order$ } from '$lib/client/schemas';
	import Feedback from '$components/custom/Form/Feedback.svelte';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	type ExtendedOrder = import('../$types').PageServerData['orders'];

	export let order: ExtendedOrder[number];

	export let form: SuperValidated<PaymentForm>;
	export let open: boolean;

	const availableEvents = getNextEvents(order.status);
</script>

<Form.Root
	method="POST"
	action="?/changePaymentStatus"
	{form}
	let:message
	let:delayed
	let:timeout
	let:submitting
	schema={order$.paymentForm}
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
	<Form.Field {config} name="paid">
		<Form.Item class="flex flex-row items-center justify-between p-4 border rounded-lg">
			<div class="space-y-0.5">
				<Form.Label>Opłacono</Form.Label>
				<Form.Description />
			</div>
			<Form.Switch />
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
