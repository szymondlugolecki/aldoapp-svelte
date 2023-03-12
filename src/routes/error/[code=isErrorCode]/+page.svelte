<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';

	let visible = false;

	onMount(() => {
		visible = true;
	});

	onDestroy(() => {
		visible = false;
	});

	export let data;
</script>

<svelte:head>
	<title>Błąd {data.statusCode} • Twoje ALDO</title>
	<meta
		name="description"
		content="Wystąpił błąd. Kod: {data.statusCode}. Treść: {data.message}."
	/>
</svelte:head>

<section class="w-full h-full flex justify-center items-center flex-col">
	{#if visible}
		<div class="text-center w-full px-6 sm:px-2">
			<p class="text-6xl font-bold mb-1" in:fly={{ y: -200, duration: 1000 }}>⚠️</p>
			<h1 class="text-3xl sm:text-4xl font-bold mb-3" in:fly={{ y: -200, duration: 1000 }}>
				Błąd {data.statusCode}
			</h1>
			<h2 class="text-xl sm:text-2xl font-semibold" in:fade={{ duration: 1350 }}>
				{data.message} 😔
			</h2>
		</div>
		<div class="flex space-x-3 items-center mt-2" in:fade={{ duration: 1350 }}>
			<a href="/" class="text-blue-500 hover:text-blue-700">Strona główna</a>
			{#if data.user}
				<a href="/api/logout" class="text-blue-500 hover:text-blue-700">Wyloguj się</a>
			{:else}
				<a
					href="/login"
					class="text-white hover:bg-blue-800 duration-200 bg-blue-700 rounded-md px-3 py-2"
					>Zaloguj się</a
				>
			{/if}
			<button />
		</div>
	{/if}
</section>
