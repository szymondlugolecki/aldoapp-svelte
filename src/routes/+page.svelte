<script lang="ts">
	import Image from '$components/custom/image.svelte';
	// import BackgroundImage from '$lib/assets/bg3.png?w=1500&format=avif;webp;jpg&as=picture';
	import BackgroundImage from '$lib/assets/farm_animals.png?w=1000&format=avif;webp;jpg&as=picture';
	import logo from '$lib/assets/logo.png?w=220&format=avif;webp;jpg&as=picture';

	import Pig from '$lib/assets/category/pig.png?w=250&format=avif;webp;jpg&as=picture';
	import Cow from '$lib/assets/category/cow.png?w=250&format=avif;webp;jpg&as=picture';
	import Chicken from '$lib/assets/category/chicken.png?w=250&format=avif;webp;jpg&as=picture';
	import Dog from '$lib/assets/category/dog.png?w=250&format=avif;webp;jpg&as=picture';

	import { Button } from '$shadcn/button';
	import { fodderNames } from '$lib/client/constants/index.js';
	import type { MainCategory } from '$lib/client/constants/dbTypes.js';
	import { page } from '$app/stores';
	import ProductCarousel from './(components)/product-carousel.svelte';

	// async function createProgenitor() {
	// 	const createPromise = fetch('/api/progenitor/create', {
	// 		method: 'POST',
	// 		headers: {
	// 			'content-type': 'application/json'
	// 		}
	// 	});

	// 	toast.promise(createPromise, {
	// 		loading: 'Tworzenie protoplasty...',
	// 		success: 'Protoplasta utworzony pomyślnie!',
	// 		error: 'Wystąpił błąd podczas tworzenia protoplasty!'
	// 	});

	// 	const response = await createPromise;
	// 	const json = await response.json();
	// 	console.log('Response', json);
	// }

	// async function removeAllOrders() {
	// 	const createPromise = fetch('/api/reset/orders', {
	// 		method: 'POST',
	// 		headers: {
	// 			'content-type': 'application/json'
	// 		}
	// 	});

	// 	toast.promise(createPromise, {
	// 		loading: 'Usuwanie zamówień...',
	// 		success: 'Zamówienia usunięte pomyślnie',
	// 		error: 'Wystąpił błąd podczas usuwania zamówień!'
	// 	});

	// 	const response = await createPromise;
	// 	const json = await response.json();
	// 	console.log('Response', json);
	// }

	// async function removeAllProducts() {
	// 	const response = await fetch('/api/reset/products', {
	// 		method: 'POST',
	// 		headers: {
	// 			'content-type': 'application/json'
	// 		}
	// 	});
	// 	const json = await response.json();
	// 	console.log('Response', json);
	// }

	// async function removeAllUsers() {
	// 	const response = await fetch('/api/reset/users', {
	// 		method: 'POST',
	// 		headers: {
	// 			'content-type': 'application/json'
	// 		}
	// 	});
	// 	const json = await response.json();
	// 	console.log('Response', json);
	// }

	// async function removeAllSubscriptions() {
	// 	const response = await fetch('/api/reset/subscriptions', {
	// 		method: 'POST',
	// 		headers: {
	// 			'content-type': 'application/json'
	// 		}
	// 	});
	// 	const json = await response.json();
	// 	console.log('Response', json);
	// }

	// async function removeAllTokens() {
	// 	const response = await fetch('/api/reset/tokens', {
	// 		method: 'POST',
	// 		headers: {
	// 			'content-type': 'application/json'
	// 		}
	// 	});
	// 	const json = await response.json();
	// 	console.log('Response', json);
	// }

	// async function compressAllImages() {
	// 	const response = await fetch('/api/uploadimages', {
	// 		method: 'POST',
	// 		headers: {
	// 			'content-type': 'application/json'
	// 		}
	// 	});
	// 	const json = await response.json();
	// 	console.log('Response', json);
	// }

	export let data;

	const categoryToUrl = (category: string) => {
		const newUrl = new URL('/sklep', $page.url.href);
		newUrl.searchParams.set('category', category);
		return newUrl.href;
	};

	const categoryPictures = {
		trzoda: Pig,
		bydlo: Cow,
		drob: Chicken,
		'hodowla-przydomowa': Dog
	};

	const entries = Object.entries(fodderNames) as [MainCategory, string][];
</script>

<svelte:head>
	<title>Twoje ALDO</title>
	<meta
		name="description"
		content="Strona główna Twoje ALDO. Zamów online. Kontakt do sprzedawców. Dział pasz. Market. Dział maszyn. Komis maszyn. Serwis. Stacja paliw."
	/>
</svelte:head>

<section class="flex justify-center h-screen pt-24 -mt-24">
	<div
		class="flex flex-col items-center justify-center w-full h-full pb-12 lg:pb-24 lg:flex-row max-w-7xl gap-y-6"
	>
		<div class="flex flex-col items-center justify-center w-full max-w-md px-4 lg:flex-1 gap-y-3">
			<div class="flex flex-col gap-y-1">
				<h1
					class="flex items-center justify-center text-4xl font-bold tracking-tight sm:text-6xl gap-x-4"
				>
					Twoje <Image meta={logo} loading="eager" alt="ALDO" sizes="140px" />
				</h1>

				<p class="text-base font-semibold text-center sm:text-xl">w telefonie i komputerze</p>
				<div class="flex py-6 gap-x-5">
					<Button href="/sklep" class="flex-1" variant="default">Przejdź do sklepu</Button>
					<Button href="/kontakty" variant="secondary">Lista kontaktów</Button>
				</div>
			</div>
		</div>
		<div class="hidden max-w-xl px-4 lg:flex">
			<Image
				class="w-full h-full brightness-[1.05] object-cover object-center rounded-md"
				loading="lazy"
				meta={BackgroundImage}
				alt="Zwierzęta hodowlane"
			/>
		</div>
	</div>
