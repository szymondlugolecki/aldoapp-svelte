<script lang="ts">
	import { page } from '$app/stores';
	import { roleColors, roleNames, salesmenMenu, shopMenu } from '$lib/client/constants';
	import { capitalize } from '$lib/client/functions';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownDivider,
		Badge,
		Button,
		Chevron,
		MegaMenu
	} from 'flowbite-svelte';
	import { LogOut, Settings, History, Lock } from 'lucide-svelte';
	import type { Role } from '../../types';

	$: activeUrl = $page.url.pathname.toLowerCase();

	export let userRole: Role;
	export let loggedIn: boolean;
</script>

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<span
			class="ml-1 sm:ml-0 self-center whitespace-nowrap text-xl font-semibold dark:text-white mr-1 sm:mr-2"
			>Twoje</span
		>
		<img src="/logo.png" class="h-9 sm:h-11" alt="Logo ALDO" />
	</NavBrand>

	<div class="flex items-center md:order-2">
		{#if loggedIn}
			<button class="rounded-full">
				<Avatar id="avatar-menu" border />
			</button>
		{:else}
			<Button gradient color="pinkToOrange">Zaloguj się</Button>
		{/if}
		<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
	</div>
	<!-- User Dropdown -->
	{#if loggedIn}
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			<DropdownHeader>
				<Badge large color={roleColors[userRole]}>{roleNames[userRole]}</Badge>
				<span class="block text-sm"> Szymon Długołęcki </span>
				<span class="block truncate text-sm font-medium"> szymon.dlugolecki@aldo.agro.pl </span>
			</DropdownHeader>
			{#if userRole === 'admin'}
				<DropdownItem
					href="/admin"
					defaultClass="font-semibold text-red-400 py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
					><Lock class="mr-2" />
					Panel administracyjny</DropdownItem
				>
			{/if}

			<!-- <DropdownItem
				defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
			>
				<ShoppingCart class="mr-2" />
				Koszyk</DropdownItem
			> -->
			<DropdownItem
				defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
			>
				<History class="mr-2" />
				Historia zamówień</DropdownItem
			>
			<DropdownItem
				defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
			>
				<Settings class="mr-2" href="settings" /> Ustawienia</DropdownItem
			>
			<DropdownDivider />
			<DropdownItem
				defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
				><LogOut class="mr-2" /> Wyloguj się
			</DropdownItem>
		</Dropdown>
	{/if}
	<NavUl {hidden}>
		<NavLi href="/" active={activeUrl === '/'}>Strona główna</NavLi>
		<NavLi href="/sklep" active={activeUrl.startsWith('/sklep')}>Sklep</NavLi>
		<NavLi
			activeClass="cursor-pointer text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
			nonActiveClass="cursor-pointer text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
			active={activeUrl.startsWith('/sprzedawcy')}><Chevron aligned>Kontakty</Chevron></NavLi
		>
		<MegaMenu items={salesmenMenu} let:item>
			<a
				href={`/sprzedawcy/${item.href}`}
				class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 h-full"
			>
				<div class="font-semibold dark:text-white">{item.name}</div>
				<span class="text-sm font-light text-gray-500 dark:text-gray-400">{item.description}</span>
				<span class="block text-sm font-light text-gray-500 dark:text-gray-400"
					>Punkty: {item.locations.map((loc) => capitalize(loc)).join(', ')}</span
				>
			</a>
		</MegaMenu>
	</NavUl>
</Navbar>
