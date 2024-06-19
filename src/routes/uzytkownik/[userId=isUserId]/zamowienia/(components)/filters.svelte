<script lang="ts">
	import type { OrderStatus } from '$lib/client/constants/dbTypes';
	import { createSlider, melt, createCombobox, type ComboboxOptionProps } from '@melt-ui/svelte';
	import Status from './filter-status.svelte';
	import CartOwner from './filter-cart-owner.svelte';
	import Customer from './filter-customer.svelte';
	import { page } from '$app/stores';
	import { uniqueObjectById } from '$lib/client/functions/sorting';
	import { orderStatusList } from '$lib/client/constants';
	import type { AllCustomers, BasicUser, AllCartOwners } from '$types';

	const all = {
		id: 'all',
		email: 'Wszyscy',
		fullName: 'Wszyscy'
	} satisfies AllCustomers;

	type ExtendedStatus = OrderStatus | 'all';
	type ExtendedCustomer = BasicUser | AllCustomers;
	type ExtendedCartOwner = ExtendedCustomer;

	$: priceMin = Number($page.url.searchParams.get('cena_min')) || undefined;
	$: priceMax = Number($page.url.searchParams.get('cena_max')) || undefined;
	$: orderStatus = ($page.url.searchParams.get('status_zamowienia') || 'all') as
		| OrderStatus
		| 'all';
	$: customerId = $page.url.searchParams.get('klient_id') || 'all';
	$: cartOwnerId = $page.url.searchParams.get('zleceniodawca_id') || 'all';

	// const statusFilterFn: ComboboxFilterFunction<ExtendedStatus> = ({ itemValue, input }) => {
	// 	const normalize = (str: string) => str.normalize().toLowerCase();
	// 	const normalizedInput = normalize(input);
	// 	return normalizedInput === '' || normalize(itemValue).includes(normalizedInput);
	// };

	// const customerFilterFn: ComboboxFilterFunction<BasicUser | 'all'> = ({ itemValue, input }) => {
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

	const {
		elements: { root, range, thumb },
		states: { value }
	} = createSlider({
		min: 0,
		max: 3000,
		step: 25
	});

	$: customersList = uniqueObjectById(orderDetails.customers);
	$: cartOwnersList = uniqueObjectById(orderDetails.cartOwners);

	$: statusCombobox = createCombobox<ExtendedStatus>({
		forceVisible: true,
		defaultSelected:
			orderStatus === 'all'
				? {
						value: 'all',
						label: 'Wszystkie'
				  }
				: { value: orderStatus, label: orderStatusList[orderStatus] }
	});

	$: selectedCartOwner = cartOwnersList.find((cartOwner) => cartOwner.id === cartOwnerId);
	$: cartOwnerCombobox = createCombobox<ExtendedCartOwner>({
		forceVisible: true,
		defaultSelected:
			!cartOwnerId || cartOwnerId === 'all' || !selectedCartOwner
				? { value: all, label: all.fullName }
				: { value: selectedCartOwner, label: selectedCartOwner.fullName }
	});

	$: selectedCustomer = customersList.find((customer) => customer.id === customerId);
	$: customerCombobox = createCombobox<ExtendedCustomer>({
		forceVisible: true,
		defaultSelected:
			!customerId || customerId === 'all' || !selectedCustomer
				? { value: all, label: all.fullName }
				: { value: selectedCustomer, label: selectedCustomer.fullName }
	});

	$: {
		$value[0] = priceMin || 0;
		$value[1] = priceMax || 3000;
	}

	export let orderDetails: import('../../$types').LayoutServerData['orderDetails'];
</script>

<form class="grid gap-4 py-4" id="order-filter-form" method="get">
	<Status bind:combobox={statusCombobox} />

	<CartOwner
		bind:combobox={cartOwnerCombobox}
		cartOwners={uniqueObjectById(orderDetails.cartOwners)}
	/>

	<Customer bind:combobox={customerCombobox} customers={uniqueObjectById(orderDetails.customers)} />

	<div class="grid gap-y-1">
		<span class="text-sm font-medium">Koszt zamówienia</span>

		<span>{$value[0]} zł - {$value[1]} zł</span>

		<input type="hidden" name="cena_min" value={$value[0]} />
		<input type="hidden" name="cena_max" value={$value[1]} />
	</div>

	<div class="pl-[10px]">
		<span use:melt={$root} class="relative flex h-[20px] w-[200px] items-center">
			<span class="block h-[3px] w-full bg-black/40">
				<span use:melt={$range} class="h-[3px] bg-foreground" />
			</span>

			{#each $value as _}
				<span
					use:melt={$thumb()}
					class="block w-5 h-5 rounded-full bg-foreground focus:ring-4 focus:ring-black/40"
				/>
			{/each}
		</span>
	</div>
</form>
