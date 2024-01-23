<script lang="ts">
	import { Input } from '$shadcn/input/index.js';
	import { Label } from '$shadcn/label/index.js';
	import * as RadioGroup from '$shadcn/radio-group';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';
	import type { order$ } from '$lib/client/schemas/index.js';
	import * as Select from '$shadcn/select';

	import * as Form from '$shadcn/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { OrderForm } from '$lib/client/schemas/order.js';
	import type { SuperForm } from 'sveltekit-superforms/client';

	type PageServerData = import('../$types').PageServerData;
	type PageLayoutData = import('../$types').PageServerParentData;

	export let orderForm: SuperForm<order$.OrderForm>;

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

	const { form, errors, enhance } = orderForm;
</script>

<!-- <Form.Root form={form} schema={someSchema} let:config let:enhance asChild>
	<form method="POST" use:enhance>
		<Form.Field {config} let:actions name="email">
			svelte-ignore a11y-label-has-associated-control / applied by action
			<label use:actions.label> Email </label>
			<input use:actions.input />
			<span use:actions.description> Please use your company email. </span>
			<span use:actions.validation>
				{#if $errors}
					{#each $errors.email as error}
						{error}
					{/each}
				{/if}
			</span>
		</Form.Field>
	</form>
</Form.Root> -->

<form method="POST" action="?/createOrder" class="flex flex-col gap-y-4" use:enhance>
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

	<div class="grid grid-cols-4 gap-x-4 gap-y-2">
		<!-- <div class="flex flex-col gap-y-3">
			<Label>Metoda płatności</Label>
			<RadioGroup.Root value="cash">
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value="cash" id="cash" />
					<Label for="cash">Gotówka/Przedpłata</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value="transfer" id="transfer" />
					<Label for="transfer">Przelew bankowy</Label>
				</div>
				<RadioGroup.Input name="paymentMethod" />
			</RadioGroup.Root>
		</div> -->

		<div class="flex flex-col col-span-2 gap-y-3">
			<Label>Metoda płatności</Label>
			<Select.Root
				selected={{
					value: 'cash',
					label: 'Gotówka/Przedpłata'
				}}
			>
				<Select.Trigger class="w-[200px]">
					<Select.Value placeholder="Wybierz metodę płatności" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="cash">Gotówka/Przedpłata</Select.Item>
					<Select.Item value="transfer">Przelew bankowy</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>

		<div class="flex flex-col col-span-2 gap-y-3">
			<Label>Metoda dostawy</Label>
			<Select.Root
				selected={{
					value: 'cash',
					label: 'Kierowca ALDO'
				}}
			>
				<Select.Trigger class="w-[200px]">
					<Select.Value placeholder="Wybierz metodę dostawy" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="personal-delivery">Kierowca ALDO</Select.Item>
					<Select.Item value="personal-pickup">Odbiór osobisty</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>

		<!-- <Form.Field {config} name="paymentMethod">
			<Form.Item class="flex flex-col col-span-2 gap-y-3">
				<Form.Label>Metoda płatności<RequiredAsterisk /></Form.Label>
				<Form.RadioGroup class="flex flex-col space-y-1" required>
					<Form.Item class="flex items-center space-x-3 space-y-0">
						<Form.RadioItem value="cash" id="cash" aria-required />
						<Label for="cash" class="font-normal">Gotówka lub przedpłata</Label>
					</Form.Item>
					<Form.Item class="flex items-center space-x-3 space-y-0">
						<Form.RadioItem value="transfer" id="transfer" aria-required />
						<Label for="transfer" class="font-normal">Przelew bankowy</Label>
					</Form.Item>
				</Form.RadioGroup>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="deliveryMethod">
			<Form.Item class="flex flex-col col-span-2 gap-y-3">
				<Form.Label>Metoda dostawy<RequiredAsterisk /></Form.Label>
				<Form.RadioGroup class="flex flex-col space-y-1" required>
					<Form.Item class="flex items-center space-x-3 space-y-0">
						<Form.RadioItem value="personal-delivery" id="personal-delivery" aria-required />
						<Label for="personal-delivery" class="font-normal">Kierowca ALDO</Label>
					</Form.Item>
				</Form.RadioGroup>
				<Form.Validation />
			</Form.Item>
		</Form.Field> -->
	</div>
</form>

<!-- If address changed -->
<!-- {#if customerAddress.street !== formValues.street || customerAddress.city !== formValues.city || customerAddress.zipCode !== formValues.zipCode}
<div class="grid">
    <Form.Field {config} name="saveAddress">
        <Form.Item
            class="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md"
        >
            <Form.Checkbox />
            <div class="space-y-1 leading-none">
                <Form.Label>Zapamiętaj adres</Form.Label>
                <Form.Description>
                    Zostanie uzupełniony automatycznie przy następnych zamówieniach
                </Form.Description>
            </div>
        </Form.Item>
    </Form.Field>
</div>
{/if}-->
