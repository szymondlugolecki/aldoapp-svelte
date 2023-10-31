<script lang="ts">
	import { page } from '$app/stores';
	import { salesmenMenu } from '$lib/client/constants';
	import {
		LogOut,
		User,
		Lock,
		Menu,
		ChevronDown,
		LogIn,
		Home,
		ShoppingCart,
		Contact,
		Settings
	} from 'lucide-svelte';
	import type { Cart } from '$types';
	// import Img from '@zerodevx/svelte-img';
	// import logo from '$lib/assets/logo.png?run&width=110&height=80&format=webp';
	import { slide } from 'svelte/transition';
	import { cn } from '$lib/client/functions';
	import Image from '$components/custom/Util/Image.svelte';
	import logo from '$lib/assets/logo.png?w=110&format=avif;webp;jpg&as=picture';

	import CartPreview from './cart-preview.svelte';
	import UserMenu from './user-menu.svelte';
	import { Button } from '$shadcn/button';

	$: activeUrl = $page.url.pathname.toLowerCase();

	export let cart: Cart | undefined;
</script>

<header class="sticky top-0 z-40 w-full bg-background">
	<div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
		<div class="w-full bg-background">
			<nav class="relative flex items-center justify-between w-full">
				<!-- Logo -->
				<div class="flex">
					<a href="/" class="text-lg normal-case btn btn-ghost sm:text-xl"
						><span class="mr-2">Twoje</span>
						<!-- <Img src={logo} height={40} width={55} alt="Logo ALDO" /> -->
						<Image meta={logo} alt="ALDO" sizes="55px" />
					</a>
				</div>
				<!-- High Viewport Navigation Menu -->
				<div class="items-center justify-center hidden space-x-6 md:flex">
					<a class={cn('transition-colors', activeUrl === '/' && 'text-blue-600')} href="/"
						>Strona główna</a
					>
					<a
						class={cn('transition-colors', activeUrl.startsWith('/sklep') && 'text-blue-600')}
						href="/sklep">Sklep</a
					>
					<div class="static dropdown">
						<label
							for="megamenu"
							tabindex="-1"
							class={cn(
								'transition-colors flex items-center cursor-pointer',
								activeUrl.startsWith('/kontakty') && 'text-blue-600'
							)}>Kontakty <ChevronDown size={20} class="ml-1" /></label
						>

						<!-- <MegaMenu /> -->
					</div>
				</div>

				<div class="flex-none flex items-center gap-1.5">
					<!-- Cart -->
					{#if $page.data.user}
						<CartPreview {cart} pathname={$page.url.pathname} />
					{/if}

					<!-- User Menu -->
					{#if $page.data.user}
						<UserMenu user={$page.data.user} />
					{:else}
						<Button href="/zaloguj" variant="default" class="mr-1">Zaloguj się</Button>
					{/if}
				</div>
			</nav>
		</div>
	</div>
</header>
