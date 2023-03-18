<script lang="ts">
	import ModalHeader from '$components/Modals/ModalHeader.svelte';
	import { fodderCategories, fodderNames, producentsList } from '$lib/client/constants';
	import { textCrusher } from '$lib/client/functions';
	import type { Category } from '$types';
	import type { Product } from '@prisma/client';
	import { CornerUpLeft, List, Search, X } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	export let data;

	function isProperCategory(category: string): category is Category {
		return category in fodderCategories;
	}

	// the reason why main is both Category and string is because
	// types seem to not work in the markup 🤔
	let selectedCategories: { main: Category | string | null; sub: string | null } = {
		main: null,
		sub: null
	};

	let searchInput = '';

	type StoreProduct = (typeof data.products)[number];

	const applyStoreProductFilters = (product: StoreProduct) => {
		const categoryFilter = (product: StoreProduct) => {
			// no category selected
			if (!selectedCategories.main) {
				return true;
			}

			// weird but ok, will just show everything
			if (!(selectedCategories.main in fodderCategories)) {
				return true;
			}

			// if subcategory is empty
			if (selectedCategories.sub === null) {
				// check if there's no subcategories under this category, if so its ok 👍
				if (!fodderCategories[selectedCategories.main as Category].length) {
					return true;
				}

				// else its weird and we should return false
				return false;
			}

			if (selectedCategories.main) {
				if (product.category === categories.sub) return true;
			} else {
				if (product.category === categories.main) return true;
			}
		};

		return categoryFilter(product);
	};

	$: productsFiltered = data.products
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
		.filter(applyStoreProductFilters);
</script>

<svelte:head>
	<title>Sklep • Twoje ALDO</title>
	<meta
		name="description"
		content="Strona sklepu Twoje ALDO. Znajdź produkty, które Cię interesują. Zamów online."
	/>
</svelte:head>

