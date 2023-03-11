<script lang="ts">
	import { page } from '$app/stores';
	import { roleColors, roleNames, salesmenMenu, shopMenu } from '$lib/client/constants';
	import { Avatar, Badge, Button, MegaMenu } from 'flowbite-svelte';
	import { LogOut, User, Lock } from 'lucide-svelte';
	import type { SessionUser } from '../../types';
	import Img from '@zerodevx/svelte-img';
	import {
		Navbar,
		NavBrand,
		NavHamburger,
		NavUl,
		NavLi,
		Chevron,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownDivider
	} from 'flowbite-svelte';

	import logo from '$lib/assets/logo.png?run&width=68&height=50&format=webp';
	import { invalidate } from '$app/navigation';

	export let user: SessionUser | undefined;

	$: activeUrl = $page.url.pathname.toLowerCase();

	// let menuMenuHidden: boolean = true;
	let userMenuHidden = true;
</script>

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<span
			class="ml-1 sm:ml-0 self-center whitespace-nowrap text-xl font-semibold dark:text-white mr-1 sm:mr-2"
			>Twoje</span
		>
		<Img src={logo} alt="Logo ALDO" />

		<!-- <img src="/logo.png" class="h-9 sm:h-11" width="60px" alt="Logo ALDO" /> -->
	</NavBrand>
	<div class="flex items-center md:order-2">
		{#if user}
			<button class="rounded-full" on:click={() => (userMenuHidden = !userMenuHidden)}>
				<span class="sr-only">Otwórz menu użytkownika</span>
				<Avatar id="avatar-menu" border />
			</button>
		{:else}
			<Button href="/login" gradient color="pinkToOrange">Zaloguj się</Button>
		{/if}
		<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
	</div>
	{#if user}
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			<DropdownHeader>
				<Badge large color={roleColors[user.role]}>{roleNames[user.role]}</Badge>
				<span class="block text-sm text-gray-900 dark:text-white">{user.fullName}</span>
				<span class="block text-sm font-medium text-gray-500 truncate dark:text-gray-400"
					>{user.email}</span
				>
			</DropdownHeader>
			{#if ['admin', 'moderator'].includes(user.role)}
				<DropdownItem
					href="/admin"
					defaultClass="flex justify-start font-semibold text-red-500 p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
					><Lock class="mr-2" />
					Panel admina</DropdownItem
				>
			{/if}
			<DropdownItem
				defaultClass="flex justify-start p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
				><User class="mr-2" /> Mój profil</DropdownItem
			>
			<DropdownDivider />
			<DropdownItem
				on:click={() => {
					fetch('/api/logout', {
						method: 'POST',
						credentials: 'include'
					})
						.then((response) => response.json())
						.then((data) => {
							console.log('data', data);
						})
						.finally(() => {
							invalidate('session');
						});
				}}
				defaultClass="flex justify-start p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
				><LogOut class="mr-2" /> Wyloguj</DropdownItem
			>
		</Dropdown>
	{/if}
	<NavUl {hidden}>
		<NavLi
			activeClass="cursor-pointer text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
			nonActiveClass="cursor-pointer text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
			active={activeUrl === '/'}
			href="/">Strona główna</NavLi
		>
		<NavLi
			activeClass="cursor-pointer text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
			nonActiveClass="cursor-pointer text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
			active={activeUrl.startsWith('/sklep')}
			href="/sklep">Sklep</NavLi
		>
		<NavLi
			activeClass="cursor-pointer text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
			nonActiveClass="cursor-pointer text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
			active={activeUrl.startsWith('/kontakty')}><Chevron aligned>Kontakty</Chevron></NavLi
		>
		<MegaMenu items={salesmenMenu} let:item>
			<a
				href={`/kontakty/${item.href}`}
				class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 h-full"
			>
				<div class="font-semibold dark:text-white">{item.name}</div>
				<span class="text-sm font-light text-gray-500 dark:text-gray-400">{item.description}</span>
				<span class="block text-sm font-light text-gray-500 dark:text-gray-400"
					>Punkty: {item.locations.join(', ')}</span
				>
			</a>
		</MegaMenu>
	</NavUl>
</Navbar>
