<script lang="ts">
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import { cart$ } from '$lib/client/schemas/index.js';

	import * as Form from '$shadcn/form';
	import type { SelectOption } from '@melt-ui/svelte';
	import type { OnChangeFn } from 'bits-ui/dist/internal/types';
	type PageServerData = import('../$types').PageServerData;

	type Customers = NonNullable<PageServerData['customers']>;

	export let customers: Customers;
	export let setCustomerForm: PageServerData['setCustomerForm'];
	export let selectedCustomer: NonNullable<PageServerData['customers']>[number];
	export let user: {
		id: string;
		fullName: string;
	};

	$: isChangingCustomer = false;
	console.log('isChangingCustomer', isChangingCustomer);
	const onSelectChange: OnChangeFn<SelectOption<unknown> | undefined> = (e) => {
		console.log(
			'selected locally:',
			(e as SelectOption<typeof user> | undefined)?.value.id,
			'selected on the server:',
			selectedCustomer.id
		);
		if (e) {
			isChangingCustomer = (e as SelectOption<typeof user>).value.id !== selectedCustomer.id;
		}
	};
</script>

<Form.Root
	method="POST"
	form={setCustomerForm}
	schema={cart$.changeCartCustomer}
	action="?/setCustomer"
	let:config
	options={{
		invalidateAll: true
	}}
	let:submitting
	class="flex items-center w-full gap-x-3"
>
	<!-- Select customer -->
	<Form.Field {config} name="customerId">
		<Form.Item class="w-full">
			<Form.Label>Klient</Form.Label>
			{#if customers.length}
				<div class="flex gap-x-3">
					<Form.Select onSelectedChange={onSelectChange}>
						<Form.SelectTrigger placeholder="Zmień odbiorcę zamówienia" />
						<Form.SelectContent>
							{#each [{ id: user.id, fullName: `${user.fullName} (Ty)` }, ...customers] as customer}
								<Form.SelectItem value={customer.id}>{customer.fullName}</Form.SelectItem>
							{/each}
						</Form.SelectContent>
					</Form.Select>
					<Form.Button disabled={submitting || !isChangingCustomer}>
						{#if submitting}
							<Spinner />
						{:else}
							Potwierdź
						{/if}
					</Form.Button>
				</div>
			{:else}
				<p class="text-sm">Nie masz przypisanych żadnych klientów!</p>
			{/if}

			<Form.Description>Jako moderator możesz złożyć zamówienie w imieniu klienta.</Form.Description
			>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
</Form.Root>
