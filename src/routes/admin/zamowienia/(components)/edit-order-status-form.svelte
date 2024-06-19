<script lang="ts">
	import { orderEventsList } from '$lib/client/constants';
	import { getNextEvents } from '$lib/client/machines/orderStatus';

	import * as Form from '$shadcn/form';

	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { EventForm } from '$lib/client/schemas/order';

	import { order$ } from '$lib/client/schemas';
	import Spinner from '$components/custom/spinner.svelte';
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
