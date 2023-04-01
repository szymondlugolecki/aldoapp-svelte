<script lang="ts">
	import { fodderCategories, fodderNames, producentsList } from '$lib/client/constants';
	import { textCrusher } from '$lib/client/functions';
	import { imagesSorting } from '$lib/client/functions/sorting';
	import { addProduct } from '$lib/client/stores/cart';
	import type { Category, StoreProduct, Subcategory } from '$types';
	import { ChevronUp, CornerUpLeft, List, Search, X } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	export let data;

	function isProperCategory(category: string): category is Category {
		return category in fodderCategories;
	}

	type CategoryChoice = { main: Category | string | null; sub: string | null };

	// the reason why main is both Category and string is because
	// types seem to not work in the markup 🤔
	let selectedCategories: CategoryChoice = {
		main: null,
		sub: null
	};

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

	$: productsFiltered = data.products
		.map((product) => ({
			...product,
			images: product.images.sort(imagesSorting)
		}))
		.filter((product) => {
			if (!searchInput.length) return true;

			const searchInputFormatted = textCrusher(searchInput);
			return (
				textCrusher(product.name).includes(searchInputFormatted) ||
				textCrusher(product.symbol).includes(searchInputFormatted) ||
				textCrusher(product.description || '').includes(searchInputFormatted) ||
				textCrusher(product.producent).includes(searchInputFormatted)
			);
		})
		.filter((product) => categoryFilter(selectedCategories, product));
	// Sort the images by their index

	let productsFilterDrawer: HTMLInputElement;

	$: console.log(productsFiltered);
</script>

<svelte:head>
	<title>Sklep • Twoje ALDO</title>
	<meta
		name="description"
		content="Sklep internetowy. Znajdź produkty, które Cię interesują. Zamów online."
	/>
</svelte:head>

