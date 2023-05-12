<script lang="ts">
	import { drawer } from '$lib/client/stores/adminDrawer';
	import type { Order, ProductWithAuthorAndImage } from '$types';
	import ModalHeader from './ModalHeader.svelte';

	export let order: Order | undefined = undefined;
	export let product: ProductWithAuthorAndImage | undefined = undefined;

	let key: keyof Order | keyof ProductWithAuthorAndImage | undefined = undefined;

	$: if (order) {
		if ($drawer?.action === 'preview' && $drawer?.type === 'order') {
			key = $drawer.key as keyof Order;
		}
	} else if (product) {
		if ($drawer?.action === 'preview' && $drawer?.type === 'product') {
			key = $drawer.key as keyof ProductWithAuthorAndImage;
		}
	}
</script>

<div class="flex flex-col space-y-6">
	<ModalHeader title="Podgląd" />

	{#if order}
		{#if key === 'productIds'}
			<span>Tu będzie lista produktów</span>
		{/if}
	{/if}
</div>
