<script lang="ts">
	import toast from 'svelte-french-toast';
	// import ___ASSET___0 from '$lib/assets/bg1.png';
	// import { Image } from '@unpic/svelte';
	import Image from '$components/custom/Util/Image.svelte';
	import BackgroundImage from '$lib/assets/bg3.png?w=1500&format=avif;webp;jpg&as=picture';

	import Pig from '$lib/assets/category/pig.png?w=250&format=avif;webp;jpg&as=picture';
	import Cow from '$lib/assets/category/cow.png?w=250&format=avif;webp;jpg&as=picture';
	import Chicken from '$lib/assets/category/chicken.png?w=250&format=avif;webp;jpg&as=picture';
	import Dog from '$lib/assets/category/dog.png?w=250&format=avif;webp;jpg&as=picture';

	import { Button } from '$shadcn/button';
	import { fodderNames } from '$lib/client/constants/index.js';
	import type { MainCategory } from '$lib/client/constants/dbTypes.js';
	import { page } from '$app/stores';
	import type { SvelteComponent } from 'svelte';

	async function createProgenitor() {
		const createPromise = fetch('/api/progenitor/create', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			}
		});

		toast.promise(createPromise, {
			loading: 'Tworzenie protoplasty...',
			success: 'Protoplasta utworzony pomyślnie!',
			error: 'Wystąpił błąd podczas tworzenia protoplasty!'
		});

		const response = await createPromise;
		const json = await response.json();
		console.log('Response', json);
	}

	async function removeAllOrders() {
		const createPromise = fetch('/api/reset/orders', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			}
		});

		toast.promise(createPromise, {
			loading: 'Usuwanie zamówień...',
			success: 'Zamówienia usunięte pomyślnie',
			error: 'Wystąpił błąd podczas usuwania zamówień!'
		});

		const response = await createPromise;
		const json = await response.json();
		console.log('Response', json);
	}

	async function removeAllProducts() {
		const response = await fetch('/api/reset/products', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			}
		});
		const json = await response.json();
		console.log('Response', json);
	}

	async function removeAllUsers() {
		const response = await fetch('/api/reset/users', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			}
		});
		const json = await response.json();
		console.log('Response', json);
	}

	async function removeAllSubscriptions() {
		const response = await fetch('/api/reset/subscriptions', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			}
		});
		const json = await response.json();
		console.log('Response', json);
	}

	export let data;

	const productImgUrl =
		'https://res.cloudinary.com/dzcuq1b2u/image/upload/v1680687127/products/Lacto%20Start%20IPC%20pasza%20rozdojeniowa%20De%20Heus%2025kg/DB4A2X00G-W00/0.webp';

	const categoryToUrl = (category: string) => {
		const newUrl = new URL('/sklep', $page.url.href);
		newUrl.searchParams.set('kategoria', category);
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

<!-- <div class="relative">
		<div class="absolute inset-0 overflow-hidden">
			<Image
				class="w-full h-full brightness-[.4] object-cover object-center aspect-video"
				loading="eager"
				meta={BackgroundImage}
				alt="siema"
			/>
		</div>
		<div
			class="relative flex flex-col px-4 pt-64 mx-auto text-center sm:max-w-2xl lg:max-w-3xl pb-80 sm:pt-64 sm:pb-[26rem] sm:px-0 gap-y-3 sm:gap-y-6"
		>
			<h1 class="text-5xl font-bold tracking-tight text-white sm:text-6xl">Twoje ALDO</h1>
			<p class="text-base font-semibold text-white sm:text-xl">
				Zamawiaj gdzie chcesz i kiedy chcesz. W komputerze i w telefonie.
			</p>
			<div class="text-center">
				<Button
					href="/sklep"
					variant="default"
					class="w-full max-w-xs px-3 font-semibold text-black bg-white rounded-md sm:max-w-sm h-9 sm:h-10 sm:py-2 sm:px-4"
					>Przejdź do sklepu</Button
				>
			</div>
		</div>
	</div> -->

<section class="relative">
	<div class="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
		<Image
			class="w-full h-full brightness-[.4] object-cover object-center -z-50"
			loading="eager"
			meta={BackgroundImage}
			alt="tło strony, warsztat samochodowy"
		/>
	</div>
	<!-- class="px-4 sm:max-w-2xl lg:max-w-3xl sm:px-0 sm:gap-y-6" -->
	<div
		class="relative flex flex-col items-center justify-center h-screen max-w-2xl px-0 mx-auto -mt-24 text-center gap-y-3"
	>
		<h1 class="text-5xl font-bold tracking-tight text-white sm:text-6xl">Twoje ALDO</h1>
		<p class="text-sm font-semibold text-white sm:text-xl">Zamawiaj gdzie chcesz i kiedy chcesz.</p>
		<div class="text-center">
			<Button
				href="/sklep"
				variant="default"
				class="w-full max-w-xs px-3 font-semibold text-black bg-white rounded-md sm:max-w-sm h-9 sm:h-10 sm:py-2 sm:px-4"
				>Przejdź do sklepu</Button
			>
		</div>
	</div>
</section>

<!-- <div class="absolute w-full h-4 -bottom-1 bg-background" /> -->
<main>
	<div class="flex flex-col items-center pt-24 text-center sm:pt-32">
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
								<div class="relative overflow-hidden rounded-lg w-42 aspect-2/3">
									<div class="absolute flex items-center justify-center w-full h-full text-center">
										<p
											class="z-10 text-lg font-semibold tracking-tight text-white capitalize lg:tracking-normal sm:text-2xl whitespace-break-spaces"
										>
											{label.split(' ').join('\n')}
										</p>
									</div>
									<Image
										class="w-full h-full max-h-screen brightness-[.45] object-cover object-center hover:scale-110 transition-transform"
										loading="lazy"
										meta={categoryPictures[category]}
										alt={label}
									/>
								</div>
							</a>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<div class="flex justify-center px-4 pt-24 sm:pt-32 sm:px-8">
		<div class="w-full max-w-7xl">
			<span class="text-xl font-medium">Najczęściej kupowane</span>
			<div class="flex justify-start px-[10px] pt-6 pb-12">
				<div class="flex items-center w-auto pb-2 overflow-x-auto gap-x-16 justify-items-center">
					{#each data.mostBought as product, i}
						<a href="/sklep/{product.encodedURL}">
							<div class="flex flex-col w-60 gap-y-1">
								<div class="overflow-hidden rounded-lg aspect-3/4">
									<img
										src={productImgUrl}
										alt={product.name}
										class="w-full h-full object-cover object-center scale-[1.15] hover:scale-[1.165] transition-transform"
									/>
								</div>
								<div class="font-medium tracking-tight text-left break-words">
									{product.name}
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</main>

<!-- <a href="https://github.com/ciscoheat/sveltekit-rate-limiter">ratelimiter</a> -->
<!-- <button on:click={removeAllOrders} class="px-3 py-2 text-lg text-white bg-gray-800"
	>Usun zamowienia</button
> -->
<!-- 
<button on:click={removeAllProducts} class="px-3 py-2 text-lg text-white bg-gray-800"
	>Usun produkty</button
> -->

<!-- <button on:click={removeAllSubscriptions} class="px-3 py-2 text-lg text-white bg-gray-800"
	>Usun subskrypcje</button
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
