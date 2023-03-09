<script lang="ts">
	import { getProductImageURL } from '$lib/client/functions';
	import { Search } from 'lucide-svelte';

	export let data: import('./$types').LayoutData;

	// $: console.log(data);
</script>

<svelte:head>
	<title>Sklep • Twoje ALDO</title>
	<meta
		name="description"
		content="Strona sklepu Twoje ALDO. Znajdź produkty, które Cię interesują."
	/>
</svelte:head>

<section class="w-full h-full flex flex-row-reverse">
	<div class="w-full h-full px-4">
		<div class="w-full h-16 flex justify-between items-center">
			<div
				class="flex items-center pl-2 rounded-md border border-transparent focus-within:border-blue-700 duration-200 group"
			>
				<Search class="group-focus-within:text-blue-700" />
				<input
					type="text"
					class="border-none rounded-r-md outline-none focus:outline-none focus:ring-0"
					placeholder="Szukaj produktów..."
				/>
			</div>
		</div>
		<div>
			<h1 class="text-2xl">Lista produktów</h1>
			<div class="grid lg:grid-cols-4 grid-cols-3 gap-10">
				{#each data.products as product}
					<a
						class="flex flex-col max-w-[256px] hover:opacity-90 duration-100 outline-blue-700 rounded-md outline-offset-2 p-1"
						href="/#"
					>
						<img
							src={getProductImageURL(product.thumbnail)}
							alt={product.name}
							width="160px"
							height="160px"
						/>
						<h2 class="font-semibold">{product.name}</h2>
						<div class="flex justify-between items-center">
							<span>{product.symbol}</span>
							<!-- <span>•</span> -->
							<span>50.00 PLN</span>
						</div>
					</a>
				{/each}
				{#await data.lazy.products}
					<h1>Wczytywanie reszty produktów...</h1>
				{:then products}
					{#each products as product}
						<a
							class="flex flex-col max-w-[256px] hover:opacity-90 duration-100 outline-blue-700 rounded-md outline-offset-2 p-1"
							href="/#"
						>
							<img
								src={getProductImageURL(product.thumbnail)}
								alt={product.name}
								width="160px"
								height="160px"
							/>
							<h2 class="font-semibold">{product.name}</h2>
							<div class="flex justify-between items-center">
								<span>{product.symbol}</span>
								<!-- <span>•</span> -->
								<span>50.00 PLN</span>
							</div>
						</a>
					{/each}
				{:catch error}
					<h1>{error}</h1>
				{/await}
			</div>
		</div>
	</div>
	<aside class="flex flex-col w-64 space-y-2">
		<h2 class="text-xl mb-3">Kategorie</h2>
		<a href="/#" class="hover:text-blue-700">Wszystko</a>
		<a href="/#" class="hover:text-blue-700">Pasze dla drobiu</a>
		<a href="/#" class="hover:text-blue-700">Pasze dla królików</a>
	</aside>
</section>
<!-- <h1>Tutaj będzie sklep 🤯 🛒</h1> -->
<!-- <p>{JSON.stringify(data.products)}</p> -->
