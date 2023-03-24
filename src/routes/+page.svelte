<script lang="ts">
	import toast from 'svelte-french-toast';
	import { onMount } from 'svelte';
	import { subscribe, unsubscribe } from '$lib/client/functions/push';

	let sessionData: import('./$types').PageData['user'] | undefined = undefined;

	async function session() {
		const response = await fetch('/api/session', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		sessionData = await response.json();
	}

	function showToast() {
		toast.success('Poggerson XD');
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
	<button on:click={session} class="px-3 py-2 bg-gray-800 text-white text-lg">Get session</button>
	<button on:click={showToast} class="px-3 py-2 bg-gray-800 text-white text-lg">Poggers xD</button>
	{JSON.stringify(sessionData)}
	<button
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
	>
</section>
