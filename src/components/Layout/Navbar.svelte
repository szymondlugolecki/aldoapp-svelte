<script lang="ts">
	import { page } from '$app/stores';
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
	import { LogOut, Settings, ShoppingCart, History, Lock } from 'lucide-svelte';
	import type { Role, RoleColor } from '../../types';

	let shopMenu = [
		{
			name: 'Pasze i koncentraty dla bydła',
			description: 'Wolne od GMO',
			locations: ['Online', 'Surowe']
		},
		{
			name: 'Pasze dla trzody chlewnej',
			description: 'Wolne od GMO',
			locations: ['Online', 'Surowe']
		},
		{
			name: 'Pasze dla drobiu',
			description: 'Wolne od GMO',
			locations: ['Online', 'Surowe']
		},
		{
			name: 'Dodatki i surowce żywieniowe',
			description: 'Wolne od GMO',
			locations: ['Online', 'Surowe']
		}
	];

	let salesmenMenu = [
		{
			name: 'Dział pasz',
			description: 'Pasze dla bydła, drobiu i trzody chlewnej. Bez GMO',
			locations: ['Surowe']
		},
		{
			name: 'Market',
			description: 'Hurtownia rolnicza. Części rolnicze. Zamienniki',
			locations: ['Myszyniec', 'Surowe', 'Ełk']
		},
		{
			name: 'Serwis',
			description:
				'Wsparcie serwisowe. Części zamienne. Przegląd w autoryzowanym punkcie Kubota i Kverneland',
			locations: ['Myszyniec', 'Surowe', 'Ełk']
		},

		{
			name: 'Dział maszyn',
			description: 'Wysokiej jakości maszyny rolnicze i komunalne renomowanych marek',
			locations: ['Myszyniec', 'Wójtowo', 'Ełk']
		},
		{
			name: 'Komis maszyn',
			description: 'Używany sprzęt wysokiej klasy w świetnym stanie technicznym',
			locations: ['Myszyniec']
		},
		{ name: 'Stacja paliw', description: 'Zatankuj na naszej stacji paliw', locations: ['Surowe'] }
	];

	const roleNames: Record<Role, string> = {
		customer: 'Klient',
		moderator: 'Moderator',
		admin: 'Admin'
	};
	const roleColors: Record<Role, RoleColor> = {
		customer: 'blue',
		moderator: 'green',
		admin: 'red'
	};

	$: activeUrl = $page.url.pathname.toLowerCase();

	export let userRole: Role;
	export let loggedIn: boolean;
</script>

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<span
			class="ml-1 sm:ml-0 self-center whitespace-nowrap text-xl font-semibold dark:text-white mr-2 sm:mr-3 "
			>Twoje</span
		>
		<img src="/logo.png" class="h-8 sm:h-9" alt="Logo ALDO" />
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
					defaultClass="font-semibold text-red-500 py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
					><Lock class="mr-2" />
					Panel administracyjny</DropdownItem
				>
			{/if}

			<DropdownItem
				defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
			>
				<ShoppingCart class="mr-2" />
				Koszyk</DropdownItem
			>
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
		<NavLi
			activeClass="cursor-pointer text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
			nonActiveClass="cursor-pointer text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
			active={activeUrl.startsWith('/sklep')}><Chevron aligned>Sklep</Chevron></NavLi
		>
		<MegaMenu items={shopMenu} let:item>
			<a href="/" class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 h-full">
				<div class="font-semibold dark:text-white">{item.name}</div>
				<span class="text-sm font-light text-gray-500 dark:text-gray-400">{item.description}</span>
				<span class="block text-sm font-light text-gray-500 dark:text-gray-400"
					>Punkty: {item.locations.join(', ')}</span
				>
			</a>
		</MegaMenu>
		<NavLi
			activeClass="cursor-pointer text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
			nonActiveClass="cursor-pointer text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
			active={activeUrl.startsWith('/sprzedawcy')}><Chevron aligned>Sprzedawcy</Chevron></NavLi
		>
		<MegaMenu items={salesmenMenu} let:item>
			<a href="/" class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 h-full">
				<div class="font-semibold dark:text-white">{item.name}</div>
				<span class="text-sm font-light text-gray-500 dark:text-gray-400">{item.description}</span>
				<span class="block text-sm font-light text-gray-500 dark:text-gray-400"
					>Punkty: {item.locations.join(', ')}</span
				>
			</a>
		</MegaMenu>
		<NavLi href="/kontakt" active={activeUrl === '/kontakt'}>Kontakt</NavLi>
	</NavUl>
</Navbar>