<section class="w-full flex flex-col">
	<div class="drawer drawer-mobile flex-1">
		<input
			id="categories-drawer"
			type="checkbox"
			class="drawer-toggle"
			bind:this={productsFilterDrawer}
		/>
		<div class="drawer-content">
			<!-- Page content here -->
			<div class="w-full h-full sm:px-4">
				<div class="w-full flex items-center py-1 sticky top-0 bg-base-100 z-20 h-fit">
					<div
						class="flex-1 flex items-center pl-2 rounded-lg border border-transparent focus-within:border-primary duration-200 group w-full"
					>
						<Search class="group-focus-within:text-primary mr-2" size={24} />
						<input
							bind:value={searchInput}
							type="text"
							class="border-none rounded-r-lg outline-none focus:outline-none focus:ring-0 py-2 bg-base-100 w-full"
							placeholder="Szukaj produktów..."
						/>
					</div>
					<!-- <label for="categories-drawer" class="btn btn-primary drawer-button">Open drawer</label> -->
				</div>
				<div class="py-2 px-1 mb-3">
					<div class="flex justify-between items-center px-1 pb-2.5">
						<h1 class="text-xl xs:text-2xl">Lista produktów</h1>

						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<label
							id="filterDropdownButton"
							tabindex="0"
							for="categories-drawer"
							class="inline-flex justify-center md:hidden btn btn-accent text-accent-content btn-xs h-7 xxs:h-[40px] w-full flex-1 sm:text-sm px-0 max-w-[125px] xs:max-w-[140px]"
							on:keypress={(event) => {
								if (event.key === 'Enter') {
									event.currentTarget.click();
								}
							}}
							><List class="mr-1 sm:mr-2 w-5 h-5" />
							<span>Kategorie</span>
						</label>
					</div>

					<div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-10">
						{#each productsFiltered as product}
							<div
								class="flex flex-col justify-between max-w-[300px] w-full shadow-sm sm:shadow-md shadow-base-content border border-base-content border-opacity-10 p-1 xxs:p-2 sm:p-3 pt-4 group/product duration-100 rounded-md outline-primary outline-offset-2"
							>
								<a
									class="flex flex-col justify-start items-center text-xs xxs:text-sm sm:text-base p-2"
									href={`/sklep/${product.encodedURL}`}
								>
									<img
										class="group-hover/product:opacity-90"
										src={product.images[0]}
										alt={product.name}
										width="160px"
										height="160px"
									/>
									<div class="flex flex-col items-start pt-2 w-full space-y-2">
										<span class="text-red-500 text-sm font-semibold whitespace-normal"
											>{producentsList[product.producent]}</span
										>
										<span class="font-semibold">{product.name}</span>
										<span>{product.price} zł / szt.</span>
									</div>
								</a>
								<div class="flex justify-end items-center w-full pt-2">
									<button
										class="btn btn-secondary btn-sm text-xs sm:text-sm flex-1 xs:flex-initial"
										on:click={() => addProduct(product)}>Do koszyka</button
									>
								</div>
							</div>
						{/each}

						<!-- {#await data.lazy.products}
							<h1>Wczytywanie reszty produktów...</h1>
						{:then products}
							{#each products as product}
								<a
									class="flex flex-col justify-center max-w-[300px] hover:opacity-90 duration-100 outline-primary rounded-md outline-offset-2 p-1"
									href="/#"
								>
									<img src={product.images[0].url} alt={product.name} width="160px" height="160px" />
									<h2 class="font-semibold">{product.name}</h2>
									<div class="flex justify-between items-center">
										<span>{product.symbol}</span>
										<span>50.00 PLN</span>
									</div>
								</a>
							{/each}
						{:catch error}
							<h1>{error}</h1>
						{/await} -->
					</div>
				</div>
				{#if !productsFiltered.length}
					<div class="flex flex-col justify-center items-center pb-3 mb-3" in:slide={{ axis: 'y' }}>
						<h2 class="text-2xl text-center">Brak wyników... 🤔</h2>
						<h3 class="text-lg text-center">Spróbuj wybrać inną kategorię 💡</h3>
					</div>
				{/if}
			</div>
		</div>
		<div class="drawer-side h-full bg-base-100 bg-opacity-95 w-72 xxs:w-80 md:w-64 lg:w-80">
			<label for="categories-drawer" class="drawer-overlay" />
			<div class="flex flex-col px-2 py-1 bg-base-100 sticky top-0">
				<div class="flex justify-between items-center">
					<h2 class=" text-xl font-medium p-0 text-base-content">Kategorie</h2>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<label
						tabindex="0"
						for="categories-drawer"
						class="btn btn-ghost btn-sm rounded-full px-1 flex md:hidden"
						on:keypress={function (event) {
							if (event.key === 'Enter') {
								event.currentTarget.click();
							}
						}}><X /></label
					>
				</div>

				<ul class="flex flex-col items-start py-1.5 pl-1">
					<button
						tabindex="0"
						class="btn btn-ghost hover:text-primary py-2 w-full text-left justify-start px-0 text-base {selectedCategories.main ===
							null && 'text-primary'}"
						on:click={() => {
							productsFilterDrawer.click();
							selectedCategories = {
								main: null,
								sub: null
							};
						}}>✨ Wszystko</button
					>
					{#each Object.entries(fodderCategories) as [category, subcategories]}
						<li class="w-full">
							{#if isProperCategory(category)}
								{#if subcategories.length === 0}
									<button
										tabindex="0"
										class="btn btn-ghost text-base hover:text-primary py-2 w-full text-left justify-start px-0 {selectedCategories.main ===
										category
											? 'text-primary'
											: ''}"
										on:click={() => {
											productsFilterDrawer.click();
											selectedCategories = {
												main: category,
												sub: null
											};
										}}>{fodderNames[category]}</button
									>
								{:else}
									<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
									<div tabindex="0" class="collapse py-2 group/subcategories">
										<input type="checkbox" class="appearance-none opacity-0 min-h-fit" />
										<div
											class="btn btn-ghost text-left font-semibold justify-start px-0 collapse-title hover:text-primary text-base p-0 h-8 min-h-fit "
										>
											{fodderNames[category]}
											<ChevronUp class="ml-2 group-checked/subcategories:first:rotate-180" />
										</div>
										<div class="collapse-content flex flex-col items-start space-y-0.5">
											{#each subcategories as subcategory}
												<button
													tabindex="0"
													class="btn btn-ghost h-fit p-1 hover:text-primary text-sm text-left w-full justify-start {selectedCategories.sub &&
													selectedCategories.sub === subcategory.id
														? 'text-primary'
														: ''}"
													on:click={() => {
														productsFilterDrawer.click();
														selectedCategories = {
															main: category,
															sub: subcategory.id
														};
													}}>• {subcategory.name}</button
												>
											{/each}
										</div>
									</div>
								{/if}
							{/if}
						</li>
					{/each}
				</ul>

				<div class="w-full px-2">
					<label for="categories-drawer" class="btn btn-secondary bg-opacity-95 flex md:hidden">
						<CornerUpLeft class="mr-1" /> Powrót</label
					>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.drawer {
		height: 100%;
		overflow: visible;
		max-height: none;
	}

	.drawer-toggle ~ .drawer-content {
		overflow: visible;
	}

	.drawer-toggle ~ .drawer-side {
		max-height: none;
		overflow: visible;
	}

	.drawer-toggle:checked ~ .drawer-content {
		--tw-translate-x: 0.25rem /* 8px */;
	}

	@media (min-width: 768px) {
		.drawer-mobile > .drawer-toggle ~ .drawer-side > .drawer-overlay + * {
			--tw-translate-x: 0px;
			transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
				skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
				scaleY(var(--tw-scale-y));
		}

		.drawer-mobile > .drawer-toggle ~ .drawer-side > .drawer-overlay {
			visibility: visible;
		}

		.drawer-mobile {
			grid-auto-columns: max-content auto;
		}

		.drawer-mobile > .drawer-toggle ~ .drawer-content {
			grid-column-start: 2;
		}
	}
</style>
