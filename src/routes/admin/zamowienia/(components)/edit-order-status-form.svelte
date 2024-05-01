<script lang="ts">
	import { orderEventsList, orderStatusList } from '$lib/client/constants';
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { cn } from '$lib/client/functions';
	import { getNextEvents } from '$lib/client/machines/orderStatus';
	import type { OrderEvent } from '$types';
	import type { OrderStatus } from '$lib/client/constants/dbTypes';

	import * as Select from '$components/ui/select';
	import * as Form from '$shadcn/form';

	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { EventForm } from '$lib/client/schemas/order';

	import { order$ } from '$lib/client/schemas';
	import Feedback from '$components/custom/Form/Feedback.svelte';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	type ExtendedOrder = import('../$types').PageServerData['orders'];

	export let order: ExtendedOrder[number];

	export let superform: SuperValidated<Infer<EventForm>>;
	export let open: boolean;

	const availableEvents = getNextEvents(order.status);

	// It should only show the event relevant to the delivery method
	if (
		availableEvents.includes('IS_AVAILABLE_FOR_PICKUP') &&
		availableEvents.includes('IS_AVAILABLE_FOR_SHIPMENT')
	) {
		// If it's personal delivery, remove the 'is available for shipment' option and vice versa
		if (order.deliveryMethod === 'personal-delivery') {
			availableEvents.splice(availableEvents.indexOf('IS_AVAILABLE_FOR_PICKUP'), 1);
		} else if (order.deliveryMethod === 'personal-pickup') {
			availableEvents.splice(availableEvents.indexOf('IS_AVAILABLE_FOR_SHIPMENT'), 1);
		}
	}

	const form = superForm(superform, {
		validators: zodClient(order$.eventForm),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				open = false;
				console.log(f, f.message, f.posted, f.errors);
				// toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
				toast.success(`Sukces`);
			} else {
				toast.error('Błąd');
			}
		}
	});
	const { form: formData, enhance, delayed, submitting } = form;

	$: selectedStatus = $formData.event
		? {
				label: orderEventsList[$formData.event],
				value: $formData.event
		  }
		: undefined;
</script>

<form method="POST" action="?/changeOrderStatus" use:enhance class="flex flex-col gap-y-2">
	<Form.Field {form} name="event">
		<Form.Control let:attrs>
			<Form.Label>Status</Form.Label>
			<Select.Root
				selected={selectedStatus}
				onSelectedChange={(v) => {
					v && ($formData.event = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Zmień status zamówienia" />
				</Select.Trigger>
				<Select.Content>
					{#each availableEvents as event}
						<Select.Item value={event} label={orderEventsList[event]} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.event} name={attrs.name} />
		</Form.Control>
		<Form.Description>
			Użytkownik automatycznie zostanie poinformowany o zmianie statusu.
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="id" hidden={true}>
		<Form.Control let:attrs>
			<input {...attrs} type="hidden" bind:value={order.id} />
		</Form.Control>
	</Form.Field>

	<div class="flex justify-end">
		<Form.Button class="w-20" disabled={$submitting}>
			{#if $delayed}
				<Spinner />
			{:else}
				Zapisz
			{/if}
		</Form.Button>
	</div>
</form>
<!-- </Form.Root> -->
