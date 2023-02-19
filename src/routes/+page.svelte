<script lang="ts">
	import { error } from '@sveltejs/kit';

	let total = 0;

	async function session() {
		const response = await fetch('/api/session', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		total = await response.json();
	}
</script>

<section class="h-full w-full px-3 py-2">
	<h1 class="text-3xl">Strona główna</h1>
	<h2 class="text-xl">Na razie nic tu nie ma... 😌</h2>
	<button on:click={session} class="px-3 py-2 bg-gray-800 text-white text-lg">Get session</button>
	{JSON.stringify(total)}
</section>
