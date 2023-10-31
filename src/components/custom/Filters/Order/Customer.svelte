<script lang="ts">
	import type { AllCustomers, BasicUser } from '$types';
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	type ExtendedCustomer = BasicUser | AllCustomers;
	const allCustomers = {
		id: 'all',
		email: 'Wszyscy',
		fullName: 'Wszyscy'
	} satisfies AllCustomers;

	// [AllCustomers, ...BasicUser[]]
	export let customers: BasicUser[];

	$: extendedCustomers = [allCustomers, ...customers];

	// const filterFunction: ComboboxFilterFunction<BasicUser | 'all'> = ({ itemValue, input }) => {
	// 	const normalize = (str: string) => str.normalize().toLowerCase();
	// 	const normalizedInput = normalize(input);

	// 	return (
	// 		normalizedInput === '' ||
	// 		(itemValue !== 'all' &&
	// 			(normalize(itemValue.id).includes(normalizedInput) ||
	// 				normalize(itemValue.email).includes(normalizedInput) ||
	// 				normalize(itemValue.fullName).includes(normalizedInput)))
	// 	);
	// };

	export let combobox: ReturnType<typeof createCombobox<ExtendedCustomer>>;

	const {
		elements: { menu, input, option, label },
		states: { open, selected, touchedInput, inputValue, highlighted },
		helpers: { isSelected }
	} = combobox;

	const toOption = (customer: ExtendedCustomer): ComboboxOptionProps<ExtendedCustomer> => ({
		value: customer,
		label: customer.fullName
	});

	// $: if ($selected) {
	// 	const selectedCustomer = extendedCustomers.find(({ id }) => id === customerId);
	// 	console.log('selectedCustomer', selectedCustomer);
	// 	if (selectedCustomer) {
	// 		$selected.value = selectedCustomer;
	// 	} else {
	// 		$selected.value = allCustomers;
	// 	}
	// }

	$: if (!$open) {
		$inputValue = $selected?.label ?? '';
	}

	$: filteredCustomerList = $touchedInput
		? extendedCustomers.filter(({ id, email, fullName }) => {
				const normalizedInput = $inputValue.toLowerCase();
				return (
					id.toLowerCase().includes(normalizedInput) ||
					email.toLowerCase().includes(normalizedInput) ||
					fullName.toLowerCase().includes(normalizedInput)
				);
		  })
		: extendedCustomers;
</script>

<div class="flex flex-col gap-1">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label use:melt={$label}>
		<span class="text-sm font-medium">Klient</span>
	</label>

	<div class="relative">
		{#if $selected}
			<input type="hidden" name="klient_id" value={$selected.value.id} />
		{/if}
		<input
			use:melt={$input}
			class="flex items-center justify-between w-full h-10 px-3 pr-12 rounded-lg bg-input"
			spellcheck="false"
		/>
		<div class="absolute z-10 -translate-y-1/2 right-2 top-1/2">
			{#if $open}
				<ChevronUp class="square-4" />
			{:else}
				<ChevronDown class="square-4" />
			{/if}
		</div>
	</div>
</div>
{#if $open}
	<ul
		class="z-20 flex max-h-[300px] flex-col overflow-hidden rounded-lg bg-background"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div class="flex flex-col max-h-full gap-2 px-2 py-2 overflow-y-auto" tabindex="0">
			{#each filteredCustomerList as customer, index (index)}
				<li
					use:melt={$option(toOption(customer))}
					class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4 hover:bg-pink-100 data-[highlighted]:bg-pink-200 data-[highlighted]:text-pink-900 data-[disabled]:opacity-50"
				>
					{#if $isSelected(customer)}
						<div class="absolute z-10 text-pink-900 check left-2 top-1/2">
							<Check class="square-4" />
						</div>
					{/if}
					<div class="pl-4">
						<span class="font-medium">{customer.fullName}</span>
						{#if customer.id !== 'all'}
							<span class="block text-sm opacity-75">{customer.email}</span>
						{/if}
					</div>
				</li>
			{:else}
				<li class="relative py-1 pl-8 pr-4 rounded-md cursor-pointer">Brak wyników</li>
			{/each}
		</div>
	</ul>
{/if}

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 text-primary;
		translate: 0 calc(-50% + 1px);
	}
</style>
