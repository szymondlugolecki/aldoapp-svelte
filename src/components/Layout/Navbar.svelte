<script lang="ts">
	import { page } from '$app/stores';
	import { roleColors, roleNames, salesmenMenu } from '$lib/client/constants';
	import { LogOut, User, Lock, Sun, Moon, Menu, ChevronDown } from 'lucide-svelte';
	import type { SessionUser } from '../../types';
	import Img from '@zerodevx/svelte-img';
	import logo from '$lib/assets/logo.png?run&width=55&height=40&format=webp';
	import logout from '$lib/client/functions/logout';
	import { nextTheme, theme } from '$lib/client/stores/theme';
	import MegaMenu from './MegaMenu.svelte';
	export let user: SessionUser | undefined;

	$: activeUrl = $page.url.pathname.toLowerCase();

	// If the parent menu is closed, close the submenu as well
	$: {
		if (menuOpen === false) {
			miniMenuExpanded = false;
		}
	}

	let menuOpen = false;
	let miniMenuExpanded = false;
</script>

<nav class="navbar bg-base-100 border-b border-base-content rounded flex flex-col relative">
	<div class="w-full h-full flex justify-between items-center">
		<div class="flex">
			<a href="/" class="btn btn-ghost normal-case text-lg sm:text-xl"
				><span class="mr-2">Twoje</span> <Img src={logo} /></a
			>
		</div>
		<div class="hidden space-x-6 md:flex justify-center items-center">
			<a class="hover:text-primary duration-150 {activeUrl === '/' ? 'text-primary' : ''}" href="/"
				>Strona główna</a
			>
			<a
				class="hover:text-primary duration-150 {activeUrl.startsWith('/sklep')
					? 'text-primary'
					: ''}"
				href="/sklep">Sklep</a
			>
			<div class="dropdown static">
				<label
					for="megamenu"
					tabindex="-1"
					class="hover:text-primary duration-150 flex items-center cursor-pointer {activeUrl.startsWith(
						'/kontakty/'
					)
						? 'text-primary'
						: ''}">Kontakty <ChevronDown size={20} class="ml-1" /></label
				>

				<MegaMenu />
			</div>
		</div>
		<div class="flex-none">
			<button on:click={nextTheme} tabindex="0" class="btn btn-ghost btn-circle">
				<div class="w-10 rounded-full flex justify-center items-center">
					{#if $theme === 'light'}
						<Sun class="text-amber-500" />
					{:else}
						<Moon class="text-sky-500" />
					{/if}
				</div>
			</button>
			<div class="dropdown dropdown-end">
				<label for="cart" tabindex="-1" class="btn btn-ghost btn-circle">
					<div class="indicator">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
							/></svg
						>
						<span class="badge badge-sm indicator-item">8</span>
					</div>
				</label>
				<div
					id="cart"
					tabindex="-1"
					class="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow"
				>
					<div class="card-body">
						<span class="font-bold text-lg">8 Items</span>
						<span class="text-info">Subtotal: $999</span>
						<div class="card-actions">
							<button class="btn btn-primary btn-block">View cart</button>
						</div>
					</div>
				</div>
			</div>
			{#if user}
				<div class="dropdown dropdown-end">
					<label for="user-menu" tabindex="-1" class="btn btn-ghost btn-circle ">
						<div class="w-10 rounded-full flex justify-center items-center">
							<User />
						</div>
					</label>
					<ul
						id="user-menu"
						tabindex="-1"
						class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
					>
						<li>
							<a href="/profile" class="justify-between">
								{user?.fullName}
								<span class="badge">New</span>
							</a>
						</li>
						<li><a href="/settings">Settings</a></li>
						<li><button on:click={() => logout()}>Logout</button></li>
					</ul>
				</div>
			{/if}
			<button
				on:click={() => (menuOpen = !menuOpen)}
				tabindex="0"
				class="btn btn-ghost btn-circle md:hidden"
			>
				<div class="w-10 rounded-full flex justify-center items-center">
					<Menu />
				</div>
			</button>
		</div>
	</div>
	{#if menuOpen}
		<div class="w-full flex flex-col justify-center items-start md:hidden mt-2">
			<a
				class="py-2 w-full hover:text-base-content rounded {activeUrl === '/' ? 'bg-primary' : ''}"
				href="/"
			>
				<span class="ml-2">Strona główna</span></a
			>
			<a
				class="py-2 w-full hover:text-base-content rounded {activeUrl.startsWith('/sklep')
					? 'bg-primary'
					: ''}"
				href="/sklep"><span class="ml-2">Sklep</span></a
			>
			<button
				class="py-2 w-full hover:text-base-content rounded text-left {activeUrl.startsWith(
					'/kontakty/'
				)
					? 'bg-primary text-base-content'
					: ''}"
				on:click={() => (miniMenuExpanded = !miniMenuExpanded)}
				><span class="ml-2 flex"
					>Kontakty <ChevronDown
						class="ml-1 {miniMenuExpanded ? 'rotate-0' : 'rotate-180'}"
					/></span
				></button
			>
			<div class="space-y-1 mt-1 w-full h-full flex flex-col justify-center items-start">
				{#if miniMenuExpanded}
					{#each salesmenMenu as element}
						<a
							href="/kontakty/{element.href}"
							class="{activeUrl === `/kontakty/${element.href}`
								? 'bg-secondary'
								: ''} w-full rounded border-b border-gray-700 pb-2 px-2 duration-150 py-1"
						>
							<h3 class="text-base leading-6 font-medium text-base-content">{element.name}</h3>
							<p class="text-sm">{element.description}</p>
						</a>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</nav>
