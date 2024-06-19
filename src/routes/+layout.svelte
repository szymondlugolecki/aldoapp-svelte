<script lang="ts">
	import '../app.postcss';

	import Header from './(components)/header.svelte';
	import Footer from './(components)/footer.svelte';
	// import toast, { Toaster } from 'svelte-french-toast';
	import { Toaster } from '$shadcn/sonner';
	import { ModeWatcher } from 'mode-watcher';

	import { onMount } from 'svelte';
	// import type { BeforeInstallPromptEvent } from '../app';
	import type { Unsubscriber } from 'svelte/store';
	import PhoneMenu from './(components)/phone-menu.svelte';
	import ScrollToTop from './(components)/scroll-to-top.svelte';
	import { inview } from 'svelte-inview';
	import type { ObserverEventDetails } from 'svelte-inview';
	import { toast } from 'svelte-sonner';
	import InstallPrompt from './(components)/install-prompt.svelte';
	import { browser } from '$app/environment';

	let isInView: boolean;
	const inViewChange = ({ detail }: CustomEvent<ObserverEventDetails>) => {
		isInView = detail.inView;
	};

	async function detectSWUpdate() {
		const registration = await navigator.serviceWorker.ready;

		registration.addEventListener('updatefound', () => {
			const newSW = registration.installing;
			newSW?.addEventListener('statechange', () => {
				if (newSW.state === 'installed') {
					newSW.postMessage({ type: 'SKIP_WAITING' });
					if (navigator.serviceWorker.controller) {
						// New content is available
						// toast('Nowsza wersja aplikacji jest dostępna!');
					} else {
						// Content is cached for offline use
						// toast('Aplikacja jest gotowa do pracy offline!');
						console.log('Zapisano aktywa strony do pamięci podręcznej.');
					}
				}
			});
		});
	}

	// This variable will save the event for later use.
	let deferredPrompt: BeforeInstallPromptEvent | undefined;

	if (browser) {
		window?.addEventListener('beforeinstallprompt', (e) => {
			// Prevents the default mini-infobar or install dialog from appearing on mobile
			e.preventDefault();
			// Save the event because you'll need to trigger it later.
			deferredPrompt = e;
		});
	}

	onMount(() => {
		detectSWUpdate();
	});

	// let deferredInstallEvent: BeforeInstallPromptEvent | undefined = undefined;
	// let unsubscribe: Unsubscriber | undefined;
	// onMount(async () => {
	// 	// window.addEventListener('beforeinstallprompt', (e) => {
	// 	// 	console.log('before install prompt', e);
	// 	// 	// e.preventDefault();
	// 	// 	toast.success('Before install prompt!');
	// 	// 	deferredInstallEvent = e as BeforeInstallPromptEvent;
	// 	// });
	// });

	// onDestroy(() => {
	// 	if (unsubscribe) {
	// 		unsubscribe();
	// 	}
	// });

	// async function handleInstall() {
	// 	if (deferredInstallEvent) {
	// 		deferredInstallEvent.prompt();
	// 		let choice = await deferredInstallEvent.userChoice;
	// 		if (choice.outcome === 'accepted') {
	// 			// User accepted to install the application
	// 			console.log('user accepted');
	// 		} else {
	// 			// User dismissed the prompt
	// 			console.log('user dismissed');
	// 		}
	// 	}

	// 	deferredInstallEvent = undefined;
	// }
	export let data;
</script>

<Toaster />

<ModeWatcher />
<div class="relative">
	<div
		class="absolute inset-0 h-screen -z-50"
		id="top"
		use:inview={{ rootMargin: '0px', unobserveOnEnter: false }}
		on:inview_change={inViewChange}
	/>
	<Header cart={data.cart} />
	<div class="min-h-screen pt-24 -mt-24"><slot /></div>
	<Footer />
	{#if !isInView}
		<ScrollToTop />
	{/if}
	<PhoneMenu />
</div>

{#if deferredPrompt}
	<InstallPrompt bind:deferredPrompt />
{/if}
