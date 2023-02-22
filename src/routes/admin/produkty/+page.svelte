<script lang="ts">
	import { Table, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { Edit, Trash } from 'lucide-svelte';
	import NewProductModal from '$components/Modals/NewProductModal.svelte';
	import EditProductModal from '$components/Modals/EditProductModal.svelte';
	import ProductFilterModal from '$components/Modals/ProductFilterModal.svelte';
	import TableHeader from '$components/ProductTableHeader.svelte';

	import { applyProductFilters, textCrusher } from '$lib/client/functions';
	import type { ProductFilter } from '$types';
	import { PUBLIC_WEBSITE_URL } from '$env/static/public';

	let searchInput: string;

	let filter: ProductFilter = {
		author: '',
		since: null,
		until: new Date(new Date().setHours(23, 59, 59, 999))
			.toLocaleDateString()
			.split('.')
			.reverse()
			.join('-')
	};

	$: filteredProducts = applyProductFilters(
		data.products.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
		filter
	);
	$: productsList = searchInput
		? filteredProducts.filter(
				(product) =>
					textCrusher(product.name).includes(textCrusher(searchInput)) ||
					textCrusher(product.description).includes(textCrusher(searchInput)) ||
					textCrusher(product.symbol).includes(textCrusher(searchInput))
		  )
		: filteredProducts;

	let newProductModalOpen = false;
	let editProductModalOpen = false;
	let filterProductModalOpen = false;

	let editModalProductId: string;

	const openEditModal = (id: string) => {
		editModalProductId = id;
		editProductModalOpen = true;
	};

	$: editProductModal = productsList.find((product) => product.id === editModalProductId);

	export let data: import('./$types').PageData;
</script>

<section class="w-full h-full p-2 space-y-3">
	<TableHeader bind:searchInput bind:newProductModalOpen bind:filterProductModalOpen />
	<NewProductModal bind:newProductModalOpen />
	<EditProductModal bind:editProductModalOpen bind:editProductModal />
	<ProductFilterModal bind:filter bind:filterProductModalOpen />

	<Table>
		<TableHead>
			<TableHeadCell>Zdjęcie</TableHeadCell>
			<TableHeadCell>Nazwa i symbol</TableHeadCell>
			<TableHeadCell>Opis</TableHeadCell>
			<TableHeadCell>Dodał(a)</TableHeadCell>
			<TableHeadCell>Akcja</TableHeadCell>
			<TableHeadCell>Dodano</TableHeadCell>
		</TableHead>
		<tbody class="divide-y">
			{#each productsList as product}
				<TableBodyRow>
					<TableBodyCell>
						<a href={`${PUBLIC_WEBSITE_URL}/sklep/${product.symbol}`}>
							<img
								width="96px"
								height="96px"
								src={`${PUBLIC_WEBSITE_URL}/products/${product.thumbnail}`}
								alt="Zdjęcie produktu"
							/>
						</a>
					</TableBodyCell>
					<TableBodyCell>
						<span class="block">{product.name}</span>
						<span class="block font-semibold">{product.symbol}</span>
					</TableBodyCell>

					<TableBodyCell>
						<span>{product.description}</span>
					</TableBodyCell>
					<TableBodyCell>
						<span class="block">{product.author.fullName}</span>
						<span class="block">{product.author.email}</span>
					</TableBodyCell>
					<TableBodyCell>
						<div class="flex space-y-3 flex-col justify-center items-start">
							<button
								on:click={() => openEditModal(product.id)}
								type="button"
								class="font-medium text-blue-400 hover:text-blue-500 duration-200"
								><Edit class="mr-2" /> Edytuj</button
							>
							<button
								on:click={() => openEditModal(product.id)}
								type="button"
								class="font-medium text-red-400 hover:text-red-500 duration-200"
								><Trash class="mr-2" /> Usuń</button
							>
						</div>
					</TableBodyCell>
					<TableBodyCell>
						<div class="relative">
							<span class="peer">
								{product.createdAt.toLocaleDateString('pl-PL', {
									month: 'short',
									day: 'numeric',
									year: 'numeric'
								})}
							</span>
							<div
								role="tooltip"
								class="top-[-40px] left-[-40px] invisible peer-hover:visible inline-block absolute z-50 px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700"
							>
								{product.createdAt.toLocaleDateString('pl-PL', {
									month: 'long',
									day: 'numeric',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									second: '2-digit'
								})}
								<div class="tooltip-arrow" />
							</div>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</tbody>
	</Table>
	{#if productsList.length === 0}
		<div class="w-full h-20 flex justify-center items-center text-center">
			<span class="text-3xl">Brak wyników... 🧐</span>
		</div>
	{/if}
</section>
