<script lang="ts">
	import Grid from 'gridjs-svelte';
	import { Row, h } from 'gridjs';
	import plPL from '$lib/client/constants/gridLocalePL';
	import type { TCell } from 'gridjs/dist/src/types.js';

	import type { GridTableColumn, OrderFilter, OrderWithCustomer } from '$types';
	import Drawer from '$components/AdminDrawer.svelte';
	import { drawer, openDrawer } from '$lib/client/stores/adminDrawer';
	import toast from 'svelte-french-toast';
	import type { OrderStatus } from '$lib/client/constants/dbTypes';
	import Preview from '$components/Modals/Preview.svelte';
	import { orderStatusList } from '$lib/client/constants/index.js';
	import { dateParser } from '$lib/client/functions/index.js';

	let searchInput = '';

	// $: drawerOrder =
	// 	$drawer &&
	// 	($drawer.action === 'edit' || $drawer.action === 'preview') &&
	// 	$drawer.type === 'order' &&
	// 	orders.find(
	// 		(order) =>
	// 			($drawer?.action === 'edit' || $drawer?.action === 'preview') && order.id === $drawer.id
	// 	);

	// const orderParser = (orders: DefaultOrderList) => {
	// 	return orders.reduce<OrderWithCustomer[]>((acc, row) => {
	// 		const { attachedDriver, attachedCustomer, order } = row;

	// 		if (attachedCustomer) {
	// 			return [
	// 				...acc,
	// 				{
	// 					...order,
	// 					attachedCustomer,
	// 					attachedDriver
	// 				}
	// 			];
	// 		} else {
	// 			return acc;
	// 		}
	// 	}, []);
	// };

	const columnHelper = (cell: TCell, row: Row, cellType: string | string[]) => {
		const id = row.cells[0].data;

		if (typeof cellType === 'string' && cellType !== typeof cell) {
			return { id: null, errorText: '⚠️' };
		}

		if (Array.isArray(cellType) && !cellType.includes(typeof cell)) {
			return { id: null, errorText: '⚠️' };
		}

		if (typeof id === 'number' || typeof id === 'string') {
			return { id, errorText: null };
		} else {
			return { id: null, errorText: '⚠️' };
		}
	};

	const columns: GridTableColumn[] = [
		{
			name: 'Id',
			hidden: true
		},
		{
			name: 'Produkty',
			formatter: (cell, row) => {
				const { errorText, id } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (!Array.isArray(cell)) {
					return '🛑';
				}

				return h(
					'button',
					{
						class: 'flex flex-col items-start hover:text-primary duration-150 text-left',
						onClick: () =>
							openDrawer({
								type: 'order',
								action: 'preview',
								id,
								key: 'productIds'
							})
					},
					'Podgląd'
				);
			},
			sort: false
		},
		{
			name: 'Cena',
			formatter: (cell, row) => {
				const { errorText, id } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (!Array.isArray(cell)) {
					return '🛑';
				}

				return h(
					'button',
					{
						class: 'flex flex-col items-start hover:text-primary duration-150 text-left',
						onClick: () =>
							openDrawer({
								type: 'order',
								action: 'preview',
								id,
								key: 'productIds'
							})
					},
					`${(Number(cell[0]) - Number(cell[1])).toFixed(2)} zł (Rabat: ${cell[1]} zł)`
				);
			},
			sort: true
		},
		{
			name: 'Status',
			formatter: (cell, row) => {
				const { errorText, id } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (!Array.isArray(cell)) {
					return '🛑';
				}

				return h(
					'button',
					{
						class: 'flex flex-col items-start hover:text-primary duration-150 text-left',
						onClick: () =>
							openDrawer({
								type: 'order',
								action: 'edit',
								id,
								key: 'status'
							})
					},
					orderStatusList[cell[0] as OrderStatus]
				);
			},
			sort: true
		},
		{
			name: 'Kierowca',
			formatter: (cell, row) => {
				const { errorText, id } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (Array.isArray(cell)) {
					return '🛑';
				}

				return h(
					'button',
					{
						class: 'flex flex-col items-start hover:text-primary duration-150 text-left',
						onClick: () =>
							openDrawer({
								type: 'order',
								action: 'edit',
								id,
								key: 'driverId'
							})
					},
					(cell as OrderWithCustomer['attachedDriver'])?.fullName ?? 'Brak'
				);
			},
			sort: true
		},
		{
			name: 'Płatność i dostawa',
			formatter: (cell, row) => {
				const { errorText, id } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (!Array.isArray(cell)) {
					return '🛑';
				}

				return h(
					'button',
					{
						class: 'flex flex-col items-start hover:text-primary duration-150 text-left',
						onClick: () =>
							openDrawer({
								type: 'order',
								action: 'edit',
								id,
								key: 'paymentMethod'
							})
					},
					h('span', {}, cell[0] === 'personal-delivery' ? 'Kurier ALDO' : '⚠️'),
					h(
						'span',
						{},
						cell[1] === 'cash' ? 'Płatność gotówką' : cell[1] === 'transfer' ? 'Przelew' : '⚠️'
					)
				);
			},
			sort: true
		},
		{
			name: 'Złożono',
			formatter: (cell, row) => {
				const { errorText } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (!Array.isArray(cell)) {
					return '🛑';
				}

				// info: [enabled, perUserLimit, totalUseLimit],

				return h(
					'div',
					{ class: 'flex flex-col' },
					h('span', {}, 'Przez: ' + cell[0].fullName || '⚠️'),
					h('span', {}, 'W dniu: ' + dateParser(cell[1], 'short'))
				);
			},
			sort: false
		}
	];

	/* 
	data={orders.map((order) => {
			const {
				id,
				price,
				status,
				createdAt,
				address,
				attachedCustomer,
				deliveryMethod,
				deliveryStatus,
				discount,
				attachedDriver,
				productsQuantity,
				productIds,
				paymentMethod,
				paymentStatus
			} = order;

			const parsedOrders = {
				id,
				products: [productIds, productsQuantity],
				price: [price, discount],
				status: [status, paymentStatus, deliveryStatus],
				driver: attachedDriver,
				// address,
				methods: [deliveryMethod, paymentMethod],
				created: [attachedCustomer, createdAt]
			};

			return Object.values(parsedOrders);
		})} 
	*/

	const server: {
		url: string;
		total: (data: any) => number;
		then: (data: any) => any[];
	} = {
		url: '/api/orders/list',
		total: (data) => data.count,
		then: (data) => {
			console.log('data', data);
			return new Array(10).fill([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		}
	};

	const pagination: {
		enabled: boolean;
		limit: number;
		server: {
			url: (prev: string, page: number) => string;
		};
	} = {
		enabled: true,
		limit: 10,
		server: {
			// https://github.com/grid-js/gridjs/issues/84
			url: (prev, page) => {
				console.log('prev', prev, 'page', page);
				return `${prev}${prev.includes('?') ? '&' : '?'}page=${page + 1}`;
			}
		}
	};

	// const search = {
	// 	enabled: true,
	// 	server: {
	// 		url: (prev, keyword) => `${prev}?search=${keyword}`
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
	<Grid
		{columns}
		{pagination}
		{server}
		language={plPL}
		fixedHeader
		className={{
			td: 'text-base-content',
			sort: 'text-base-content bg-base-content'
		}}
	/>

	<!-- <Drawer>
		{#if $drawer?.type === 'order'}
			{#if $drawer?.action === 'preview' && drawerOrder}
				<Preview order={drawerOrder} />
			{/if}
		{/if}
	</Drawer> -->
</section>

<style>
	:global(.gridjs-wrapper:nth-last-of-type(2)) {
		border-bottom: 0;
	}

	:global(th.gridjs-th) {
		background-color: hsl(var(--b1) / var(--tw-bg-opacity)) !important;
		color: hsl(var(--bc)) !important;
	}

	:global(td.gridjs-td) {
		background-color: hsl(var(--b1) / var(--tw-bg-opacity)) !important;
	}

	:global(.gridjs-search > input) {
		background-color: hsl(var(--b1) / var(--tw-bg-opacity)) !important;
		color: hsl(var(--bc)) !important;
	}
</style>
