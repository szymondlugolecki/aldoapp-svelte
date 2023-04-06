<script lang="ts">
	import { fodderCategories, producentsList } from '$lib/client/constants';
	import { addProduct } from '$lib/client/stores/cart';
	import { ShoppingCart } from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import { fade, slide } from 'svelte/transition';

	export let data;

	$: console.log('data.url', data.url.slice(data.url.lastIndexOf('/') + 1));

	const product = data.products.find((product) => {
		const index = data.url.lastIndexOf('/');
		if (index === -1) {
			return false;
		}
		return product.encodedURL === data.url.slice(index + 1);
	});

	let selectedImagePreview = 0;
</script>

{#if product}
	<section class="w-full flex flex-col items-center justify-start pt-6 xl:pt-8">
		<div class="mx-auto px-4 w-full">
			<!-- Breadcrumbs -->
			<div class="text-sm breadcrumbs max-w-[260px] xxs:max-w-none">
				<ul>
					<li><a href="/sklep">Sklep</a></li>
					<li>{product.name}</li>
				</ul>
			</div>
			<!-- w-72 ss:w-80 md:w-64 -->
			<div
				class="mt-8 flex flex-col lg:flex-row items-center lg:items-start justify-start lg:justify-center 2xl:mr-64"
			>
				<div class="lg:col-span-3 lg:row-end-1">
					<!-- All images -->
					<div class="lg:flex lg:items-start">
						<!-- Main Image -->
						<div class="lg:order-2 lg:ml-5">
							<div class="max-w-xl overflow-hidden rounded-lg">
								<img
									class="h-[500px] w-full max-w-full object-cover"
									src={product.images[selectedImagePreview]}
									alt=""
								/>
							</div>
						</div>

						<!-- Left Side Images -->
						<div class="mt-2 lg:order-1 lg:flex-shrink-0">
							<div
								class="flex flex-row items-start lg:flex-col w-full mb-3 space-x-4 lg:space-x-0 lg:space-y-4"
							>
								{#each product.images.slice(0, 4) as image}
									<!-- transition:fade={{ duration: 400 }} -->
									<button
										type="button"
										class:outline={selectedImagePreview === product.images.indexOf(image)}
										class:outline-2={selectedImagePreview === product.images.indexOf(image)}
										class="flex-0 aspect-square h-20 overflow-hidden rounded-lg outline outline-offset-2 outline-base-content text-center"
										on:click={() => (selectedImagePreview = product.images.indexOf(image))}
									>
										<img class="h-full w-full object-cover" src={image} alt={product.name} />
									</button>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<div class="divider divider-horizontal xl:mx-16" />

				<div class="max-w-[576px] lg:max-w-[340px] lg:w-[300px] xl:w-auto">
					<h1 class="text-2xl font-bold sm:text-3xl">{product.name}</h1>
					<h2 class="text-lg mt-1">Kod produktu: {product.symbol}</h2>

					<div class="flex flex-col space-y-1 lg:text-base md:text-sm mt-5">
						<div class="flex justify-between items-center">
							<span class="text-base">Cena</span>
							<bold class="font-semibold text-base">{product.price} PLN</bold>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-base">Waga</span>
							<bold class="font-semibold text-base">{product.weight} kg</bold>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-base">Producent</span>
							<bold class="font-semibold text-base">{producentsList[product.producent]}</bold>
						</div>
					</div>

					<div>
						<div
							class="mt-6 w-full flex space-y-2 flex-col xs:space-x-4 xs:space-y-0 xs:flex-row lg:space-x-0 lg:space-y-2 lg:flex-col xl:space-x-4 xl:space-y-0 xl:flex-row"
						>
							<button
								type="button"
								class="btn btn-primary flex-1 w-full"
								on:click={() => {
									addProduct(product);
									toast('Dodano do koszyka', { icon: '🛒' });
								}}>Dodaj do koszyka</button
							>

							<a type="button" class="btn btn-md" href="/zamowienie/koszyk"
								>Otwórz koszyk <ShoppingCart class="ml-2.5" /></a
							>
						</div>

						<div class="divider" />

						<ul class="space-y-2">
							<li class="flex items-center text-left text-sm font-medium text-gray-600">
								<svg
									class="mr-2 block h-5 w-5 align-middle text-gray-500"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										class=""
									/>
								</svg>
								Darmowa dostawa
							</li>

							<li class="flex items-center text-left text-sm font-medium text-gray-600">
								<svg
									class="mr-2 block h-5 w-5 align-middle text-gray-500"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
										class=""
									/>
								</svg>
								14 dni na zwrot
							</li>
						</ul>
					</div>
				</div>

				<!-- <div class="lg:col-span-3">
					<h3 class="text-lg">Opis produktu</h3>
					<p>{product.description || 'Brak opisu...'}</p>
				</div> -->
			</div>
		</div>
		<!-- <div class="divider hidden md:flex md:divider-horizontal" /> -->
	</section>
{:else}
	<h1 class="text-xl">Nie znaleziono produktu ☹️</h1>
{/if}
