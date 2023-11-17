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
	import type { EventForm } from '$lib/client/schemas/order';
	import OrderId from './order-id.svelte';

	import * as Form from '$shadcn/form';
	import { order$ } from '$lib/client/schemas';
	import Feedback from '$components/custom/Form/Feedback.svelte';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	type ExtendedOrder = import('../$types').PageServerData['orders'];

	export let order: ExtendedOrder[number];

	export let form: SuperValidated<EventForm>;
	export let open: boolean;

	const availableEvents = getNextEvents(order.status);

	console.log('availableEvents', availableEvents);
</script>

<Form.Root
	method="POST"
	action="?/changeOrderStatus"
	{form}
	let:message
	let:delayed
	let:timeout
	let:submitting
	schema={order$.eventForm}
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
	<Form.Field {config} name="event">
		<Form.Item>
			<Form.Label>Status</Form.Label>
			<Form.Select>
				<Form.SelectTrigger placeholder="Zmień status zamówienia" />
				<Form.SelectContent>
					{#each availableEvents as event}
						<Form.SelectItem value={event}>{orderEventsList[event]}</Form.SelectItem>
					{/each}
				</Form.SelectContent>
			</Form.Select>
			<Form.Description>
				Użytkownik automatycznie zostanie poinformowany o zmianie statusu.
			</Form.Description>
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
