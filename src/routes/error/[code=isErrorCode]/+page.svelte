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

<section class="flex flex-col items-center justify-center w-full">
	{#if visible}
		<div class="w-full px-6 text-center sm:px-2">
			<p class="mb-1 text-6xl font-bold" in:fly={{ y: -200, duration: 1000 }}>⚠️</p>
			<h1 class="mb-3 text-3xl font-bold sm:text-4xl" in:fly={{ y: -200, duration: 1000 }}>
				Błąd {data.statusCode}
			</h1>
			<h2 class="text-xl font-semibold sm:text-2xl" in:fade={{ duration: 1350 }}>
				{data.message} 😔
			</h2>
		</div>
		<div class="flex items-center mt-2 space-x-3" in:fade={{ duration: 1350 }}>
			<a href="/" class="text-primary hover:text-primary-focus">Strona główna</a>
			{#if data.me}
				<a href="/api/logout" class="text-primary hover:text-primary-focus">Wyloguj się</a>
			{:else}
				<a
					href="/zaloguj"
					class="px-3 py-2 text-white duration-200 rounded-md hover:bg-primary-focus bg-primary"
					>Zaloguj się</a
				>
			{/if}
			<button />
		</div>
	{/if}
</section>
