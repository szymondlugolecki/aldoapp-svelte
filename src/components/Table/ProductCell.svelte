<script lang="ts">
	import { PUBLIC_WEBSITE_URL } from '$env/static/public';
	import type { ProductRowType, ProductWithAuthorAndImage } from '$types';

	export let openEditDrawer: ((id: string) => void) | undefined = undefined;
	export let openRemoveDrawer: ((id: string) => void) | undefined = undefined;
	export let product: ProductWithAuthorAndImage;
	export let rowType: ProductRowType;
</script>

{#if rowType === 'image'}
	<a href={`${PUBLIC_WEBSITE_URL}/sklep/${product.symbol}`}>
		<img width="96px" height="96px" src={product.images[0].url} alt="Zdjęcie produktu" />
	</a>
{:else if rowType === 'name'}
	<span class="block">{product.name}</span>
	<span class="block font-semibold">{product.symbol}</span>
{:else if rowType === 'description'}
	{product.description}
{:else if rowType === 'author'}
	<div>
		<span class="block">{product.author.fullName}</span>
		<br />
		<span class="block">{product.author.email}</span>
		<br />
		<span class="badge badge-ghost badge-sm">{product.author.role}</span>
	</div>
{:else if rowType === 'action'}
	<div class="flex space-y-3 flex-col justify-center items-start">
		<button
			on:click={() => openEditDrawer && openEditDrawer(product.id)}
			type="button"
			class="font-medium text-blue-400 hover:text-blue-500 duration-200">Edytuj</button
		>
		<button
			on:click={() => openRemoveDrawer && openRemoveDrawer(product.id)}
			type="button"
			class="font-medium text-red-400 hover:text-red-500 duration-200">Usuń</button
		>
	</div>
{:else if rowType === 'addedAt'}
	<div class="text-sm text-gray-500" title={new Date(product.createdAt).toLocaleString()}>
		{new Date(product.createdAt).toLocaleDateString()}
	</div>
{/if}
