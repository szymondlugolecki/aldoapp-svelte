<script lang="ts">
	import type { GridTableColumn } from '$types';
	import Drawer from '$components/AdminDrawer.svelte';
	import { drawer, openDrawer } from '$lib/client/stores/adminDrawer';
	import toast from 'svelte-french-toast';
	import type { PromoCodeWithUses } from '$types/PromoCodeTypes';
	import NewPromoCode from '$components/Modals/PromoCode/NewPromoCode.svelte';
	import type { TCell } from 'gridjs/dist/src/types.js';
	import { h, type Row } from 'gridjs';
	import Grid from 'gridjs-svelte';
	import { roleNames } from '$lib/client/constants/index.js';
	import type { userRoles, UserRole, discountTypes } from '$lib/client/constants/dbTypes.js';
	import plPL from '$lib/client/constants/gridLocalePL';
	import { page } from '$app/stores';
	import { dateParser, getRoleRank } from '$lib/client/functions/index.js';

	export let data;

	type DefaultPromoCodesList = typeof data.promoCodes;
	let streamedPromoCodes: DefaultPromoCodesList = [];
	let loadingStreamedPromoCodes = true;

	const codesParser = (promoCodes: DefaultPromoCodesList) => {
		const groupedPromoCodes = promoCodes.reduce<Record<number, PromoCodeWithUses>>((acc, row) => {
			const { promoCode, usage, author } = row;

			if (!author) return acc;

			if (!acc[promoCode.id]) {
				acc[promoCode.id] = {
					...promoCode,
					author: author,
					uses: []
				};
			}

			if (author) {
				acc[promoCode.id].author = author;
			}

			if (usage) {
				acc[promoCode.id].uses.push(usage.userId);
			}

			return acc;
		}, []);

		return Object.values(groupedPromoCodes);
	};

	data.promise.promoCodes
		.then((promoCodez) => {
			streamedPromoCodes = promoCodez;
		})
		.catch((err) => {
			console.error(err);
			toast.error('Nie udało się pobrać wszystkich zamówień');
		})
		.finally(() => {
			loadingStreamedPromoCodes = false;
		});

	$: promoCodes = codesParser([...data.promoCodes, ...streamedPromoCodes]);
	// .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

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
			name: 'Kod',
			formatter: (cell, row) => {
				const { errorText } = columnHelper(cell, row, 'string');
				if (errorText !== null) {
					return errorText;
				}

				return h('span', {}, cell);
			},
			sort: true
		},
		{
			name: 'Rabat',
			formatter: (cell, row) => {
				const { errorText } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (!Array.isArray(cell)) {
					return '🛑';
				}

				return h('span', {}, `${cell[0] || '⚠️'}${cell[1] === 'percent' ? '%' : ' zł'}`);
			},
			sort: false
		},
		{
			name: 'Użyty',
			formatter: (cell, row) => {
				const { errorText } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (!Array.isArray(cell)) {
					return '🛑';
				}

				let usesText = 'razy';
				if (cell) {
					cell.length === 1 && (usesText = 'raz');
				}

				return h('span', {}, `${isNaN(cell?.length) ? '⚠️' : cell.length} ${usesText}`);
			},
			sort: false
		},
		{
			name: 'Dodatkowe informacje',
			formatter: (cell, row) => {
				const { id, errorText } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (!Array.isArray(cell)) {
					return '🛑';
				}

				// info: [enabled, perUserLimit, totalUseLimit],

				return h(
					'div',
					{ class: 'flex flex-col items-start' },
					h(
						'button',
						{
							class: 'hover:text-primary duration-150',
							onClick: () =>
								openDrawer({
									type: 'promoCode',
									action: 'edit',
									id,
									key: 'enabled'
								})
						},
						'Aktywowany: ' + (cell[0] === true ? 'tak 🟢' : 'nie 🔴')
					),
					h(
						'button',
						{
							class: 'hover:text-primary duration-150',
							onClick: () =>
								openDrawer({
									type: 'promoCode',
									action: 'edit',
									id,
									key: 'perUserLimit'
								})
						},
						`Limit na użytkownika: ${cell[1] || '⚠️'}`
					),
					h(
						'button',
						{
							class: 'hover:text-primary duration-150',
							onClick: () =>
								openDrawer({
									type: 'promoCode',
									action: 'edit',
									id,
									key: 'totalUseLimit'
								})
						},
						`Całkowity limit użyć: ${cell[2] || '⚠️'}`
					)
				);
			},
			sort: false
		},
		{
			name: 'Okres aktywności',
			formatter: (cell, row) => {
				const { errorText, id } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (!Array.isArray(cell)) {
					return '🛑';
				}

				// info: [enabled, perUserLimit, totalUseLimit],

				return h(
					'div',
					{
						class: 'flex flex-col items-start'
					},
					h(
						'button',
						{
							class: 'hover:text-primary duration-150',
							onClick: () =>
								openDrawer({
									type: 'promoCode',
									action: 'edit',
									id,
									key: 'validSince'
								})
						},
						'Od: ' + dateParser(cell[0], 'short')
					),
					h(
						'button',
						{
							class: 'hover:text-primary duration-150',
							onClick: () =>
								openDrawer({
									type: 'promoCode',
									action: 'edit',
									id,
									key: 'validUntil'
								})
						},
						'Do: ' + dateParser(cell[1], 'short')
					)
				);
			},
			sort: false
		},
		{
			name: 'Utworzony',
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
</script>

<svelte:head>
	<title>Zamówienia • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista zamówień złożonych w Twoje ALDO."
	/>
</svelte:head>

<section class="w-full h-full p-2 space-y-3">
	<!-- <TableHeader type="promoCode" bind:searchInput />

	<Table
		type="promoCodes"
		promoCodesHeaders={[
			'code',
			'discount',
			'uses',
			'action',
			'extraInfo',
			'validDateRange',
			'createdAt'
		]}
		items={promoCodes}
		isLoading={loadingStreamedPromoCodes}
	/> -->

	<div class="">
		<button
			class="btn btn-primary"
			on:click={() => {
				openDrawer({
					action: 'add',
					type: 'promoCode'
				});
			}}>Dodaj nowy kod promocyjny</button
		>
	</div>

	{#if promoCodes && promoCodes.length > 0}
		<Grid
			{columns}
			language={plPL}
			search
			fixedHeader
			className={{
				td: 'text-base-content',
				sort: 'text-base-content bg-base-content'
			}}
			data={promoCodes.map((promoCode) => {
				const {
					id,
					code,
					discount,
					discountType,
					uses,
					enabled,
					perUserLimit,
					totalUseLimit,
					validSince,
					validUntil,
					author,
					createdAt
				} = promoCode;
				const parsedPromoCode = {
					id,
					code,
					discount: [discount, discountType],
					uses,
					info: [enabled, perUserLimit, totalUseLimit],
					validDateRange: [validSince, validUntil],
					created: [author, createdAt]
				};
				return Object.values(parsedPromoCode);
			})}
		/>{/if}

	<Drawer>
		{#if $drawer && $drawer.type === 'promoCode'}
			{#if $drawer.action === 'add'}
				<NewPromoCode />
			{/if}
		{/if}
	</Drawer>
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
