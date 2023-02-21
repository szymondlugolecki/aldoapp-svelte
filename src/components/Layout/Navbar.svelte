<script lang="ts">
	import { page } from '$app/stores';
	import { roleColors, roleNames, salesmenMenu, shopMenu } from '$lib/client/constants';
	import { capitalize } from '$lib/client/functions';
	import { Avatar, Badge } from 'flowbite-svelte';
	import { LogOut, User, Lock } from 'lucide-svelte';
	import type { Role, SessionUser } from '../../types';

	$: activeUrl = $page.url.pathname.toLowerCase();

	export let user: SessionUser | undefined;

	const dropDownItems = [
		{
			type: 'link',
			name: 'Panel administracyjny',
			href: '/admin',
			Icon: Lock,
			modOnly: true
		},
		{
			type: 'link',
			name: 'Mój profil',
			href: `/uzytkownik/${user?.id}`,
			Icon: History
		},
		{
			type: 'button',
			name: 'Wyloguj',
			onClick: () => {},
			Icon: LogOut
		}
	];

	let menuMenuHidden: boolean = true;
	let userMenuHidden: boolean = true;
</script>

<!-- <nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
	<div class="container flex flex-wrap items-center justify-between mx-auto">
		<div class="flex relative items-center md:order-2">
			{#if user}
				<button class="rounded-full" on:click={() => (userMenuHidden = !userMenuHidden)}>
					<span class="sr-only">Open user menu</span>
					<Avatar id="avatar-menu" border />
				</button>
				{#if !userMenuHidden}
					<div
						class="z-50 absolute top-10 right-[-.5rem] right- my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
					>
						<div class="px-4 py-3">
							<Badge large color={roleColors[user.role]}>{roleNames[user.role]}</Badge>
							<span class="block text-sm"> Szymon Długołęcki </span>
							<span class="block truncate text-sm font-medium">
								szymon.dlugolecki@aldo.agro.pl
							</span>
						</div>
						<ul class="py-2" aria-labelledby="user-menu-button">
							{#each dropDownItems as { type, name, Icon, modOnly, href, onClick }}
								{#if true}
									<li>
										{#if type === 'link'}
											<a
												{href}
												class={`text-left flex justify-start items-center px-4 py-2 text-sm ${
													modOnly ? 'text-red-500' : ''
												} hover:bg-gray-100 dark:hover:bg-gray-600`}
												><Icon class={`mr-2 ${modOnly ? 'text-red-500' : ''}`} /> {name}</a
											>
										{/if}
										{#if type === 'button'}
											<button
												on:click={onClick}
												class={`w-full text-left flex justify-start items-center px-4 py-2 text-sm ${
													modOnly ? 'text-red-500' : ''
												} hover:bg-gray-100 dark:hover:bg-gray-600`}
												><Icon class={`mr-2 ${modOnly ? 'text-red-500' : ''}`} /> {name}</button
											>
										{/if}
									</li>
								{/if}
							{/each}
						</ul>
					</div>
				{/if}
			{:else}
				<Button gradient color="pinkToOrange">Zaloguj się</Button>
			{/if}
		</div>
	</div>
</nav> -->

<nav class="bg-white border-gray-200 dark:border-gray-600 dark:bg-gray-900">
	<div
		class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5"
	>
		<!-- Logo -->
		<a href="/" class="flex items-center">
			<span
				class="ml-1 sm:ml-0 self-center whitespace-nowrap text-xl font-semibold dark:text-white mr-1 sm:mr-2"
				>Twoje</span
			>
			<img src="/logo.png" class="h-9 sm:h-11" alt="Logo ALDO" />
		</a>
		<!-- Main Menu - Navbar -->
		<div id="mega-menu-full" class="items-center justify-between hidden w-full md:flex md:w-auto">
			<ul
				class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
			>
				<li>
					<a
						href="/"
						class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
						aria-current="page">Home</a
					>
				</li>
				<li>
					<button
						id="mega-menu-full-dropdown-button"
						on:click={() => (menuMenuHidden = !menuMenuHidden)}
						class="flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-gray-700 rounded md:w-auto hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-gray-400 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
						>Company <svg
							class="w-5 h-5 ml-1"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							><path
								fill-rule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/></svg
						></button
					>
				</li>
				<li>
					<a
						href="/"
						class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
						>Marketplace</a
					>
				</li>
				<li>
					<a
						href="/"
						class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
						>Resources</a
					>
				</li>
				<li>
					<a
						href="/"
						class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
						>Contact</a
					>
				</li>
			</ul>
		</div>

		<!-- Avatar & User Menu Button -->
		<div class="flex justify-center items-center">
			<button
				on:click={() => (menuMenuHidden = !menuMenuHidden)}
				type="button"
				class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
				aria-controls="mega-menu-full"
				aria-expanded="false"
			>
				<span class="sr-only">Otwórz główne menu</span>
				<svg
					class="w-6 h-6"
					aria-hidden="true"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
			{#if user}
				<div class="flex">
					<button class="rounded-full" on:click={() => (userMenuHidden = !userMenuHidden)}>
						<span class="sr-only">Open user menu</span>
						<Avatar id="avatar-menu" border />
					</button>
					{#if !userMenuHidden}
						<div
							class="max-w-[220px] absolute top-11 right-1 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
							id="user-dropdown"
						>
							<div class="px-4 py-3">
								<Badge large color={roleColors[user.role]}>{roleNames[user.role]}</Badge>
								<span class="block text-sm text-gray-900 dark:text-white">{user.fullName}</span>
								<span class="block text-sm font-medium text-gray-500 truncate dark:text-gray-400"
									>{user.email}</span
								>
							</div>
							<ul class="py-2" aria-labelledby="user-menu-button">
								{#if ['admin', 'moderator'].includes(user.role)}
									<li>
										<a
											href="/admin"
											class={`w-full text-left flex justify-start items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600`}
											><Lock class="mr-2 text-red-500" /> Panel administracyjny</a
										>
									</li>
								{/if}
								<li>
									<a
										href={`/uzytkownik/${user.id}`}
										class="flex justify-start items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
										><User class="mr-2" /> Mój profil</a
									>
								</li>

								<li class="h-0 w-full px-3 my-2">
									<div class="border-t border-gray-300 border-dashed" />
								</li>

								<li>
									<button
										on:click={() => {
											// should submit a logout form here!
										}}
										class="w-full flex justify-start items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
										><LogOut class="mr-2" /> Wyloguj</button
									>
								</li>
							</ul>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
	<!-- Kontakty Menu -->
	{#if !menuMenuHidden}
		<div
			id="mega-menu-full-dropdown"
			class="mt-1 border-gray-200 shadow-sm bg-gray-50 md:bg-white border-y dark:bg-gray-800 dark:border-gray-600"
		>
			<div
				class="grid max-w-screen-xl px-4 py-5 mx-auto text-gray-900 dark:text-white sm:grid-cols-2 md:px-6"
			>
				<ul>
					<li>
						<a href="/" class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
							<div class="font-semibold">Online Stores</div>
							<span class="text-sm font-light text-gray-500 dark:text-gray-400"
								>Connect with third-party tools that you're already using.</span
							>
						</a>
					</li>
					<li>
						<a href="/" class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
							<div class="font-semibold">Segmentation</div>
							<span class="text-sm font-light text-gray-500 dark:text-gray-400"
								>Connect with third-party tools that you're already using.</span
							>
						</a>
					</li>
					<li>
						<a href="/" class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
							<div class="font-semibold">Marketing CRM</div>
							<span class="text-sm font-light text-gray-500 dark:text-gray-400"
								>Connect with third-party tools that you're already using.</span
							>
						</a>
					</li>
				</ul>
				<ul>
					<li>
						<a href="/" class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
							<div class="font-semibold">Online Stores</div>
							<span class="text-sm font-light text-gray-500 dark:text-gray-400"
								>Connect with third-party tools that you're already using.</span
							>
						</a>
					</li>
					<li>
						<a href="/" class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
							<div class="font-semibold">Segmentation</div>
							<span class="text-sm font-light text-gray-500 dark:text-gray-400"
								>Connect with third-party tools that you're already using.</span
							>
						</a>
					</li>
					<li>
						<a href="/" class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
							<div class="font-semibold">Marketing CRM</div>
							<span class="text-sm font-light text-gray-500 dark:text-gray-400"
								>Connect with third-party tools that you're already using.</span
							>
						</a>
					</li>
				</ul>
			</div>
		</div>
	{/if}
</nav>
