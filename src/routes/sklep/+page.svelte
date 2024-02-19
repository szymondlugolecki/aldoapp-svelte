<script lang="ts">
	import * as Card from '$shadcn/card';
	import { Button } from '$shadcn/button/index.js';
	import { page } from '$app/stores';
	// import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast.js';
	import { handleFormResponse } from '$lib/client/functions/forms.js';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';

	export let data;

	const { form, enhance } = superForm(data.form, {
		onUpdated: ({ form }) => {
			const errors = form.errors._errors;
			if (form.message) {
				toast.success('Sukces', {
					description: form.message
				});
			} else if (errors) {
				errors.forEach((error) => {
					toast('Niepowodzenie', {
						description: error
					});
				});
			}
		}
	});

	// $: fakeProducts = [].concat(...Array(4).fill(data.products)) as typeof data.products;
</script>

<div class="grid gap-3 sm:gap-10 grid-cols-[repeat(auto-fit,minmax(170px,1fr))] sm:grid-cols-3">
	{#each data.products as product}
		{@const isInCart = data.cart?.products.find((p) => p.id === product.id)}
		<Card.Root class="flex flex-col">
			<Card.Header class="h-[110px]">
				<Card.Title>
					<a href={`/sklep/${product.encodedURL}`}>
						{product.name}
					</a>
				</Card.Title>

				<Card.Description>{product.price.toFixed(2)} zł</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="overflow-hidden rounded-md">
					<a href={`/sklep/${product.encodedURL}`}>
						<img
							src={product.image}
							alt="Zdjęcie produktu"
							class="scale-[1] object-cover hover:scale-[1.025] duration-150 max-h-[552px]"
						/>
					</a>
				</div>
			</Card.Content>
			<Card.Footer class="self-end justify-end mt-auto">
				{#if $page.data.user}
					<form method="post" action="?/changeProductQuantity" use:enhance>
						<input type="hidden" name="productId" value={product.id} />
						<input type="hidden" name="quantity" value="1" />
						<input type="hidden" name="add" value="true" />
						{#if isInCart}
							<Button class="p-2 xxs:py-2 xxs:px-4" disabled>W koszyku</Button>
						{:else}
							<Button class="p-2 xxs:py-2 xxs:px-4" variant="default" type="submit"
								>Dodaj do koszyka</Button
							>
						{/if}
					</form>
				{:else}
					<Button class="p-0 xxs:py-2 xxs:px-4" variant="default" disabled
						>Musisz się zalogować</Button
					>
				{/if}
			</Card.Footer>
		</Card.Root>
	{/each}
</div>
