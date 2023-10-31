<script lang="ts">
	import { Input } from '$shadcn/input';
	import { Label } from '$shadcn/label';
	import type { Order } from '$types';
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import type { Address } from '$lib/server/db/schemas/orders';
	import { parseAddress } from '$lib/client/functions';
	import type { Product } from '$lib/server/db/schemas/products';
	import DialogTitle from '$meltui/Dialog/DialogTitle.svelte';
	import DialogDescription from '$meltui/Dialog/DialogDescription.svelte';
	import Dialog from '$meltui/Dialog/Dialog.svelte';
	import DialogTrigger from '$meltui/Dialog/DialogTrigger.svelte';
	import { createDialog } from '@melt-ui/svelte';
	import DialogFooter from '$meltui/Dialog/DialogFooter.svelte';
	import { orderStatusList } from '$lib/client/constants';
	import SelectStatus from '$meltui/Select/SelectStatus.svelte';
	import Paid from '$meltui/Switch/Paid.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	type ExtendedOrder = import('../$types').PageServerData['orders'];

	export let key: keyof ExtendedOrder[number];
	export let value: ExtendedOrder[keyof ExtendedOrder];
	export let order: ExtendedOrder[number];

	let keyType: 'address' | 'status' | 'paid' | null = null;

	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
		states: { open }
	} = createDialog();

	switch (key) {
		case 'address':
			keyType = 'address';
			break;
		case 'status':
			keyType = 'status';
			break;
		case 'paid':
			keyType = 'paid';
			break;
	}

	let formAction: 'changeOrderStatus' | 'changePaidStatus' | 'changeOrderAddress' | null = null;
	let cellOverride = undefined as string | undefined | null;

	if (keyType === 'address') {
		cellOverride = parseAddress(order.address);
		formAction = 'changeOrderAddress';
	} else if (keyType === 'status') {
		cellOverride = orderStatusList[order.status];
		formAction = 'changeOrderStatus';
	} else if (keyType === 'paid') {
		cellOverride = order.paid ? 'Tak' : 'Nie';
		formAction = 'changePaidStatus';
	}

	let address: Address = {
		street: order.address.street || '',
		zipCode: order.address.zipCode || '',
		city: order.address.city || ''
	};

	let orderPaid = order.paid;

	let submitting = false;
</script>

<div>
	<DialogTrigger {trigger}>{cellOverride || value}</DialogTrigger>
	<Dialog {content} {overlay} {close} {portalled} {open}>
		<DialogTitle {title}>Edytuj zamówienie</DialogTitle>
		<DialogDescription {description}>Kliknij przycisk poniżej, aby zapisać zmiany</DialogDescription
		>
		<form
			id="editOrderForm"
			method="post"
			use:enhance={() => {
				const toastId = createLoadingToast('please-wait');
				submitting = true;
				return async ({ result, update }) => {
					submitting = false;
					$open = false;
					handleFormResponse(result, toastId);
					update();
				};
			}}
		>
			<div class="flex flex-col space-y-2">
				<!-- {#if keyType === 'hyperlink'}
					<a href="/zamowienia/{order.id}">Szczegóły</a> -->
				{#if keyType === 'status'}
					<fieldset>
						<SelectStatus defaultValue={order.status} />
					</fieldset>
				{:else if keyType === 'paid'}
					<fieldset class="flex items-center space-x-2">
						<Paid bind:hadPaid={orderPaid} />
						<Label for={key}>Opłacono zamówienie</Label>
					</fieldset>
				{:else if keyType === 'address'}
					<fieldset class="grid gap-4 py-4">
						<div class="grid items-center grid-cols-4 gap-4">
							<Label class="text-right">Miasto</Label>
							<Input
								id="city"
								name="city"
								bind:value={address.city}
								class="col-span-3"
								spellcheck="false"
							/>
						</div>
						<div class="grid items-center grid-cols-4 gap-4">
							<Label class="text-right">Kod pocztowy</Label>
							<Input
								id="zipCode"
								name="zipCode"
								bind:value={address.zipCode}
								class="col-span-3"
								spellcheck="false"
							/>
						</div>
						<div class="grid items-center grid-cols-4 gap-4">
							<Label class="text-right">Ulica i numer domu</Label>
							<Input
								id="street"
								name="street"
								bind:value={address.street}
								class="col-span-3"
								spellcheck="false"
							/>
						</div>
					</fieldset>
				{/if}

				{#if formAction}
					<DialogFooter>
						<button
							class="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/80"
							type="submit"
							form="editOrderForm"
							formaction="?/{formAction}"
							disabled={submitting}
						>
							Zapisz
						</button>
					</DialogFooter>
				{/if}
			</div>
			<input type="hidden" hidden value={order.id} name="id" />
		</form>
	</Dialog>
</div>
