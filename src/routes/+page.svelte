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

	const data = [
		['John', new Date().toDateString()],
		['Mark', new Date().toDateString()]
		// { name: 'John', email: 'john@example.com' },
		// { name: 'Mark', email: 'mark@gmail.com' }
	];

	const columns = [
		{
			name: 'Title',
			sort: false
		},
		{
			name: 'Date',
			formatter: (cell: string) => {
				return new Date(cell).toLocaleString('en-US', {
					month: 'short',
					year: 'numeric'
				});
			}
		}
	];
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

	<Grid {columns} sort search pagination={{ enabled: true, limit: 3 }} {data} />
</section>
