<script lang="ts">
	// import {
	// 	Dialog,
	// 	DialogContent,
	// 	DialogDescription,
	// 	DialogHeader,
	// 	DialogTitle,
	// 	DialogTrigger,
	// 	DialogFooter
	// } from '$shadcn/dialog';
	import { Textarea } from '$shadcn/textarea';

	import { Input } from '$shadcn/input';
	import { Label } from '$shadcn/label';
	import { Button } from '$shadcn/button';
	import Select from '$meltui/Select.svelte';

	import { page } from '$app/stores';
	import type { Order, Role } from '$types';
	import { userRoles } from '$lib/client/constants/dbTypes';
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { Switch } from '$shadcn/switch';
	import type { Address } from '$lib/server/db/schemas/orders';
	import { addressParser, isCorrectAddress, isCorrectRole } from '$lib/client/functions';
	import type { Product } from '$lib/server/db/schemas/products';
	import SelectCategory from '../SelectCategory.svelte';
	import DialogButton from '$meltui/Dialog/DialogButton.svelte';
	import DialogTitle from '$meltui/Dialog/DialogTitle.svelte';
	import DialogDescription from '$meltui/Dialog/DialogDescription.svelte';
	import Dialog from '$meltui/Dialog/Dialog.svelte';
	import DialogTrigger from '$meltui/Dialog/DialogTrigger.svelte';
	import { createDialog } from '@melt-ui/svelte';
	import DialogFooter from '$meltui/Dialog/DialogFooter.svelte';
	import { orderStatusList, paymentMethodsList, statusIcon } from '$lib/client/constants';

	type ExtendedOrder = Pick<
		Order,
		| 'id'
		| 'status'
		| 'deliveryStatus'
		| 'deliveryMethod'
		| 'paymentStatus'
		| 'paymentMethod'
		| 'address'
		| 'price'
		| 'discount'
		| 'createdAt'
	> & {
		orderProducts: {
			quantity: number;
			productId: number;
			product: Pick<Product, 'id' | 'name' | 'symbol' | 'price' | 'encodedURL'>;
		};
	};

	export let key: keyof ExtendedOrder;
	export let value: ExtendedOrder[keyof ExtendedOrder];
	// export let cellTextOverride: string | undefined = undefined;
	export let order: ExtendedOrder;

	let keyType: 'address' | 'status' | 'delivery' | 'payment' | null = null;

	const { trigger, portal, overlay, content, close, open, title, description } = createDialog();

	console.log('key', key);

	switch (key) {
		case 'address':
			keyType = 'address';
			break;
		case 'status':
			keyType = 'status';
			break;
		case 'deliveryStatus':
			keyType = 'delivery';
			break;
		case 'paymentStatus':
			keyType = 'payment';
			break;
	}

	let cellValueOverride = undefined as string | undefined;
	if (keyType === 'address') {
		cellValueOverride = addressParser(order.address);
	} else if (keyType === 'status') {
		cellValueOverride = `${statusIcon[order.paymentStatus]} ${orderStatusList[order.status]}`;
	} else if (keyType === 'delivery') {
		cellValueOverride = `${
			order.deliveryMethod === 'personal-delivery' ? 'Kierowca ALDO' : '?'
		}\n\n${statusIcon[order.deliveryStatus]} ${orderStatusList[order.deliveryStatus]}`;
	} else if (keyType === 'payment') {
		cellValueOverride = `${paymentMethodsList[order.paymentMethod]}\n\n${
			statusIcon[order.paymentStatus]
		} ${orderStatusList[order.paymentStatus]}`;
	}
	let address: Address = {
		street: order.address.street || '',
		zipCode: order.address.zipCode || '',
		city: order.address.city || ''
	};
</script>

<div>
	<DialogTrigger {trigger}>{cellValueOverride || value}</DialogTrigger>
	<Dialog {content} {overlay} {close} {portal} {open}>
		<DialogTitle {title}>Edytuj zamówienie</DialogTitle>
		<DialogDescription {description}>Kliknij przycisk poniżej, aby zapisać zmiany</DialogDescription
		>
		<form
			method="post"
			action="?/edit"
			use:enhance={({ formData }) => {
				const toastId = createLoadingToast('please-wait');
				// data.append('address', JSON.stringify(address));

				return async ({ result, update }) => {
					$open = false;

					handleFormResponse(result, toastId);
					update();
				};
			}}
		>
			<div class="flex flex-col space-y-2">
				<!-- {#if keyType === 'hyperlink'}
					<a href="/zamowienia/{order.id}">Szczegóły</a> -->
				{#if keyType === 'address'}
					<fieldset class="grid gap-4 py-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="text-right">Miasto</Label>
							<Input id="city" name="city" bind:value={address.city} class="col-span-3" />
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="text-right">Kod pocztowy</Label>
							<Input id="zipCode" name="zipCode" bind:value={address.zipCode} class="col-span-3" />
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="text-right">Ulica i numer domu</Label>
							<Input id="street" name="street" bind:value={address.street} class="col-span-3" />
						</div>
					</fieldset>
				{/if}

				<DialogFooter>
					<DialogButton>Zapisz</DialogButton>
				</DialogFooter>
			</div>
			<input type="hidden" hidden value={order.id} name="id" />
		</form>
	</Dialog>
</div>
