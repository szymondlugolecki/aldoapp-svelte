<script lang="ts">
	import { Input } from '$shadcn/input/index.js';
	import { Label } from '$shadcn/label/index.js';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';
	import * as Select from '$shadcn/select';

	import type { OrderForm } from '$lib/client/schemas/order.js';
	import type { Infer, SuperForm } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';

	export let orderForm: SuperForm<Infer<OrderForm>>;
	export let defaultValues: {
		fullName: string;
		email: string;
		phone: string;
		address: {
			zipCode: string;
			street: string;
			city: string;
		};
	};

	// export let formId: string;

	const { form, message, errors, enhance, formId } = orderForm;

	$: console.log('formId X', $formId);
</script>

<form method="POST" action="?/createOrder" id={$formId} class="flex flex-col gap-y-4" use:enhance>
	<div class="grid grid-cols-4 gap-y-3 gap-x-4">
		<div class="flex flex-col col-span-4 sm:col-span-2 gap-y-2">
			<Label for="fullName" class="font-medium">Imię i nazwisko</Label>
			<Input name="fullName" value={defaultValues.fullName} disabled />
		</div>

		<div class="flex flex-col col-span-4 sm:col-span-2 gap-y-2">
			<Label for="phone" class="font-medium">Numer telefonu</Label>
			<Input
				name="phone"
				type="tel"
				placeholder="np. 123456789"
				disabled
				value={defaultValues.phone}
			/>
		</div>

		<div class="flex flex-col col-span-4 gap-y-2">
			<Label for="email" class="font-medium">Email</Label>
			<Input name="email" type="email" value={defaultValues.email} disabled />
		</div>
	</div>

	<div class="grid grid-cols-4 gap-x-4 gap-y-2">
		<div class="col-span-4 sm:col-span-2">
			<Label for="city" class="font-medium">Miasto</Label>
			<Input name="city" type="text" disabled value={defaultValues.address.city} />
		</div>

		<div class="col-span-4 sm:col-span-2">
			<Label for="zipCode" class="font-medium">Kod pocztowy</Label>
			<Input name="zipCode" type="text" disabled value={defaultValues.address.zipCode} />
		</div>

		<div class="col-span-4">
			<Label for="street" class="font-medium">Ulica i numer</Label>
			<Input name="street" type="text" disabled value={defaultValues.address.street} />
		</div>
	</div>

	<div class="grid grid-cols-4 grid-rows-2 gap-x-4 gap-y-5">
		<div class="flex flex-col col-span-2 row-start-1 sm:row-start-auto gap-y-3">
			<Label>Metoda płatności<RequiredAsterisk /></Label>
			<Select.Root
				name="paymentMethod"
				required
				selected={{
					value: 'cash',
					label: 'Gotówka'
				}}
			>
				<Select.Trigger class="w-[220px]">
					<Select.Value placeholder="Wybierz metodę płatności" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="cash">Gotówka</Select.Item>
					<Select.Item value="transfer">Przelew bankowy</Select.Item>
				</Select.Content>
				<Select.Input />
			</Select.Root>
			{#if $errors.paymentMethod}
				<span class="invalid">{$errors.paymentMethod}</span>
			{/if}
		</div>

		<div class="flex flex-col col-span-2 row-start-2 sm:row-start-auto gap-y-3">
			<Label>Metoda dostawy<RequiredAsterisk /></Label>
			<Select.Root
				name="deliveryMethod"
				required
				selected={{
					value: 'personal-delivery',
					label: 'Kierowca ALDO'
				}}
			>
				<Select.Trigger class="w-[220px]">
					<Select.Value placeholder="Wybierz metodę dostawy" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="personal-delivery">Kierowca ALDO</Select.Item>
					<Select.Item value="personal-pickup">Odbiór osobisty</Select.Item>
				</Select.Content>
				<Select.Input />
			</Select.Root>
			{#if $errors.deliveryMethod}
				<span class="invalid">{$errors.deliveryMethod}</span>
			{/if}
		</div>
	</div>
	<div>
		{#if $message}
			<span class:invalid={$page.status >= 400}>{$message}</span>
		{/if}
	</div>

	<!-- <SuperDebug data={$form} /> -->
</form>

<style lang="postcss">
	.invalid {
		@apply text-red-400 text-sm;
	}
</style>
