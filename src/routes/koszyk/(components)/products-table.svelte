<script lang="ts">
	import createLoadingToast from '$lib/client/functions/createLoadingToast.js';
	import { Minus, Plus, Trash, X } from 'lucide-svelte';
	import type { Cart } from '$types';
	import { createSelect, melt } from '@melt-ui/svelte';
	import { Skeleton } from '$shadcn/skeleton';
	import type { ProductQuantity } from '$lib/client/schemas/order';
	import type { SuperValidated } from 'sveltekit-superforms';
	import ProductQuantityForm from './product-quantity-form.svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';

	const {
		elements: { trigger, menu, option, group, groupLabel, label },
		states: { selectedLabel, open },
		helpers: { isSelected }
	} = createSelect({
		forceVisible: true,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true
		}
	});

	// export let form: SuperValidated<ProductQuantity>;
	export let products: Cart['products'];

	export let productQuantityForm: SuperForm<ProductQuantity>;
	const { enhance, delayed, formId, submitting } = productQuantityForm;

	const productImgUrl =
		'https://res.cloudinary.com/dzcuq1b2u/image/upload/v1680687127/products/Lacto%20Start%20IPC%20pasza%20rozdojeniowa%20De%20Heus%2025kg/DB4A2X00G-W00/0.webp';
</script>

<ul class="w-full divide-y">
	{#each products as product}
		{#if $delayed && $formId === product.id.toString()}
			<li class="flex p-6 gap-x-6">
				<div class="w-16 aspect-3/4">
					<Skeleton class="w-full h-full" />
				</div>
				<div class="flex flex-col flex-1 text-sm">
					<div class="flex">
						<dl class="flex justify-between flex-1 gap-y-1">
							<dt class="font-medium">
								<Skeleton class="h-4 w-[150px]" />
							</dt>
							<dd>
								<button type="submit">
									<Skeleton class="w-4 h-4 rounded-full" />
								</button>
							</dd>
						</dl>
					</div>
					<div class="flex items-end justify-between flex-1">
						<p class="font-medium">
							<Skeleton class="h-4 w-[90px]" />
						</p>
						<div>
							<Skeleton class="h-4 w-[50px]" />
						</div>
					</div>
				</div>
			</li>
		{:else}
			<li class="flex p-6 gap-x-6">
				<a href="/sklep/{product.encodedURL}">
					<div class="w-16 overflow-hidden aspect-3/4">
						<img
							src={productImgUrl}
							alt={product.name}
							class="w-full h-full object-cover object-center scale-[1.17] hover:scale-[1.19] transition-transform"
						/>
					</div>
				</a>
				<div class="flex flex-col flex-1 text-sm">
					<div class="flex">
						<dl class="flex justify-between flex-1 gap-y-1">
							<dt class="font-medium">{product.name}</dt>
							<dd class="">
								<form action="?/changeProductQuantity" method="post" use:enhance>
									<input type="hidden" name="quantity" value="0" />
									<input type="hidden" name="productId" value={product.id} />
									<button type="submit" aria-label="Usuń produkt" class="group">
										<Trash
											size={16}
											class="transition-colors text-primary/40 group-hover:text-red-400"
										/>
									</button>
								</form>
							</dd>
						</dl>
					</div>
					<div class="flex items-end justify-between flex-1">
						{#if $submitting && $formId === product.id.toString()}
							<Skeleton class="w-16 h-4" />
						{:else}
							<p class="font-medium">{(Number(product.price) * product.quantity).toFixed(2)} PLN</p>
						{/if}
						<div class="">
							<!-- <ProductQuantityForm {form} /> -->
							<form action="?/changeProductQuantity" method="post" use:enhance>
								<input type="hidden" name="productId" value={product.id} />
								<select
									aria-label="Ilość sztuk"
									name="quantity"
									class="px-1 rounded-sm bg-background"
									on:change={(e) => {
										e.currentTarget.form?.requestSubmit();
									}}
								>
									{#each { length: 9 } as _, i}
										<option value={i + 1} selected={i + 1 === product.quantity}>
											{i + 1}
										</option>
									{/each}
								</select>
							</form>
						</div>
					</div>
				</div>
			</li>
		{/if}
	{/each}
</ul>

<!-- <form action="?/changeProductQuantity" method="post" use:enhance> -->
<!-- <input type="hidden" name="productId" value={product.id} /> -->
<!-- <input type="submit" name="quantity" value="2"> -->
<!-- <input type="submit" name="quantity" value="6"> -->
<!-- </form> -->
