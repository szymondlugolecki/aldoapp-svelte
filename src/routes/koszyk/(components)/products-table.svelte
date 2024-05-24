<script lang="ts">
	import { X } from 'lucide-svelte';
	import { createSelect, melt } from '@melt-ui/svelte';
	import { Skeleton } from '$shadcn/skeleton';
	import type { ProductQuantity } from '$lib/client/schemas/order';

	import type { Infer, SuperForm } from 'sveltekit-superforms/client';
	import Button from '$components/ui/button/button.svelte';
	import { Input } from '$shadcn/input';
	import { toast } from 'svelte-sonner';

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

	type PageServerParentData = import('../$types').PageServerParentData;

	// export let form: SuperValidated<ProductQuantity>;
	export let products: NonNullable<PageServerParentData['cart']>['products'];

	export let productQuantityForm: SuperForm<Infer<ProductQuantity>>;
	const { enhance, delayed, formId, submitting, errors, form } = productQuantityForm;

	errors.subscribe((e) => {
		console.log('e', e._errors, e.quantity);
		const errorList = Object.values(e)
			.flatMap((x) => x)
			.filter((v) => v);
		const currentError = errorList[0];
		if (currentError) {
			toast.error(currentError, {
				duration: 3500
			});
		}
	});
</script>

<ul class="w-full divide-y">
	{#each products as product}
		{#if $delayed && $formId === product.id.toString()}
			<li class="flex p-6 gap-x-6">
				<div class="w-16 aspect-2/3">
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
					<div class="w-16 overflow-hidden aspect-2/3">
						<img
							src={product.image}
							alt={product.name}
							class="object-cover object-center w-full h-full transition-transform rounded-md"
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
									<Button
										type="submit"
										size="icon"
										variant="ghost"
										aria-label="Usuń produkt"
										class="group square-8"
									>
										<X
											size={16}
											class="transition-colors text-primary/40 group-hover:text-red-400"
										/>
									</Button>
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
							<form
								action="?/changeProductQuantity"
								method="post"
								use:enhance
								class="flex flex-col items-end"
							>
								<input
									type="hidden"
									name="productId"
									value={product.id}
									aria-invalid={$errors.productId ? 'true' : undefined}
								/>
								{#if $errors.productId}<span class="invalid">{$errors.productId}</span>{/if}
								<Input
									type="number"
									step={1}
									min={1}
									max={50}
									placeholder={product.quantity.toString()}
									name="quantity"
									class="max-w-[58px]"
									value={product.quantity}
									on:change={(e) => {
										console.log(e.currentTarget.value);
										if (!e.currentTarget.value) {
											return;
										}
										e.currentTarget.form?.requestSubmit();
									}}
									aria-label="Ilość sztuk"
									aria-invalid={$errors.quantity ? 'true' : undefined}
								/>
								{#if $errors.quantity}<span class="invalid">{$errors.quantity}</span>{/if}
								<!-- <select
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
								</select> -->
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
