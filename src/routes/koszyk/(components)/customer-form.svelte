<script lang="ts">
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import { cart$ } from '$lib/client/schemas/index.js';

	import * as Command from '$shadcn/command';
	import * as Popover from '$shadcn/popover';
	import * as Form from '$shadcn/form';
	import { buttonVariants } from '$shadcn/button';

	import { tick } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { cn } from '$lib/utils';
	import { Check } from 'lucide-svelte';
	import { CaretSort } from 'radix-icons-svelte';
	import type { CartCustomerForm } from '$lib/client/schemas/cart';
	type PageServerData = import('../$types').PageServerData;

	type Customers = NonNullable<PageServerData['customers']>;

	export let customers: Customers;
	export let superform: SuperValidated<Infer<CartCustomerForm>>;
	export let user: {
		id: string;
		fullName: string;
	};

	const form = superForm(superform, {
		validators: zodClient(cart$.changeCartCustomer),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				console.log(f, f.message, f.posted, f.errors);
				// toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
				toast.success(`Sukces`);
			} else {
				toast.error('Błąd');
			}
		},
		invalidateAll: true
	});
	const { form: formData, enhance, delayed, submitting } = form;

	const userCombobox = { value: user.id, label: `${user.fullName} (Ty)` };

	const customersCombobox = customers
		? [
				userCombobox,
				...customers.map((customer) => ({
					label: customer.fullName,
					value: customer.id
				}))
		  ]
		: [userCombobox];

	let open = false;

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<form method="POST" action="?/setCustomer" use:enhance class="flex items-center w-full gap-x-3">
	<!-- Select customer -->
	<Form.Field {form} name="customerId" class="flex flex-col">
		<Popover.Root bind:open let:ids>
			<Form.Control let:attrs>
				<Form.Label>Klient</Form.Label>
				<Popover.Trigger
					class={cn(
						buttonVariants({ variant: 'outline' }),
						'w-[200px] justify-between',
						!$formData.customerId && 'text-muted-foreground'
					)}
					role="combobox"
					{...attrs}
				>
					{customersCombobox.find((f) => f.value === $formData.customerId)?.label ??
						'Wybierz klienta...'}
					<CaretSort class="w-4 h-4 ml-2 opacity-50 shrink-0" />
				</Popover.Trigger>
				<input hidden value={$formData.customerId} name={attrs.name} />
			</Form.Control>
			<Popover.Content class="w-[200px] p-0">
				<Command.Root>
					<Command.Input autofocus placeholder="Wybierz klienta..." class="h-9" />
					<Command.Empty>Brak klientów...</Command.Empty>
					<Command.Group>
						{#each customersCombobox as customer}
							<Command.Item
								value={customer.value}
								onSelect={() => {
									$formData.customerId = customer.value;
									closeAndFocusTrigger(ids.trigger);
								}}
							>
								{customer.label}
								<Check
									class={cn(
										'ml-auto h-4 w-4',
										customer.value !== $formData.customerId && 'text-transparent'
									)}
								/>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
		<Form.Description>Jako moderator możesz złożyć zamówienie w imieniu klienta.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-20" disabled={$submitting}>
		{#if $delayed}
			<Spinner />
		{:else}
			Zapisz
		{/if}
	</Form.Button>
</form>
