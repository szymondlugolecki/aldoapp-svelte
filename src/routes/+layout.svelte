<script lang="ts">
	import '../app.postcss';

	import Header from './(components)/header.svelte';
	import Footer from './(components)/footer.svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	import { onDestroy, onMount } from 'svelte';
	import { settings } from '$lib/client/stores/settings';
	import type { BeforeInstallPromptEvent } from '../app';
	import type { Unsubscriber } from 'svelte/store';
	import { Contact, Home, ShoppingCart } from 'lucide-svelte';
	import { cn } from '$lib/client/functions';
	import { page } from '$app/stores';
	import PhoneMenu from './(components)/phone-menu.svelte';
	import ScrollToTop from './(components)/scroll-to-top.svelte';
	import { inview } from 'svelte-inview';
	import type { ObserverEventDetails } from 'svelte-inview';

	let isInView: boolean;
	const inViewChange = ({ detail }: CustomEvent<ObserverEventDetails>) => {
		isInView = detail.inView;
	};

	let deferredInstallEvent: BeforeInstallPromptEvent | undefined = undefined;

	let unsubscribe: Unsubscriber | undefined;

	onMount(async () => {
		// window.addEventListener('beforeinstallprompt', (e) => {
		// 	console.log('before install prompt', e);
		// 	// e.preventDefault();
		// 	toast.success('Before install prompt!');
		// 	deferredInstallEvent = e as BeforeInstallPromptEvent;
		// });

		// $settings.theme = 'dark';

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

<Toaster position="bottom-right" />

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