<section class="w-full h-full flex flex-row-reverse">
	<div class="drawer">
		<input id="my-drawer" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content">
			<!-- Page content here -->
			<div class="w-full h-full sm:px-4">
				<div class="w-full h-fit flex items-center py-1 sticky top-0 bg-base-100 z-10">
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
					<!-- <label for="my-drawer" class="btn btn-primary drawer-button">Open drawer</label> -->
				</div>
				<div class="py-2 px-1 mb-3">
					<div class="flex justify-between items-center px-1 pb-2.5">
						<h1 class="text-xl xxs:text-2xl">Lista produktów</h1>

						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<label
							id="filterDropdownButton"
							tabindex="0"
							for="my-drawer"
							class="inline-flex justify-center sm:hidden btn btn-accent btn-xs h-7 xxs:h-[40px] w-full flex-1 sm:text-sm px-0 max-w-[125px] xs:max-w-[140px]"
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
								in:slide
								class="flex flex-col justify-between max-w-[300px] w-full shadow-sm sm:shadow-md shadow-base-content border border-base-content border-opacity-10 p-1 xxs:p-2 sm:p-3 pt-4 group/product duration-100 rounded-md outline-primary outline-offset-2"
							>
								<a
									class="flex flex-col justify-start items-center lg:text-base text-xs md:text-sm p-2"
									href="/#"
								>
									<img
										class="group-hover/product:opacity-90"
										src={product.images[0].url}
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
									<button class="btn btn-secondary btn-sm text-xs sm:text-sm">Do koszyka</button>
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
			</div>
		</div>
		<div class="drawer-side bg-base-100 bg-opacity-95">
			<label for="my-drawer" class="drawer-overlay" />
			<div class="flex flex-col px-2 py-1 bg-base-100">
				<div class="flex justify-between items-center">
					<h2 class=" text-xl font-medium p-0 text-base-content">Kategorie</h2>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<label
						tabindex="0"
						for="my-drawer"
						class="btn btn-ghost btn-sm rounded-full px-1"
						on:keypress={function (event) {
							if (event.key === 'Enter') {
								event.currentTarget.click();
							}
						}}><X /></label
					>
				</div>

				<ul class="flex flex-col items-start py-1.5 pl-1">
					{#each Object.entries(fodderCategories) as [category, subcategories]}
						<li class="w-full">
							{#if isProperCategory(category)}
								{#if subcategories.length === 0}
									<button
										class="hover:text-primary py-2 w-full text-left"
										on:click={() => {
											selectedCategories = {
												main: category,
												sub: null
											};
										}}>{fodderNames[category]}</button
									>
								{:else}
									<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
									<div tabindex="0" class="collapse py-2">
										<input type="checkbox" class="appearance-none opacity-0 min-h-fit" />
										<div
											class="collapse-title hover:text-primary text-base font-normal p-0 h-8 min-h-fit"
										>
											{fodderNames[category]}
										</div>
										<div class="collapse-content flex flex-col items-start space-y-2">
											{#each subcategories as subcategory}
												<button
													class="hover:text-primary text-sm text-left"
													on:click={() =>
														(selectedCategories = {
															main: category,
															sub: subcategory.id
														})}>• {subcategory.name}</button
												>
											{/each}
										</div>
									</div>
								{/if}
							{/if}
						</li>
					{/each}
				</ul>

				<label for="my-drawer" class="btn btn-secondary bg-opacity-95">
					<CornerUpLeft class="mr-1" /> Powrót</label
				>
			</div>
		</div>
	</div>
	<!-- <input
		type="checkbox"
		id="store-menu-toggle"
		name="store-menu-toggle"
		class="store-menu-toggle peer"
		hidden
	/>
	<div class="w-full h-full sm:px-4">
		<div
			class="w-full h-fit flex justify-between flex-col space-y-2 xs:space-y-0 xs:flex-row items-center py-1 sticky top-0 bg-base-100 z-10 xs:space-x-2"
		>
			<div
				class="flex-1 flex items-center pl-2 rounded-lg border border-transparent focus-within:border-primary duration-200 group w-full"
			>
				<Search class="group-focus-within:text-primary mr-2" size={24} />
				<input
					type="text"
					class="border-none rounded-r-lg outline-none focus:outline-none focus:ring-0 py-2 bg-base-100 w-full"
					placeholder="Szukaj produktów..."
				/>
			</div>
			<label
				id="filterDropdownButton"
				tabindex="0"
				for="store-menu-toggle"
				class="inline-flex justify-center sm:hidden btn btn-accent btn-sm h-[40px] w-full flex-1 sm:text-sm px-0 xs:max-w-[140px]"
				on:keypress={(event) => {
					if (event.key === 'Enter') {
						event.currentTarget.click();
					}
				}}
				><List class="mr-1 sm:mr-2 w-5 h-5" />
				<span>Kategorie</span>
			</label>
		</div>
		<div class="py-2 px-1">
			<h1 class="text-2xl mb-3 p-1">Lista produktów</h1>
			<div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-10">
				{#each data.products as product}
					<div
						in:slide
						class="flex flex-col justify-between max-w-[300px] w-full shadow-sm sm:shadow-md shadow-base-content border border-base-content border-opacity-10 p-3 pt-4 group/product duration-100 rounded-md outline-primary outline-offset-2"
					>
						<a
							class="flex flex-col justify-start items-center lg:text-base text-xs md:text-sm p-2"
							href="/#"
						>
							<img
								class="group-hover/product:opacity-90"
								src={product.images[0].url}
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
							<button class="btn btn-secondary btn-sm text-xs sm:text-sm">Do koszyka</button>
						</div>
					</div>
				{/each}

				<!- {#await data.lazy.products}
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
				{/await} ->
			</div>
		</div>
	</div>
	<aside
		transition:slide={{ axis: 'x' }}
		class="z-20 sm:flex flex-col items-start w-64 xxs:w-72 space-y-2 top-0 h-full py-2 bg-base-100 left-0 fixed peer-checked:flex [&:not(peer-checked)]:hidden sm:[&:not(peer-checked)]:flex"
	>
		<h2 class="text-xl mb-3">Kategorie</h2>
		<ul class="flex flex-col items-start space-y-2 pl-1">
			{#each Object.entries(fodderCategories) as [category, subcategories]}
				<li>
					{#if isProperCategory(category)}
						{#if subcategories.length === 0}
							<button class="hover:text-primary">{fodderNames[category]}</button>
						{:else}
							<!- svelte-ignore a11y-no-noninteractive-tabindex ->
							<div tabindex="0" class="collapse">
								<input type="checkbox" name="siema" />
								<div
									class="collapse-title hover:text-primary text-base font-normal p-0 h-8 min-h-fit"
								>
									{fodderNames[category]}
								</div>
								<div class="collapse-content flex flex-col items-start space-y-2">
									{#each subcategories as subcategory}
										<button class="hover:text-primary text-sm text-left"
											>• {subcategory.name}</button
										>
									{/each}
								</div>
							</div>
						{/if}
					{/if}
				</li>
			{/each}
		</ul>
	</aside> -->
</section>
