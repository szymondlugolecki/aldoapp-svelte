<script lang="ts">
	import type { ProductShowcaseReady } from '$routes/+page.server';
	import * as Carousel from '$shadcn/carousel';

	export let products: ProductShowcaseReady[];
	export let title: string;
</script>

<div class="flex justify-center px-4 py-12 pt-24 sm:pt-32 sm:px-8">
	<div class="flex flex-col w-full max-w-7xl gap-y-8 px-[48px]">
		<span class="text-xl font-medium">{title}</span>

		<Carousel.Root>
			<Carousel.Content>
				{#each products as product, i}
					<Carousel.Item class="basis-full min-[500px]:basis-1/2 md:basis-1/3">
						<a href="/sklep/{product.encodedURL}" class="select-none">
							<div class="flex flex-col gap-y-1">
								<div class="overflow-hidden rounded-lg aspect-3/4">
									<img
										src={product.image}
										alt={product.name}
										class="w-full h-full object-cover object-center hover:scale-[1.025] transition-transform"
									/>
								</div>
								<div class="font-medium tracking-tight text-left break-words">
									{product.name}
								</div>
							</div>
						</a>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</div>
</div>
