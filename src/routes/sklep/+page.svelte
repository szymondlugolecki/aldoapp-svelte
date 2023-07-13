<script lang="ts">
	import { fodderCategories, fodderCategories2, fodderNames } from '$lib/client/constants';
	import { textCrusher } from '$lib/client/functions';
	import { imagesSorting } from '$lib/client/functions/sorting';
	import type { CategoryChoice } from '$lib/client/stores/shopCategories';
	import type { Category, StoreProduct, Subcategory } from '$types';
	import { Component, List, Search, X } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$shadcn/card';

	import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '$shadcn/tooltip';

	import { Button } from '$shadcn/button/index.js';
	import CategoryIcon from '$components/CategoryIcon.svelte';
	import type { MainCategory } from '$lib/client/constants/dbTypes.js';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast.js';
	import { handleFormResponse } from '$lib/client/functions/forms.js';

	export let data;

	let searchInput = '';

	const categoryFilter = (selectedCategories: CategoryChoice, product: StoreProduct) => {
		// no category selected
		if (!selectedCategories.main) {
			return true;
		}

		function isValidCategory(mainCategory: string | Category | null): mainCategory is Category {
			if (!mainCategory) return false;
			return mainCategory in fodderCategories;
		}

		function isValidSubcategory(
			subcategory: string | Subcategory | null
		): subcategory is Subcategory {
			if (!subcategory) return false;
			return Object.values(fodderCategories)
				.map((sub) => sub.map((sub) => sub.id))
				.flat()
				.includes(subcategory as Subcategory);
		}

		// weird but ok, will just show everything
		if (!isValidCategory(selectedCategories.main)) {
			return true;
		}

		// if subcategory is empty
		if (selectedCategories.sub === null) {
			// check if there's no subcategories under this category, if so its ok 👍
			if (!fodderCategories[selectedCategories.main].length) {
				if (product.category === selectedCategories.main) {
					return true;
				}

				return false;
			}

			// else its weird and we should return false
			return false;
		}

		// if subcategory is invalid
		if (!isValidSubcategory(selectedCategories.sub)) {
			return false;
		}

		// Valid categories and the product is in both of them
		if (
			product.category === selectedCategories.main &&
			product.subcategory === selectedCategories.sub
		) {
			return true;
		}

		return false;
	};

	// $: productsFiltered = data.products
	// .map((product) => ({
	// 	...product,
	// 	images: product.images.sort(imagesSorting)
	// }))
	// .filter((product) => {
	// 	if (!searchInput.length) return true;

	// 	const searchInputFormatted = textCrusher(searchInput);
	// 	return (
	// 		textCrusher(product.name).includes(searchInputFormatted) ||
	// 		textCrusher(product.symbol).includes(searchInputFormatted) ||
	// 		textCrusher(product.description || '').includes(searchInputFormatted) ||
	// 		textCrusher(product.producent).includes(searchInputFormatted)
	// 	);
	// })
	// .filter((product) => categoryFilter($selectedCategories, product));
	// Sort the images by their index

	$: fakeProducts = [].concat(...Array(4).fill(data.products)) as typeof data.products;

	// $: console.log(data.products);
	const productImgUrl =
		'https://res.cloudinary.com/dzcuq1b2u/image/upload/v1680687127/products/Lacto%20Start%20IPC%20pasza%20rozdojeniowa%20De%20Heus%2025kg/DB4A2X00G-W00/0.webp';

	$: selectedCategoryName = Object.fromEntries(
		Object.values(fodderCategories2).flatMap((x) => Object.entries(x))
	) as Record<Subcategory, string>;

	$: selectedCategory = $page.url.searchParams.get('kategoria') as MainCategory | null;
	$: selectedSubcategory = $page.url.searchParams.get('podkategoria') as Subcategory | null;
</script>

<svelte:head>
	<title>Sklep • Twoje ALDO</title>
	<meta
		name="description"
		content="Sklep internetowy. Znajdź produkty, które Cię interesują. Zamów online."
	/>
</svelte:head>

<div class="py-2 px-1 mb-3">
	<div class="flex justify-between items-center px-1 pb-2.5">
		<h1 class="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
			{#if selectedSubcategory}
				{selectedCategoryName[selectedSubcategory]}
			{:else if selectedCategory}
				{fodderNames[selectedCategory]}
			{:else}
				Wszystkie produkty
			{/if}
		</h1>
	</div>

	<div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-10">
		{#each fakeProducts as product}
			<Card>
				<CardHeader class="h-[110px]">
					<CardTitle>
						<a href={`/sklep/${product.encodedURL}`}>
							{product.name}
						</a>
					</CardTitle>

					<CardDescription>{product.price} zł</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="overflow-hidden rounded-md">
						<a href={`/sklep/${product.encodedURL}`}>
							<img
								src={productImgUrl}
								alt="Zdjęcie produktu"
								class="scale-[1.1] object-cover hover:scale-[1.15] duration-150"
							/>
						</a>
					</div>
				</CardContent>
				<CardFooter class="justify-end xl:justify-between">
					<div class="items-center space-x-2 hidden xl:flex">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Button variant="ghost" class="w-10 rounded-full p-0">
										<CategoryIcon category={product.category} />
										<span class="sr-only">{fodderNames[product.category]}</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>{fodderNames[product.category]}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<form
						method="post"
						action="?/addToCart"
						use:enhance={({ formData }) => {
							const toastId = createLoadingToast('please-wait');

							formData.append('productId', product.id.toString());

							return async ({ result, update }) => {
								handleFormResponse(result, toastId, 'Pomyślnie dodano produkt do koszyka');
								update();
							};
						}}
					>
						<Button class="p-0 xxs:py-2 xxs:px-4" variant="default" type="submit"
							>Dodaj do koszyka</Button
						>
					</form>
				</CardFooter>
			</Card>
			<!-- <div
				class="flex flex-col justify-between max-w-[300px] w-full border border-base-content border-opacity-10 p-1 xxs:p-2 sm:p-3 pt-4 group/product duration-100 rounded-md outline-primary outline-offset-2"
			>
				<a
					class="flex flex-col justify-start items-center text-xs xxs:text-sm sm:text-base p-2"
					href={`/sklep/${product.encodedURL}`}
				>
					<img
						class="group-hover/product:opacity-90"
						src={product.images[0] && product.images[0].url}
						alt={product.name}
						width="160px"
						height="160px"
					/>
					<div class="flex flex-col items-start pt-2 w-full space-y-2">
											>{producentsList[product.producent]}</span
						<span class="font-semibold">{product.name}</span>
						<span>{product.price} zł</span>
					</div>
				</a>
				<div class="flex justify-end items-center w-full pt-2">
					<button
						class="btn btn-secondary btn-sm text-xs sm:text-sm flex-1 xs:flex-initial"
						on:click={() => addProductToCart(product)}>Do koszyka</button
					>
				</div>
			</div> -->
		{/each}
	</div>
</div>
{#if !data.products.length}
	<div class="flex flex-col justify-center items-center pb-3 mb-3" in:slide={{ axis: 'y' }}>
		<h2 class="text-2xl text-center">🤔 Brak wyników...</h2>
		<h3 class="text-lg text-center">Spróbuj wybrać inną kategorię</h3>
	</div>
{/if}
