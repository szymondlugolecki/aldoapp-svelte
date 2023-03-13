<script lang="ts">
	import RemoveProductModal from '$components/Modals/Product/RemoveProductModal.svelte';
	import EditProductModal from '$components/Modals/Product/EditProduct.svelte';
	import ProductFilterModal from '$components/Modals/Product/ProductFilterModal.svelte';
	import TableHeader from '$components/Table/TableHeader.svelte';
	import Drawer from '$components/AdminDrawer.svelte';

	import { applyProductFilters, arrayUniqueByKey } from '$lib/client/functions';
	import type { ProductFilter } from '$types';
	import { PUBLIC_WEBSITE_URL } from '$env/static/public';
	import Table from '$components/Table/Table.svelte';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import NewProduct from '$components/Modals/Product/NewProduct.svelte';
	import EditProduct from '$components/Modals/Product/EditProduct.svelte';

	export let data;

	let searchInput = '';
	let authorFilterSearchInput = '';

	let newProductModalOpen = false;
	let editProductModalOpen = false;
	let filterProductModalOpen = false;
	let removeProductModalOpen = false;

	let editModalProductId: string;
	let removeModalProductId: string;

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

	const openEditModal = (id: string) => {
		editModalProductId = id;
		editProductModalOpen = true;
	};

	const openRemoveModal = (id: string) => {
		removeModalProductId = id;
		removeProductModalOpen = true;
	};

	// Final list of products filtered by the input from the searchbar, etc.
	$: products = applyProductFilters(
		data.products.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
		filter,
		searchInput
	);

	$: editProductModal = products.find((product) => product.id === editModalProductId);
	$: removeProductModal = products.find((product) => product.id === removeModalProductId);

	const getProductFromDrawer = () => {
		const drawerS = $drawer;
		if (
			drawerS &&
			(drawerS.action === 'edit' || drawerS.action === 'remove') &&
			drawerS.type === 'product'
		) {
			const user = data.products.find((user) => user.id === drawerS.id);
			return user;
		}
	};
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
		productHeaders={['image', 'name', 'description', 'author', 'action', 'addedAt']}
		items={products}
	/>

	<Drawer>
		{#if $drawer && $drawer.type === 'product'}
			{#if $drawer.action === 'add'}
				<NewProduct />
			{:else if $drawer.action === 'edit'}
				<EditProduct product={getProductFromDrawer()} />
			{:else if $drawer.action === 'filter'}
				<!-- <FilterUsers bind:filter /> -->
			{/if}
		{/if}
	</Drawer>
</section>
