<script lang="ts">
	import { page } from '$app/stores';
	import { fodderCategories2, fodderNames, producentsList } from '$lib/client/constants';
	import * as Alert from '$shadcn/alert';
	// import AlertTitle from '$shadcn/alert/AlertTitle.svelte';
	// import AlertDescription from '$shadcn/alert/AlertDescription.svelte';
	import { Button } from '$shadcn/button';
	import { Separator } from '$shadcn/separator';
	import {
		CornerDownLeft,
		Heart,
		Package,
		PlusCircle,
		ScanBarcode,
		ShoppingBag,
		ShoppingCart
	} from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import type { Subcategory } from '$types';
	import { newCategoryUrl, newSubcategoryUrl, parsePLN } from '$lib/client/functions/index.js';
	import { handleFormResponse } from '$lib/client/functions/forms.js';
	import createLoadingToast from '$lib/client/functions/createLoadingToast.js';
	import { slide } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import { Reload } from 'radix-icons-svelte';
	import ErrorMessage from '$components/custom/Form/ErrorMessage.svelte';
	import Message from '$components/custom/Form/Message.svelte';

	export let data;
	const { enhance, message, errors, delayed, timeout } = superForm(data.addProductForm, {
		delayMs: 1000,
		timeoutMs: 10000
	});

	let selectedImagePreview = 0;
</script>

<section class="max-w-2xl px-4 pt-4 mx-auto lg:max-w-6xl sm:px-0 pb-14">
	<div class="grid lg:grid-cols-2 lg:gap-x-8 gap-y-4 lg:items-start">
		<!-- Images -->
		<div class="max-w-md overflow-hidden rounded-md aspect-3/4">
			<a href="/sklep/{data.product.encodedURL}">
				<div class="">
					<img src={data.product.image} alt={data.product.name} />
				</div>
			</a>
		</div>

		<div class="grid gap-y-3">
			<div class="">
				<div class="">
					<h1 class="text-3xl font-bold tracking-tight scroll-m-20">
						{data.product.name}
					</h1>
				</div>

				<h2 class="text-3xl tracking-tight">{parsePLN(data.product.price)}</h2>
			</div>

			<div>
				<span
					class="inline-flex items-center px-2 py-1 my-3 text-xs font-medium text-blue-700 rounded-md bg-blue-50 ring-1 ring-inset ring-blue-600/20"
					>{fodderNames[data.product.category]}</span
				>
			</div>

			<p class="">
				{data.product.description || 'Brak opisu'}
			</p>

			<div class="w-full border-t border-border" />

			<dl class="grid gap-y-2">
				<div class="flex items-center justify-between">
					<dt class="text-base">Waga</dt>
					<dd class="text-base">{data.product.weight} kg</dd>
				</div>
				<div class="flex items-center justify-between">
					<dt class="text-base">Producent</dt>
					<dd class="text-base">{producentsList[data.product.producent]}</dd>
				</div>
				<div class="flex items-center justify-between">
					<dt class="text-base">Kod produktu</dt>
					<dd class="text-base">{data.product.symbol}</dd>
				</div>
			</dl>

			<div>
				<div class="flex flex-col w-full mt-6 gap-y-2">
					{#if $page.data.user}
						<div class="flex items-center gap-x-6">
							<form
								class="flex items-center w-full max-w-xs gap-x-6"
								method="post"
								action="?/changeProductQuantity"
								use:enhance
							>
								<input type="hidden" name="quantity" value={1} />
								<input type="hidden" name="productId" value={data.product.id} />

								<!-- Already in cart -->
								{#if data.cart?.products.some((p) => p.id === data.product.id)}
									<Button disabled class="w-full">W koszyku</Button>
								{:else}
									{#if $delayed}
										<Button disabled class="w-full">
											<Reload class="w-4 h-4 mr-2 animate-spin" />
											Proszę czekać
										</Button>
									{/if}
									<Button
										class="w-full p-2 text-lg font-semibold text-white transition-colors rounded-sm bg-cyan-600 hover:bg-cyan-700/80"
										type="submit">Dodaj do koszyka <ShoppingBag class="w-5 h-5 ml-2" /></Button
									>
								{/if}
							</form>

							<!-- <form method="post" action="?/favorite" use:enhance>
								<input type="hidden" name="productId" value={data.product.id} />
								<button type="submit" class="transition-colors text-muted hover:text-red-600"
									><Heart size={28} strokeWidth={2} /></button
								>
							</form> -->
						</div>
					{:else}
						<Alert.Root variant="default">
							<Alert.Title>Zaloguj się</Alert.Title>
							<Alert.Description>
								Musisz być zalogowany, żeby dodać produkt do koszyka.
							</Alert.Description>
						</Alert.Root>
					{/if}
				</div>

				{#if $message}
					<Message message={$message} />
				{/if}
				{#if $timeout}
					<ErrorMessage errors={['Brak odpowiedzi serwera']} />
				{/if}
				{#if $errors.quantity || $errors.productId}
					<ErrorMessage errors={$errors.quantity} />
					<ErrorMessage errors={$errors.productId} />
				{/if}

				<div class="divider" />

				<ul>
					<li class="flex items-center text-sm font-medium text-left text-gray-600">
						<Package class="mr-2" />
						Darmowa dostawa
					</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- Left Side Images -->
<!-- <div class="mt-2 lg:order-1 lg:flex-shrink-0">
							<div
								class="flex flex-row items-start w-full mb-3 space-x-4 lg:flex-col lg:space-x-0 lg:space-y-4"
							>
								{#each data.product.images.slice(0, 4) as image}
									<button
										type="button"
										class:outline={selectedImagePreview === data.product.images.indexOf(image)}
										class:outline-2={selectedImagePreview === data.product.images.indexOf(image)}
										class="h-20 overflow-hidden text-center rounded-lg flex-0 aspect-square outline outline-offset-2 outline-base-content"
										on:click={() => (selectedImagePreview = data.product.images.indexOf(image))}
									>
										<img
											class="object-cover w-full h-full"
											src={image && image.url}
											alt={data.product.name}
										/>
									</button>
								{/each}
							</div>
						</div> -->
