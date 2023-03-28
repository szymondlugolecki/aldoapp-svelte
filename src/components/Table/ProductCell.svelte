<script lang="ts">
	import { PUBLIC_WEBSITE_URL } from '$env/static/public';
	import { fodderCategories, fodderNames, producentsList, roleNames } from '$lib/client/constants';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import type { ProductRowType, ProductWithAuthorAndImage } from '$types';

	export let product: ProductWithAuthorAndImage;
	export let rowType: ProductRowType;

	let subcategory: string;

	const subcategoriesList = fodderCategories[product.category];
	if (subcategoriesList && Array.isArray(subcategoriesList)) {
		if (!subcategoriesList.length) {
			subcategory = 'Brak podkategorii';
		} else {
			subcategory =
				subcategoriesList.find((subcategory) => subcategory.id === product.subcategory)?.name ||
				'Nieprawidłowa podkategoria ❗';
		}
	}
</script>

{#if rowType === 'image'}
	<a href={`${PUBLIC_WEBSITE_URL}/sklep/${product.symbol}`}>
		<img
			class="max-h-24"
			width="96px"
			height="96px"
			src={product.images[0]}
			alt="Zdjęcie produktu"
		/>
	</a>
{:else if rowType === 'name'}
	<span class="block">{product.name}</span>
	<span class="block font-semibold">{product.symbol}</span>
{:else if rowType === 'category'}
	<div class="flex flex-col justify-center items-start space-y-1 whitespace-normal">
		<span><b>{fodderNames[product.category]}</b></span>
		<span>{subcategory}</span>
	</div>
{:else if rowType === 'extra'}
	<div class="flex flex-col justify-center items-start space-y-1">
		<span>Cena: <b>{product.price}</b> PLN</span>
		<span>Waga: <b>{product.weight}</b> kg</span>
		<span>Producent: <b>{producentsList[product.producent]}</b></span>
	</div>
{:else if rowType === 'description'}
	<span class="whitespace-normal"
		>{product.description ? product.description.slice(0, 60) : 'Brak opisu...'}</span
	>
{:else if rowType === 'author'}
	<div class="flex flex-col justify-center items-start">
		<span
			class="badge badge-sm {product.author.role === 'admin'
				? 'badge-error'
				: product.author.role === 'moderator'
				? 'badge-success'
				: 'badge-info'}">{roleNames[product.author.role]}</span
		>
		<div class="flex justify-start items-center">
			<div class="tooltip mt-2" data-tip={product.author.email}>
				<span>{product.author.fullName}</span>
			</div>
		</div>

		<div
			class="tooltip mt-2"
			data-tip={product.createdAt.toLocaleDateString('pl-PL', {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			}) + ` ⌚`}
		>
			<span
				>📅 {product.createdAt.toLocaleDateString('pl-PL', {
					month: 'short',
					day: 'numeric',
					year: 'numeric'
				})}</span
			>
		</div>
	</div>
{:else if rowType === 'action'}
	<div class="flex space-y-3 flex-col justify-center items-start">
		<button type="button" class="font-medium text-blue-400 hover:text-blue-500 duration-200"
			>Edytuj</button
		>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<label
			for="admin-drawer"
			on:click={() => {
				// console.log(product.symbol);
				drawer.set({
					open: true,
					id: product.id,
					type: 'product',
					action: 'remove'
				});
			}}
			class="cursor-pointer font-medium text-red-400 hover:text-red-500 duration-200">Usuń</label
		>
	</div>
{/if}
