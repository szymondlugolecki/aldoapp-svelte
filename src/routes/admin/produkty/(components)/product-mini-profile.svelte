<script lang="ts">
	import { parsePLN } from '$lib/client/functions';
	import type { Product } from '$types';
	import type { CellContext } from '@tanstack/svelte-table';

	export let info: CellContext<Product, unknown>;

	const product = info.table.options.data.find(
		(u) => u.id === info.row._getAllCellsByColumnId().id.getValue()
	) as Product;

	const { id, name, symbol, price, encodedURL, image } = product;
</script>

<div class="flex items-center gap-x-3">
	<div class="w-16 overflow-hidden rounded-lg">
		<a class="underline" href="/sklep/{encodedURL}"><img src={image} alt="Brak zdjęcia" /> </a>
	</div>
	<div>
		<p>{name}</p>
		<p>{symbol}</p>
		<p>{parsePLN(price)}</p>
	</div>
</div>
