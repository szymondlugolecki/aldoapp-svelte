<script lang="ts">
	import { Textarea } from '$shadcn/textarea';
	import { Input } from '$shadcn/input';

	import * as Select from '$components/ui/select';

	import * as Form from '$shadcn/form';

	import SuperDebug from 'sveltekit-superforms';
	import type { Role } from '$types';
	import { cn, parseAddress } from '$lib/client/functions';
	import { orderEventsList, orderStatusList } from '$lib/client/constants';
	import * as Dialog from '$shadcn/dialog';
	import { buttonVariants } from '$components/ui/button';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { EventForm, PaymentForm, OrderAddressForm } from '$lib/client/schemas/order';
	import EditLayout from '$routes/admin/(components)/edit-layout.svelte';
	import EditPageNavigationButtons from '$routes/admin/(components)/edit-page-navigation-buttons.svelte';
	import Separator from '$components/ui/separator/separator.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { order$ } from '$lib/client/schemas/index.js';
	import { getNextEvents } from '$lib/client/machines/orderStatus.js';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(order$.editForm),
		onUpdated: ({ form: f }) => {
			console.log(f, f.message, f.posted, f.errors);
			if (f.valid) {
				toast.success(`Sukces`);
			} else {
				toast.error('Błąd');
			}
		},
		invalidateAll: true
	});

	const { form: formData, enhance, delayed, submitting, reset } = form;

	const availableEvents = getNextEvents(data.order.status);

	$: console.log(data.order.status, $formData.event, availableEvents);

	// It should only show the event relevant to the delivery method
	if (
		availableEvents.includes('IS_AVAILABLE_FOR_PICKUP') &&
		availableEvents.includes('IS_AVAILABLE_FOR_SHIPMENT')
	) {
		// If it's personal delivery, remove the 'is available for shipment' option and vice versa
		if (data.order.deliveryMethod === 'personal-delivery') {
			availableEvents.splice(availableEvents.indexOf('IS_AVAILABLE_FOR_PICKUP'), 1);
		} else if (data.order.deliveryMethod === 'personal-pickup') {
			availableEvents.splice(availableEvents.indexOf('IS_AVAILABLE_FOR_SHIPMENT'), 1);
		}
	}

	$: selectedStatus = $formData.event
		? {
				label: orderEventsList[$formData.event],
				value: $formData.event
		  }
		: undefined;
</script>

<EditLayout>
	<h1 class="text-3xl font-extrabold tracking-tight scroll-m-20 lg:text-4xl">Edycja zamówienia</h1>
	<form method="POST" action="?/edit" use:enhance class="flex flex-col gap-y-2">
		<Form.Field {form} name="id">
			<Form.Control let:attrs>
				<input hidden bind:value={$formData.id} name={attrs.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="event">
			<Form.Control let:attrs>
				<Form.Label>Nowy status<RequiredAsterisk /></Form.Label>
				<Select.Root
					selected={selectedStatus}
					onSelectedChange={(v) => {
						v && ($formData.event = v.value);
					}}
					disabled={availableEvents.length === 0}
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
				Obecny status: {orderStatusList[data.order.status]}<br />
				Użytkownik automatycznie zostanie poinformowany o zmianie statusu.
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Separator />

		<Form.Field {form} name="city">
			<Form.Control let:attrs>
				<Form.Label>Miasto</Form.Label>
				<Input {...attrs} spellcheck={false} bind:value={$formData.city} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="zipCode">
			<Form.Control let:attrs>
				<Form.Label>Kod pocztowy</Form.Label>
				<Input {...attrs} minlength={5} bind:value={$formData.zipCode} spellcheck="false" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="street">
			<Form.Control let:attrs>
				<Form.Label>Ulica i numer domu</Form.Label>
				<Input {...attrs} bind:value={$formData.street} spellcheck="false" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<EditPageNavigationButtons delayed={$delayed} submitting={$submitting} {reset} />
		<SuperDebug data={$formData} />
	</form>
</EditLayout>

<!-- {#if key === 'address'}
			<EditOrderAddressForm bind:open {order} superform={addressForm} />
		{:else if key === 'status' && userRole}
			{#if order.status === 'delivered'}
				<p class="text-center">Zamówienie zostało dostarczone</p>
			{:else if order.status === 'pickedUp'}
				<p class="text-center">Zamówienie zostało odebrane</p>
			{:else if order.status === 'cancelled'}
				<p class="text-center">Zamówienie zostało anulowane</p>
			{:else if userRole !== 'driver' || (userRole === 'driver' && order.status === 'awaitingDelivery')}
				<EditOrderStatusForm bind:open {order} superform={statusForm} />
			{:else}
				<p class="text-center">Nie możesz zmienić statusu tego zamówienia</p>
			{/if}
		{:else if key === 'paid'}
			<EditOrderPaymentForm bind:open {order} superform={paymentForm} />
		{/if} -->