</section>

<main>
	<div class="flex flex-col items-center pt-6 text-center">
		<div class="max-w-3xl px-5">
			<h2 class="text-4xl font-semibold tracking-tight">Zamawiaj swobodnie z domu</h2>
			<p class="px-10 py-2 text-base font-medium">Dostarczymy do Ciebie za darmo w ciągu 3 dni</p>
		</div>
	</div>

	<!-- Categories -->
	<!-- Most bought -->
	<!-- Favorite products -->
	<!-- Recently ordered -->

	<div class="flex justify-center px-4 pt-24 sm:pt-32 sm:px-8">
		<div class="w-full max-w-7xl">
			<span class="text-xl font-medium">Kategorie</span>
			<div class="flex justify-center">
				<div
					style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));"
					class="grid w-full pt-8 pb-12 place-items-center gap-x-2 lg:gap-x-8"
				>
					{#each entries as [category, label]}
						<div class="p-2.5">
							<a href={categoryToUrl(category)}>
								<div class="relative overflow-hidden rounded-lg aspect-2/3">
									<div class="absolute flex items-center justify-center w-full h-full text-center">
										<p
											class="z-10 text-lg font-semibold tracking-tight text-white capitalize lg:tracking-normal sm:text-2xl whitespace-break-spaces"
										>
											{label.split(' ').join('\n')}
										</p>
									</div>
									<Image
										class="w-full h-full max-h-screen brightness-[.75] object-cover object-center hover:scale-110 transition-transform"
										loading="lazy"
										meta={categoryPictures[category]}
										alt="Zdjęcie kategorii {label}"
									/>
								</div>
							</a>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<ProductCarousel title="Najczęściej kupowane" products={data.mostBought} />

	<ProductCarousel title="Ostatnio kupione" products={data.recentlyOrdered} />
</main>

<!-- <a href="https://github.com/ciscoheat/sveltekit-rate-limiter">ratelimiter</a>
<button on:click={removeAllOrders} class="px-3 py-2 text-lg text-white bg-gray-800"
	>Usun zamowienia</button
> -->

<!-- <button on:click={compressAllImages} class="px-3 py-2 text-lg text-white bg-gray-800"
	>Skompresuj zdjecia</button
> -->

<!-- <button on:click={removeAllProducts} class="px-3 py-2 text-lg text-white bg-gray-800"
	>Usun produkty</button
> -->

<!-- <button on:click={removeAllSubscriptions} class="px-3 py-2 text-lg text-white bg-gray-800"
	>Usun subskrypcje</button
> -->

<!-- <button on:click={removeAllTokens} class="px-3 py-2 text-lg text-white bg-gray-800"
	>Usun tokeny</button
> -->

<!-- <button on:click={removeAllUsers} class="px-3 py-2 text-lg text-white bg-gray-800"
	>Usun użytkowników</button
> -->

<!-- </div> -->
<!-- <button on:click={createProgenitor} class="px-3 py-2 text-lg">Utwórz protoplastę</button> -->

<!-- <h1 class="text-3xl">Strona główna</h1>
	<h2 class="text-xl">Na razie nic tu nie ma... 😌</h2>
	<button on:click={session} class="px-3 py-2 text-lg text-white bg-gray-800">Get session</button>
	<button on:click={showToast} class="px-3 py-2 text-lg text-white bg-gray-800"
		>Testowe powiadomienie</button
	>




	<h4 class="my-4">TODO List:</h4>

	<ul class="ml-6 list-disc">
		<li>Usuwanie użytych kodów weryfikacyjnych z bazy danych po pomyślnym logowaniu</li>
		<li>Zrobić podstrony: główną, profil użytkownika</li>
		<li>Poprawić design strony z błędami</li>
		<li>Przycisk "Potwórz zamówienie"</li>
		<li>Dodać strony widoczne we stopce + ew. Linki do social media</li>
		<li>Poprawić wysyłane maile (design, treść) + zmienić domenę na aldo.agro.pl</li>
		<li>Powiadomienia związane z zamówieniem</li>
		<li>Optymalizacja SEO i a11y</li>
		<li>Cachowanie requestów</li>
	</ul> -->

<!-- <h5>Kiedyś:</h5>
	<ul class="ml-6 list-disc">
		<li>Integracja z Navireo (produkty)</li>
		<li>Filtry do sklepu (price range, producent, ...) i admin panelu</li>
		<li>Możliwość użycia kodu rabatowego w koszyku</li>
		<li>Poprawic UX: animacje, itp.</li>
		<li>Możliwość przypisywania kodów rabatowych konkretnym produktom</li>
		<li>Dodać analitykę strony</li>
		<li>Dodać statystyki sprzedawców, sprzedaży itp.</li>
		<li>Dodać możliwość wysyłania wiadomości do konkretnych działów (mailowo)</li>
		<li>
			Sprawdzanie IP/UserAgent w celu uniknięcia szansy na powtórzenie się kodu weryfikacyjnego
		</li>
	</ul>

	<h6 class="my-4">Do przemyślenia:</h6>

	<ul class="ml-6 list-disc">
		<li>
			Na małych urządzeniach mobilnych dodać panel nawigacyjny na dół + gesture detection do
			zmieniania strony (swipe)
		</li>
		<li>Przyjrzeć sie trybowi offline</li>
		<li>Możliwość płatności online (Dotpay/Przelewy24/Stripe/Paypal????)</li>
		<li>Page Transition z nowym API Chrome</li>
	</ul> -->
