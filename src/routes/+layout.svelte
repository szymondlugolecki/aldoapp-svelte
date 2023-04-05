<script lang="ts">
	import '../app.css';
	import Navbar from '../components/Layout/Navbar.svelte';
	import Footer from '../components/Layout/Footer.svelte';
	import { fade, fly } from 'svelte/transition';
	import toast, { Toaster } from 'svelte-french-toast';

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { settings } from '$lib/client/stores/settings';
	import { base64StringToUint8Arr } from '$lib/client/functions/base64StringToUint8Arr';
	import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(async () => {
		themeChange(false);
		// 👆 false parameter is required for svelte

		// setInterval(() => {
		// 	toast('Jaroslaw wlasnie kupil Pasze ALDO Premium', { icon: '🔔' });
		// }, 1000 * 30);
	});

	export let data;
</script>

<div
	class="min-h-screen flex flex-col justify-between max-w-screen bg-base-100"
	data-theme={$settings.theme}
>
	<Toaster position="bottom-right" />

	<div class="flex flex-col w-full h-full">
		<Navbar user={data.user} />
		<!-- {#if data.url.includes('/admin')} -->
		<main
			in:fade
			class="w-full min-h-[calc(100vh-65px)] flex px-1.5 xs:px-2 sm:px-3 pt-1 sm:pt-2 pb-[65px] relative items-stretch"
		>
			<slot />
		</main>
		<!-- {:else}
			{#key data.url}
				<main
					in:fade
					class="min-h-[calc(100vh-65px)] flex px-1.5 xs:px-2 sm:px-3 pt-1 sm:pt-2 pb-[65px] relative items-stretch"
				>
					<slot />
				</main>
			{/key}
		{/if} -->
	</div>
	<Footer />
</div>
