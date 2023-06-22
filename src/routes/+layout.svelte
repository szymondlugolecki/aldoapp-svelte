<script lang="ts">
	import '../app.css';

	import Navbar from '../components/Layout/Navbar.svelte';
	import Footer from '../components/Layout/Footer.svelte';
	import { fade } from 'svelte/transition';
	import toast, { Toaster } from 'svelte-french-toast';

	import { onDestroy, onMount } from 'svelte';
	import { settings } from '$lib/client/stores/settings';
	import { base64StringToUint8Arr } from '$lib/client/functions/base64StringToUint8Arr';
	import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
	import type { BeforeInstallPromptEvent } from '../app';
	import type { Unsubscriber } from 'svelte/store';

	let deferredInstallEvent: BeforeInstallPromptEvent | undefined = undefined;

	let unsubscribe: Unsubscriber | undefined;

	onMount(async () => {
		// setInterval(() => {
		// 	toast('Jaroslaw wlasnie kupil Pasze ALDO Premium', { icon: '🔔' });
		// }, 1000 * 30);

		window.addEventListener('beforeinstallprompt', (e) => {
			console.log('before install prompt', e);
			// e.preventDefault();
			toast.success('Before install prompt!');
			deferredInstallEvent = e as BeforeInstallPromptEvent;
		});

		$settings.theme = 'dark';

		unsubscribe = settings.subscribe(({ theme }) => {
			switch (theme) {
				case 'light':
					document.documentElement.classList.remove('dark');
					break;
				case 'dark':
					document.documentElement.classList.add('dark');
					break;
				default:
					const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
					if (prefersDark) {
						document.documentElement.classList.add('dark');
					} else {
						document.documentElement.classList.remove('dark');
					}
					break;
			}
		});
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});

	async function handleInstall() {
		if (deferredInstallEvent) {
			deferredInstallEvent.prompt();
			let choice = await deferredInstallEvent.userChoice;
			if (choice.outcome === 'accepted') {
				// User accepted to install the application
				console.log('user accepted');
			} else {
				// User dismissed the prompt
				console.log('user dismissed');
			}
		}

		deferredInstallEvent = undefined;
	}

	export let data;
</script>

<div class="min-h-screen flex flex-col justify-between max-w-screen bg-background">
	<Toaster position="bottom-right" />

	<div class="flex flex-col w-full h-full">
		<Navbar user={data.user} />
		<main
			in:fade
			class="w-full min-h-[calc(100vh-65px)] flex px-1.5 xs:px-2 sm:px-3 pt-1 sm:pt-2 pb-[65px] relative items-stretch"
		>
			<slot />
		</main>
		{#if deferredInstallEvent}
			<button class="btn btn-ghost" on:click={handleInstall}>Install</button>
		{/if}
	</div>
	<Footer />
</div>
