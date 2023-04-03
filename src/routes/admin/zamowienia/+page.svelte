<script lang="ts">
	import TableHeader from '$components/Table/TableHeader.svelte';

	import type { OrderFilter, OrderWithCustomer } from '$types';
	import Table from '$components/Table/Table.svelte';
	import Drawer from '$components/AdminDrawer.svelte';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import toast from 'svelte-french-toast';

	export let data;

	type DefaultOrderList = typeof data.orders;

	let searchInput = '';
	let streamedOrders: DefaultOrderList = [];

	const orderParser = (orders: DefaultOrderList) => {
		return orders.reduce<OrderWithCustomer[]>((acc, row) => {
			const { attachedCustomer, order } = row;

			if (attachedCustomer) {
				return [
					...acc,
					{
						...order,
						attachedCustomer
					}
				];
			} else {
				return acc;
			}
		}, []);
	};

	data.promise.orders
		.then((orders) => {
			streamedOrders = orders;
		})
		.catch((err) => {
			console.error(err);
			toast.error('Nie udało się pobrać wszystkich zamówień');
		});

	$: orders = orderParser([...data.orders, ...streamedOrders]);
	// .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

	// .filter(
	// 	(user) =>
	// 		textCrusher(user.email).includes(textCrusher(searchInput)) ||
	// 		textCrusher(user.fullName).includes(textCrusher(searchInput))
	// );

	// let editDrawerUserId: string;

	// $: editUserModal = users.find((user) => user.id === editDrawerUserId);

	// const getUserFromDrawer = () => {
	// 	const drawerS = $drawer;
	// 	if (drawerS && drawerS.action === 'edit' && drawerS.type === 'user') {
	// 		const user = users.find((user) => user.id === drawerS.id);
	// 		return user;
	// 	}
	// };
</script>

<svelte:head>
	<title>Zamówienia • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista zamówień złożonych w Twoje ALDO."
	/>
</svelte:head>

<section class="w-full h-full p-2 space-y-3">
	<TableHeader type="order" bind:searchInput />

	<Table
		type="orders"
		orderHeaders={['products', 'customer', 'status', 'action', 'createdAt']}
		items={orders}
	/>

	<Drawer>
		{#if $drawer && $drawer.type === 'user'}
			<!-- {#if $drawer.action === 'add'}
				<NewUser />
			{:else if $drawer.action === 'edit'}
				<EditUser user={getUserFromDrawer()} />
			{:else if $drawer.action === 'filter'}
				<FilterUsers bind:filter />
			{/if} -->
		{/if}
	</Drawer>
</section>
