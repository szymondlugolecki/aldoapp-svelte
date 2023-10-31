<script lang="ts">
	// import { page } from '$app/stores';
	import { cn } from '$lib/client/functions';
	import type { Cart } from '$types';
	import { createPopover, melt } from '@melt-ui/svelte';
	import { X } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	// export let user: SessionUser;
	export let cart: Cart | undefined;
	export let pathname: string;

	const {
		elements: { trigger, content, arrow, close },
		states: { open }
	} = createPopover({
		forceVisible: false
		// disableFocusTrap: true,
	});

	$: cartTotal = (
		cart
			? cart.products
					.map(({ price, quantity }) => [price, quantity])
					.reduce((prev, [price, quantity]) => prev + Number(price) * Number(quantity), 0)
			: 0
	).toFixed(2);

	$: productsCount = cart
		? cart.products.map(({ quantity }) => quantity).reduce((prev, quantity) => prev + quantity, 0)
		: 0;

	const productImgUrl =
		'https://res.cloudinary.com/dzcuq1b2u/image/upload/v1680687127/products/Lacto%20Start%20IPC%20pasza%20rozdojeniowa%20De%20Heus%2025kg/DB4A2X00G-W00/0.webp';
</script>

<button type="button" class="trigger" use:melt={$trigger} aria-label="Podgląd koszyka">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={cn('transition-colors square-5', pathname.startsWith('/koszyk') && 'text-blue-600')}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		><path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
		/></svg
	>
	<span class="sr-only">Pokaż koszyk</span>
	<span class="absolute top-0 right-0 bg-muted rounded-full text-xs px-1.5 py-0.5 -mt-1 -mr-1.5"
		>{productsCount <= 9 ? productsCount : '9+'}</span
	>
</button>

{#if $open}
	<div
		use:melt={$content}
		transition:fade={{ duration: 100 }}
		class="z-10 p-5 rounded-sm shadow-sm w-72"
	>
		<div use:melt={$arrow} />
		<div class="flex flex-col gap-2.5 bg-background rounded-lg p-3 border border-border">
			<p>Twój koszyk {productsCount ? `(${productsCount} szt.)` : ''}</p>

			{#if cart}
				{#each cart.products.slice(0, 7) as product}
					<div class="flex flex-grow">
						<div class="flex items-start flex-1 space-x-2">
							<a href="/sklep/{product.encodedURL}" class="flex items-center h-full">
								<img src={productImgUrl} width="32px" height="32px" alt={product.name} />
							</a>
							<div class="flex flex-col items-start">
								<span class="text-xs truncate max-w-[144px]">{product.name}</span>
								<span class="text-xs truncate max-w-[144px]">{product.price} PLN / szt.</span>
							</div>
						</div>
						<div class="">
							<span class="text-xs">{product.quantity} szt.</span>
						</div>
					</div>
				{/each}

				{#if cart.products.length > 7}
					<div class="flex flex-col items-center justify-center text-center">
						<span>...+{cart.products.length - 7} więcej 🛒</span>
					</div>
				{/if}

				{#if cart.products.length}
					<span class="text-sm">Suma: {cartTotal} PLN</span>

					<button
						use:melt={$close}
						class="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
					>
						<a href="/koszyk" class="w-full">Przejdź do koszyka</a>
					</button>
				{:else}
					<span class="text-sm">Brak produktów w koszyku</span>

					{#if pathname !== '/sklep'}
						<button
							use:melt={$close}
							class="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
						>
							<a href="/sklep" class="w-full">Przejdź do sklepu</a>
						</button>
					{/if}
				{/if}
			{:else}
				<p>Koszyk jest pusty</p>
			{/if}
		</div>
		<button class="absolute right-8 top-8" use:melt={$close}>
			<X class="square-4" />
		</button>
	</div>
{/if}

<style lang="postcss">
	.trigger {
		@apply inline-flex h-10 w-10 items-center justify-center rounded-full p-0 relative;
		@apply text-sm font-medium text-primary transition-colors hover:bg-primary/10;
		@apply focus-visible:ring focus-visible:ring-offset-2;
	}
</style>
