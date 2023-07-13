<script lang="ts">
	import toast from 'svelte-french-toast';

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

	<button on:click={createProgenitor} class="px-3 py-2 bg-gray-800 text-white text-lg"
		>Utwórz protoplastę</button
	>

	<h3 class="my-4">Tech Stack</h3>

	<ul class="list-disc ml-6">
		<li>SvelteKit + TypeScript</li>
		<li>TailwindCSS + shadcn-svelte + meltui + (DaisyUI)</li>
		<li>PlanetScale (MySQL) + DrizzleORM</li>
		<li>Inne: zod, jose, tanstack table, lucide-svelte, sendgrid</li>
	</ul>

	<div class="my-4">
		<span class="block"
			>Wersja Alpha - nic nie było testowane, brak połączenia z Navireo, można składać zamówienia do
			testów, antywirus może blokować maile</span
		>
	</div>

	<h4 class="my-4">TODO List:</h4>

	<ul class="list-disc ml-6">
		<!-- <li>Usuwanie użytych kodów weryfikacyjnych z bazy danych po pomyślnym logowaniu</li> -->

		<li>
			Strona główna (pomysły: karuzela zdjęć/powiadomienia/featured wybrane produkty ze sklepu/itp.)
		</li>
		<li>Dodać caching</li>
		<li>Custom error page (lepszy design)</li>
		<li>Dodać możliwość potwórzenia zamówienia</li>
		<li>Dodać możliwość doradcom złożenia zamówienia w imieniu klienta (przypisanego do nich)</li>
		<li>
			Dodać strony widoczne we stopce (About us, Privacy, ToS, Contact) + Linki do social media
		</li>
		<li>Poprawić wysyłane maile (design, treść) + zmienić domenę na aldo.agro.pl</li>
		<li>Powiadomienie przed dostawą z telefonem do kierowcy</li>
		<li>Optymalizacja SEO i a11y</li>
	</ul>

	<!-- <h5>Kiedyś:</h5>
	<ul class="list-disc ml-6">
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

	<ul class="list-disc ml-6">
		<li>
			Na małych urządzeniach mobilnych dodać panel nawigacyjny na dół + gesture detection do
			zmieniania strony (swipe)
		</li>
		<li>Przyjrzeć sie trybowi offline</li>
		<li>Możliwość płatności online (Dotpay/Przelewy24/Stripe/Paypal????)</li>
		<li>Page Transition z nowym API Chrome</li>
	</ul> -->
</section>
