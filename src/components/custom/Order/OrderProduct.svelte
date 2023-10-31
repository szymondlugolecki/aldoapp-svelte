<script lang="ts">
	import type { OrderTable } from '$types';

	export let product: OrderTable['products'][number];

	const productImgUrl =
		'https://res.cloudinary.com/dzcuq1b2u/image/upload/v1680687127/products/Lacto%20Start%20IPC%20pasza%20rozdojeniowa%20De%20Heus%2025kg/DB4A2X00G-W00/0.webp';
</script>

<div class="flex p-4 gap-x-8 [&:not(:last-child)]:border-b border-border gap-12 min-w-[572px]">
	<a href="/sklep/{product.encodedURL}">
		<div class="overflow-hidden rounded-sm square-40">
			<img
				src={productImgUrl}
				alt={product.name}
				class="object-cover object-center w-full h-full"
			/>
		</div>
	</a>
	<div class="w-60">
		<h3 class="font-medium">{product.name}</h3>
		<p class="mt-2 text-sm font-medium">{product.price} PLN</p>
		<p class="mt-3 text-sm">{product.description || ''}</p>
	</div>
	<div class="w-20">
		<p class="text-sm font-medium">Ilość</p>
		<p class="mt-2 text-sm">{product.quantity} szt.</p>
	</div>
</div>
