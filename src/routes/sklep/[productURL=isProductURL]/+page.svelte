<script lang="ts">
	import { page } from '$app/stores';
	import { fodderCategories2, fodderNames, producentsList } from '$lib/client/constants';
	import Alert from '$shadcn/alert/Alert.svelte';
	import AlertTitle from '$shadcn/alert/AlertTitle.svelte';
	import AlertDescription from '$shadcn/alert/AlertDescription.svelte';
	import Button from '$shadcn/button/Button.svelte';
	import Separator from '$shadcn/separator/Separator.svelte';
	import { Package, PlusCircle, ShoppingCart } from 'lucide-svelte';
	import toast from 'svelte-french-toast';

	export let data;

	// $: console.log('data.url', data.url.slice(data.url.lastIndexOf('/') + 1));

	const product = data.products.find((product) => {
		const index = data.url.lastIndexOf('/');
		if (index === -1) {
			return false;
		}
		return product.encodedURL === data.url.slice(index + 1);
	});

	let selectedImagePreview = 0;
	const productImgUrl =
		'https://res.cloudinary.com/dzcuq1b2u/image/upload/v1680687127/products/Lacto%20Start%20IPC%20pasza%20rozdojeniowa%20De%20Heus%2025kg/DB4A2X00G-W00/0.webp';
</script>

{#if product}
	<section class="w-full flex flex-col items-center justify-start">
		<div class="mx-auto px-4 w-full">
			<!-- Breadcrumbs -->
			<div class="text-sm breadcrumbs max-w-[260px] xxs:max-w-none">
				<ul>
					<li><a href="/sklep">{fodderNames[product.category]}</a></li>
					{#if product.subcategory}
						<li><a href="/sklep">{fodderCategories2[product.category][product.subcategory]}</a></li>
					{/if}
					<li>{product.name}</li>
				</ul>
			</div>

			<div
				class="mt-4 flex flex-col lg:flex-row items-center lg:items-start justify-start lg:justify-center"
			>
				<div class="lg:col-span-3 lg:row-end-1">
					<!-- All images -->
					<div class="lg:flex lg:items-start">
						<!-- Main Image -->

						<div class="overflow-hidden rounded-md max-w-xl">
							<a href={`/sklep/${product.encodedURL}`}>
								<img
									src={productImgUrl}
									alt=""
									class="scale-[1.1] object-cover hover:scale-[1.15] duration-150"
								/>
							</a>
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
										<img
											class="h-full w-full object-cover"
											src={image && image.url}
											alt={product.name}
										/>
									</button>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<div class="divider divider-horizontal xl:mx-16" />

				<div class="max-w-3xl lg:max-w-[340px] lg:w-[300px] xl:w-auto">
					<!-- <h1 class="text-2xl font-bold sm:text-3xl"></h1> -->
					<h1 class="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
						{product.name}
					</h1>
					<!-- <h3 class="scroll-m-20 text-xl font-semibold tracking-tight">
						
					</h3> -->

					<h3 class="text-base font-semibold mt-1">{product.price} PLN</h3>

					<div class="flex flex-col space-y-1 lg:text-base md:text-sm mt-5">
						<!-- <div class="flex justify-between items-center">
							<span class="text-base">Cena</span>
							<bold class="text-base">{product.price} PLN</bold>
						</div> -->
						<div class="flex justify-between items-center">
							<span class="text-base">Waga</span>
							<bold class="text-base">{product.weight} kg</bold>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-base">Producent</span>
							<bold class="text-base">{producentsList[product.producent]}</bold>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-base">Kod produktu</span>
							<bold class="text-base">{product.symbol}</bold>
						</div>
					</div>

					<div>
						<div class="mt-6 w-full flex space-y-2 flex-col">
							{#if $page.data.user}
								<Button>
									<PlusCircle class="mr-2 h-4 w-4" />
									Dodaj do koszyka
								</Button>
								<Button href="/zamowienie/koszyk" variant="secondary">
									<ShoppingCart class="mr-2 h-4 w-4" />
									Otwórz koszyk
								</Button>
							{:else}
								<Alert variant="default">
									<AlertTitle>Zaloguj się</AlertTitle>
									<AlertDescription>
										Musisz być zalogowany, żeby dodać produkt do koszyka.
										<br /><Button variant="link" href="/zaloguj" class="p-0"
											>Kliknij tutaj, aby się zalogować</Button
										>
									</AlertDescription>
								</Alert>
							{/if}
						</div>

						<div class="divider" />

						<ul>
							<li class="flex items-center text-left text-sm font-medium text-gray-600">
								<Package class="mr-2" />
								Darmowa dostawa
							</li>
						</ul>
					</div>
				</div>

				<!-- <div class="lg:col-span-3">
					<h3 class="text-lg">Opis produktu</h3>
					<p>{product.description || 'Brak opisu...'}</p>
				</div> -->
			</div>

			<Separator class="my-4 xl:my-16" orientation="horizontal" />

			<div>
				<h3 class="text-lg">Opis produktu</h3>
				<p class="text-sm mt-1">{product.description || ''}</p>
			</div>
		</div>
		<!-- <div class="divider hidden md:flex md:divider-horizontal" /> -->
	</section>
{:else}
	<h1 class="text-xl">Nie znaleziono produktu ☹️</h1>
{/if}
