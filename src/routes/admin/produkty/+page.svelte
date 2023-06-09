<script lang="ts">
	import Drawer from '$components/AdminDrawer.svelte';
	import Grid from 'gridjs-svelte';
	import { Row, h } from 'gridjs';

	import { arrayUniqueByKey, dateParser } from '$lib/client/functions';
	import type { GridTableColumn, ProductFilter } from '$types';
	import { drawer, openDrawer } from '$lib/client/stores/adminDrawer';
	import NewProduct from '$components/Modals/Product/NewProduct.svelte';
	import EditProduct from '$components/Modals/Product/EditProduct.svelte';
	import RemoveProduct from '$components/Modals/Product/RemoveProduct.svelte';
	import { imagesSorting } from '$lib/client/functions/sorting';
	import type { MainCategory, Producent } from '$lib/client/constants/dbTypes.js';
	import { fodderCategories, fodderNames, producentsList } from '$lib/client/constants/index.js';
	import plPL from '$lib/client/constants/gridLocalePL';
	import type { TCell } from 'gridjs/dist/src/types.js';

	export let data;

	let filter: ProductFilter = {
		excludedUserIds: [],
		createdSince: null,
		createdUntil: new Date(new Date().setHours(23, 59, 59, 999))
			.toLocaleDateString()
			.split('.')
			.reverse()
			.join('-')
	};

	// Unique list of users that have added at least one product
	// let productAuthors = arrayUniqueByKey(
	// 	data.products.map((product) => product.author),
	// 	'id'
	// );

	const dataProductsSorted = data.products
		.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
		.map((product) => {
			return {
				...product,
				images: product.images.sort(imagesSorting)
			};
		});

	// Final list of products filtered by the input from the searchbar, etc.
	// $: products = applyProductFilters(dataProductsSorted, filter, searchInput);

	// let product: ProductWithAuthorAndImage | undefined;

	$: drawerProduct =
		($drawer &&
			$drawer.action === 'edit' &&
			$drawer.type === 'product' &&
			dataProductsSorted.find(
				(product) => $drawer?.action === 'edit' && product.id === $drawer.id
			)) ||
		undefined;

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
			name: 'Link',
			formatter: (cell, row) => {
				const { errorText } = columnHelper(cell, row, 'string');
				if (errorText !== null) {
					return errorText;
				}

				// if (!Array.isArray(cell)) {
				// 	return '🛑';
				// }

				return h(
					'a',
					{
						href: ('/sklep/' + cell) as string,
						target: '_blank',
						class: 'hover:text-primary duration-150'
					},
					'Sprawdź'
				);
			},
			sort: false
		},
		{
			name: 'Produkt',
			formatter: (cell, row) => {
				const { errorText, id } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (!Array.isArray(cell)) {
					return '🛑';
				}

				return h(
					'div',
					{ class: 'flex flex-col items-start' },
					h(
						'button',
						{
							class: 'hover:text-primary duration-15 text-left',
							onClick: () =>
								openDrawer({
									type: 'product',
									action: 'edit',
									id,
									key: 'name'
								})
						},
						cell[0]
					),
					h(
						'button',
						{
							class: 'hover:text-primary duration-150',
							onClick: () =>
								openDrawer({
									type: 'product',
									action: 'edit',
									id,
									key: 'symbol'
								})
						},
						cell[1]
					)
				);
			},
			sort: false
		},
		{
			name: 'Zdjęcia',
			formatter: (cell, row) => {
				const { errorText, id } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (!Array.isArray(cell)) {
					return '🛑';
				}

				let images = cell.slice(0, 3).map((image) =>
					h(
						'button',
						{
							onClick: () =>
								openDrawer({
									type: 'product',
									action: 'edit',
									id,
									key: 'images'
								})
						},
						h('img', {
							src: image,
							width: 36,
							height: 36,
							alt: 'dobra es'
						})
					)
				);

				return h(
					'div',
					{ class: 'grid grid-cols-3 gap-2 w-full h-auto', 'aria-label': 'Edytuj zdjęcia' },
					...images
				);
			},
			sort: false
		},
		{
			name: 'Cena',
			formatter: (cell, row) => {
				const { errorText, id } = columnHelper(cell, row, 'string');
				if (errorText !== null) {
					return errorText;
				}

				return h(
					'button',
					{
						class: 'hover:text-primary duration-150',
						onClick: () =>
							openDrawer({
								type: 'product',
								action: 'edit',
								id,
								key: 'price'
							})
					},
					cell
				);
			},
			sort: true
		},
		{
			name: 'Dodatkowe informacje',
			formatter: (cell, row) => {
				const { errorText, id } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (!Array.isArray(cell)) {
					return '🛑';
				}

				return h(
					'div',
					{ class: 'flex flex-col items-start' },
					h(
						'button',
						{
							class: 'hover:text-primary duration-150',
							onClick: () =>
								openDrawer({
									type: 'product',
									action: 'edit',
									id,
									key: 'producent'
								})
						},
						'Producent: ' + producentsList[cell[0] as Producent]
					),
					h(
						'button',
						{
							class: 'hover:text-primary duration-150',
							onClick: () =>
								openDrawer({
									type: 'product',
									action: 'edit',
									id,
									key: 'weight'
								})
						},
						`Waga: ${cell[1]} kg`
					)
					// h(
					// 	'button',
					// 	{
					// 		class: 'hover:text-primary duration-150',
					// 		onClick: () =>
					// 			openDrawer({
					// 				type: 'product',
					// 				action: 'edit',
					// 				id,
					// 				key: 'totalUseLimit'
					// 			})
					// 	},
					// 	`Stan na magazynie: ${cell[2] || '⚠️'}`
					// )
				);
			},
			sort: true
		},
		{
			name: 'Kategorie',
			formatter: (cell, row) => {
				const { errorText, id } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (!Array.isArray(cell)) {
					return '🛑';
				}

				return h(
					'div',
					{ class: 'flex flex-col items-start' },
					h(
						'button',
						{
							class: 'hover:text-primary duration-150',
							onClick: () =>
								openDrawer({
									type: 'product',
									action: 'edit',
									id,
									key: 'category'
								})
						},
						fodderNames[cell[0] as MainCategory]
					),
					h(
						'button',
						{
							class: 'hover:text-primary duration-150 text-left',
							onClick: () =>
								openDrawer({
									type: 'product',
									action: 'edit',
									id,
									key: 'subcategory'
								})
						},
						// @ts-expect-error
						fodderCategories[cell[0] as MainCategory].find((sub) => sub.id === cell[1])?.name
					)
				);
			},
			sort: true
		},
		{
			name: 'Opis',
			formatter: (cell, row) => {
				const { errorText, id } = columnHelper(cell, row, ['string', 'object']);

				console.log('errorText', errorText);

				if (errorText !== null) {
					return errorText;
				}

				return h(
					'button',
					{
						class: 'flex flex-col truncate hover:text-primary duration-150',
						onClick: () =>
							openDrawer({
								type: 'product',
								action: 'edit',
								id,
								key: 'description'
							})
					},
					cell ? (cell as string).slice(0, 15) : 'Brak opisu...'
				);
			},
			sort: false
		},
		{
			name: 'Dodany',
			formatter: (cell, row) => {
				const { errorText } = columnHelper(cell, row, 'object');
				if (errorText !== null) {
					return errorText;
				}

				if (!Array.isArray(cell)) {
					return '🛑';
				}

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
	<title>Produkty • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista produktów dostępnych w Twoje ALDO. Dodaj, edytuj lub usuń."
	/>
</svelte:head>

<section class="w-full h-full p-2 space-y-3">
	<div class="collapse border border-base-300 rounded-box">
		<input type="checkbox" />
		<div class="collapse-title text-xl font-medium">Filtrowanie</div>
		<div class="collapse-content">
			<div class="space-y-0.5">
				<!-- Created date -->

				<span class="block label">Data utworzenia</span>

				<div class="grid grid-cols-1 xs:grid-cols-3 gap-2">
					<div class="w-full">
						<label for="joined-date-from" class="block text-sm text-base-content">Od</label>
						<input
							class="w-full sm:w-auto p-2 rounded-md"
							type="date"
							name="joined-date-from"
							bind:value={filter.createdSince}
						/>
					</div>
					<div class="w-full">
						<label for="joined-date-to" class="block text-sm text-base-content">Do</label>
						<input
							type="date"
							name="joined-date-to"
							class="w-full sm:w-auto p-2 rounded-md"
							bind:value={filter.createdUntil}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="">
		<button
			class="btn btn-primary"
			on:click={() => {
				openDrawer({
					action: 'add',
					type: 'product'
				});
			}}>Dodaj nowy produkt</button
		>
	</div>

	<Grid
		{columns}
		language={plPL}
		search
		fixedHeader
		className={{
			td: 'text-base-content',
			sort: 'text-base-content bg-base-content'
		}}
		data={dataProductsSorted.map((product) => {
			const {
				id,
				name,
				images,
				price,
				amountLeft,
				encodedURL,
				weight,
				symbol,
				category,
				subcategory,
				producent,
				description,
				author,
				createdAt
			} = product;
			const parsedProducts = {
				id,
				url: encodedURL,
				name: [name, symbol],
				images,
				price,
				info: [producent, weight, amountLeft],
				categories: [category, subcategory],
				description,
				created: [author, createdAt]
			};
			return Object.values(parsedProducts);
		})}
	/>

	<Drawer>
		{#if $drawer && $drawer.type === 'product'}
			{#if $drawer.action === 'add'}
				<NewProduct />
			{:else if $drawer.action === 'edit' && drawerProduct}
				<EditProduct product={drawerProduct} />
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
