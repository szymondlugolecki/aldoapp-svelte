<script lang="ts">
	import type { Role } from '$types';
	import { cn, parseAddress } from '$lib/client/functions';
	import { orderStatusList } from '$lib/client/constants';
	import * as Dialog from '$shadcn/dialog';
	import { buttonVariants } from '$components/ui/button';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { EventForm, PaymentForm, OrderAddressForm } from '$lib/client/schemas/order';
	import EditOrderAddressForm from './edit-order-address-form.svelte';
	import EditOrderStatusForm from './edit-order-status-form.svelte';
	import EditOrderPaymentForm from './edit-order-payment-status-form.svelte';

	type ExtendedOrder = import('../$types').PageServerData['orders'];

	export let key: keyof ExtendedOrder[number];
	export let value: ExtendedOrder[keyof ExtendedOrder];
	export let order: ExtendedOrder[number];
	export let addressForm: SuperValidated<OrderAddressForm>;
	export let statusForm: SuperValidated<EventForm>;
	export let paymentForm: SuperValidated<PaymentForm>;
	export let userRole: Role | undefined;

	let cellOverride = undefined as string | undefined | null;

	if (key === 'address') {
		cellOverride = parseAddress(order.address) || 'Brak';
	} else if (key === 'status') {
		cellOverride = orderStatusList[order.status];
	} else if (key === 'paid') {
		cellOverride = order.paid ? 'Tak' : 'Nie';
	}

	let open = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'link' }), 'whitespace-pre')}
		>{cellOverride || value}</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edytuj zamówienie</Dialog.Title>
			<Dialog.Description>Po dokonaniu zmian wciśnij przycisk Zapisz</Dialog.Description>
		</Dialog.Header>

		{#if key === 'address'}
			<EditOrderAddressForm bind:open {order} form={addressForm} />
		{:else if key === 'status' && userRole}
			{#if order.status === 'delivered'}
				<p class="text-center">Zamówienie zostało dostarczone</p>
			{:else if order.status === 'pickedUp'}
				<p class="text-center">Zamówienie zostało odebrane</p>
			{:else if order.status === 'cancelled'}
				<p class="text-center">Zamówienie zostało anulowane</p>
			{:else if userRole !== 'driver' || (userRole === 'driver' && order.status === 'awaitingDelivery')}
				<EditOrderStatusForm bind:open {order} form={statusForm} />
			{:else}
				<p class="text-center">Nie możesz zmienić statusu tego zamówienia</p>
			{/if}
		{:else if key === 'paid'}
			<EditOrderPaymentForm bind:open {order} form={paymentForm} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
