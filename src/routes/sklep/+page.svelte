<script lang="ts">
	import { fodderCategories, fodderNames, producentsList } from '$lib/client/constants';
	import { getProductImageURL } from '$lib/client/functions';
	import { Filter, Search } from 'lucide-svelte';

	export let data;

	function isProperCategory(category: string): category is keyof typeof fodderCategories {
		return category in fodderCategories;
	}
</script>

<svelte:head>
	<title>Sklep • Twoje ALDO</title>
	<meta
		name="description"
		content="Strona sklepu Twoje ALDO. Znajdź produkty, które Cię interesują. Zamów online."
	/>
</svelte:head>

<section class="w-full h-full flex flex-row-reverse">
	<div class="w-full h-full sm:px-4">
		<div
			class="w-full h-fit flex justify-between items-center py-1 sticky top-0 bg-base-100 z-10 space-x-2"
		>
			<div
				class="flex-1 flex items-center pl-2 rounded-lg border border-transparent focus-within:border-primary duration-200 group"
			>
				<Search class="group-focus-within:text-primary mr-2" size={24} />
				<input
					type="text"
					class="border-none rounded-r-lg outline-none focus:outline-none focus:ring-0 py-2 bg-base-100 w-full"
					placeholder="Szukaj produktów..."
				/>
			</div>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<label
				id="filterDropdownButton"
				tabindex="0"
				for="admin-drawer"
				class="drawer-button btn btn-accent btn-sm h-[40px] flex-1 sm:text-sm max-w-[160px]"
				on:keypress={(event) => {
					if (event.key === 'Enter') {
						event.currentTarget.click();
					}
				}}
				><Filter class="sm:mr-2 w-5 h-5" />
				Filtrowanie</label
			>
		</div>
		<div />
		<div class="py-2 px-1">
			<h1 class="text-2xl mb-3 p-1">Lista produktów</h1>
			<div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-10">
				{#each data.products as product}
					<div
						class="flex flex-col justify-between  max-w-[300px] w-full shadow-xl sm:shadow-2xl border border-base-content border-opacity-10 p-3 pt-4 group/product duration-100 rounded-md outline-primary outline-offset-2"
					>
						<a
							class="flex flex-col justify-start items-center lg:text-base text-xs md:text-sm"
							href="/#"
						>
							<img
								class="group-hover/product:opacity-90"
								src={product.images[0].url}
								alt={product.name}
								width="160px"
								height="160px"
							/>
							<div class="flex flex-col items-start py-2 w-full space-y-2">
								<span class="text-red-500 text-sm font-semibold whitespace-normal"
									>{producentsList[product.producent]}</span
								>
								<span class="font-semibold">{product.name}</span>
								<span>{product.price} zł / szt.</span>
							</div>
						</a>
						<div class="flex justify-end items-center w-full">
							<button class="btn btn-secondary btn-sm text-xs sm:text-sm">Do koszyka</button>
						</div>
					</div>
				{/each}
				<!-- <span>•</span> -->

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
				{/await}-->
			</div>
		</div>
	</div>
	<aside class="sm:flex flex-col items-start w-72 space-y-2 hidden sticky top-0 h-full py-2">
		<h2 class="text-xl mb-3">Kategorie</h2>
		<ul class="flex flex-col items-start space-y-2 pl-1">
			{#each Object.entries(fodderCategories) as [category, subcategories]}
				<li>
					{#if isProperCategory(category)}
						{#if subcategories.length === 0}
							<button class="hover:text-primary">{fodderNames[category]}</button>
						{:else}
							<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
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
	</aside>
</section>
<!-- <h1>Tutaj będzie sklep 🤯 🛒</h1> -->
<!-- <p>{JSON.stringify(data.products)}</p> -->
