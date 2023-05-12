<script lang="ts">
	import toast from 'svelte-french-toast';
	import { onMount } from 'svelte';
	import { subscribe, unsubscribe } from '$lib/client/functions/push';
	// import { Grid } from "gridjs";
	import Grid from 'gridjs-svelte';

	let sessionData: import('./$types').PageData['user'] | undefined = undefined;

	async function session() {
		const response = await fetch('/api/session');

		sessionData = await response.json();
	}

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

	function showToast() {
		toast.success('Testowe Powiadomienie');
	}
</script>

<svelte:head>
	<title>Twoje ALDO</title>
	<meta
		name="description"
		content="Strona główna Twoje ALDO. Zamów online. Kontakt do sprzedawców. Dział pasz. Market. Dział maszyn. Komis maszyn. Serwis. Stacja paliw."
	/>
</svelte:head>

<section class="h-full w-full px-3 py-2">
	<h1 class="text-3xl">Strona główna</h1>
	<h2 class="text-xl">Na razie nic tu nie ma... 😌</h2>
	<!-- <button on:click={session} class="px-3 py-2 bg-gray-800 text-white text-lg">Get session</button> -->
	<button on:click={showToast} class="px-3 py-2 bg-gray-800 text-white text-lg"
		>Testowe powiadomienie</button
	>
	<!-- <button
		on:click={() => {
			subscribe();
		}}
		class="px-3 py-2 bg-gray-800 text-white text-lg">Chcę otrzymywać powiadomienia</button
	>

	<button
		on:click={() => {
			unsubscribe();
		}}
		class="px-3 py-2 bg-gray-800 text-white text-lg">Nie chcę już otrzymywać powiadomień</button
	> -->

	<!-- <button on:click={createProgenitor} class="px-3 py-2 bg-gray-800 text-white text-lg"
		>Utwórz protoplastę</button
	> -->

	<h3 class="my-4">Tech Stack</h3>

	<ul class="list-disc ml-6">
		<li>SvelteKit + TypeScript</li>
		<li>TailwindCSS + DaisyUI</li>
		<li>PlanetScale (MySQL) + DrizzleORM</li>
		<li>Inne: zod, jose, gridjs, cloudinary, lucide-svelte, sendgrid</li>
	</ul>

	<div class="my-4">
		<span class="block"
			>Wersja Alpha - nic nie było testowane, brak połączenia z Navireo, można składać zamówienia do
			testów, antywirus może blokować maile</span
		>
		<span class="block"
			>Edytowanie, dodawanie, usuwanie i filtrowanie elementów w panelu administracyjnym może nie
			działać po migracji tabel do GridJs</span
		>
	</div>

	<h4 class="my-4">TODO List:</h4>

	<ul class="list-disc ml-6">
		<li>Usuwanie użytych kodów weryfikacyjnych z bazy danych po pomyślnym logowaniu</li>
		<li>
			Sprawdzanie IP/UserAgent w celu uniknięcia szansy na powtórzenie się kodu weryfikacyjnego
		</li>
		<li>
			Dodać/naprawić/przetestować dodawanie i edytowanie: produktów, użytkowników, kodów
			promocyjnych i zamówień
		</li>
		<li>Poprawić słaby design panelu administracyjnego</li>
		<li>
			Strona główna (pomysły: karuzela zdjęć/powiadomienia/featured wybrane produkty ze sklepu/itp.)
		</li>
		<li>Filtry do sklepu (price range, producent, ...)</li>
		<li>Możliwość użycia kodów rabatowych w koszyku</li>
		<li>Możliwość przypisywania kodów rabatowych konkretnym produktom</li>
		<li>Poprawić cały admin panel: design, dodać filtry, itp.</li>
		<li>Dodać możliwość wysyłania powiadomień push wszystkim użytkownikom z panelu admina</li>
		<li>Poprawić design strony z podglądem zamówienia</li>
		<li>Poprawić design profilu użytkownika</li>
		<li>Dodać cacheowanie API requestów przez Redis (Upstash)</li>
		<li>Poprawić tryb offline</li>
		<li>Dodać możliwość wysyłania wiadomości do konkretnych działów (mailowo)</li>
		<li>Integracja z Navireo (produkty)</li>
		<li>Możliwość płatności online (Dotpay/Przelewy24/Stripe/Paypal????)</li>
		<li>Poprawienie a11y, SEO (bez i18n w dającej sie przewidziec przyszlosci)</li>
		<li>Page Transition z nowym API Chrome</li>
		<li>Custom error page (lepszy design)</li>
		<li>Poprawic UX: animacje, itp.</li>
		<li>Dodać możliwość potwórzenia zamówienia</li>
		<li>Dodać możliwość doradcom złożenia zamówienia w imieniu klienta (przypisanego do nich)</li>
		<li>Dodać analitykę strony</li>
		<li>Dodać statystyki sprzedawców, sprzedaży itp.</li>
		<li>
			Dodać strony widoczne w footerze (About us, Privacy, ToS, Contact) + Linki do social media
		</li>
		<li>Poprawić wysyłane maile (design, treść) + zmienić domenę na aldo.agro.pl</li>
		<li>Powiadomienie przed dostawą z telefonem do kierowcy</li>
		<li>
			Naprawić bug: Kontakty są prerendered, więc navbar pokazuje przycisk Zaloguj (mimo istnienia
			sesji)
		</li>
	</ul>

	<h5 class="my-4">Do przemyślenia:</h5>

	<ul class="list-disc ml-6">
		<li>
			Zrobienie koszyka w pełni server-side (persistance na kiku urządzeniach, łatwiej sprawdzić
			synchronizować zmiany w produktach)
		</li>
		<li>
			Na małych urządzeniach mobilnych dodać panel nawigacyjny na dół + gesture detection do
			zmieniania strony (swipe)
		</li>
	</ul>
</section>
