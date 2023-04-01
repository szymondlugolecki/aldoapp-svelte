<script lang="ts">
	import TableHeader from '$components/Table/TableHeader.svelte';
	import Drawer from '$components/AdminDrawer.svelte';

	import { applyProductFilters, arrayUniqueByKey } from '$lib/client/functions';
	import type { ProductFilter, ProductWithAuthorAndImage } from '$types';
	import Table from '$components/Table/Table.svelte';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import NewProduct from '$components/Modals/Product/NewProduct.svelte';
	import EditProduct from '$components/Modals/Product/EditProduct.svelte';
	import RemoveProduct from '$components/Modals/Product/RemoveProduct.svelte';
	import { imagesSorting } from '$lib/client/functions/sorting';

	export let data;

	let searchInput = '';
	let authorFilterSearchInput = '';

	let filter: ProductFilter = {
		excludedUserIds: [],
		since: null,
		until: new Date(new Date().setHours(23, 59, 59, 999))
			.toLocaleDateString()
			.split('.')
			.reverse()
			.join('-')
	};

	// Unique list of users that have added at least one product
	let productAuthors = arrayUniqueByKey(
		data.products.map((product) => product.author),
		'id'
	);

	const dataProductsSorted = data.products
		.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
		.map((product) => {
			return {
				...product,
				images: product.images.sort(imagesSorting)
			};
		});

	// Final list of products filtered by the input from the searchbar, etc.
	$: products = applyProductFilters(dataProductsSorted, filter, searchInput);

	let product: ProductWithAuthorAndImage | undefined;

	drawer.subscribe((value) => {
		if (!value || value.type !== 'product') return;
		if (value.action === 'edit' || value.action === 'remove') {
			product = data.products
				.map((product) => ({ ...product, images: product.images }))
				.find((product) => product.id === value.id);
		}
	});
</script>

<svelte:head>
	<title>Produkty • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista produktów dostępnych w Twoje ALDO. Dodaj, edytuj lub usuń."
	/>
</svelte:head>

<section class="w-full h-full p-2 space-y-3">
	<TableHeader type="product" bind:searchInput />

	<Table
		type="products"
		productHeaders={['image', 'name', 'category', 'author', 'extra', 'action', 'description']}
		items={products}
	/>

	<Drawer>
		{#if $drawer && $drawer.type === 'product'}
			{#if $drawer.action === 'add'}
				<NewProduct />
			{:else if $drawer.action === 'edit'}
				<EditProduct bind:product />
			{:else if $drawer.action === 'filter'}
				<!-- <FilterUsers bind:filter /> -->
			{:else if $drawer.action === 'remove'}
				<!-- <FilterUsers bind:filter /> -->
				<RemoveProduct bind:product />
			{/if}
		{/if}
	</Drawer>
</section>
