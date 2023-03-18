<script lang="ts">
	import '../app.css';
	import Navbar from '../components/Layout/Navbar.svelte';
	import Footer from '../components/Layout/Footer.svelte';
	import { fade, fly } from 'svelte/transition';
	import { Toaster } from 'svelte-french-toast';

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { theme } from '$lib/client/stores/theme';

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});

	export let data;

	console.log('url', data.url);
</script>

<div
	class="min-h-screen flex flex-col justify-between max-w-screen bg-base-100"
	data-theme={$theme}
>
	<Toaster position="bottom-right" />

	<div class="flex flex-col w-full h-full">
		<Navbar user={data.user} />
		{#if data.url.includes('/admin')}
			<main
				in:fade
				class="min-h-[calc(100vh-65px)] flex flex-col px-1.5 xxs:px-2 sm:px-3 py-1 sm:py-2 relative"
			>
				<slot />
			</main>
		{:else}
			{#key data.url}
				<main
					in:fade
					class="min-h-[calc(100vh-65px)] flex flex-col px-1.5 xxs:px-2  sm:px-3 py-1 sm:py-2 relative"
				>
					<slot />
				</main>
			{/key}
		{/if}
	</div>
	<Footer />
</div>
