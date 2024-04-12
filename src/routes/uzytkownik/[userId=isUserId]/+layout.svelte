<script lang="ts">
	import Alert from '$components/custom/Alerts/Alert.svelte';
	import { roleColors, roleNames } from '$lib/client/constants/index.js';
	import { cn, dateParser, isAtLeastModerator } from '$lib/client/functions/index.js';
	import { onMount } from 'svelte';
	import type { Order } from '$types';
	import { createAvatar, createTabs, melt } from '@melt-ui/svelte';
	import TabsList from '$components/custom/Layout/AdminTabs/TabsList.svelte';
	import Tab from '$components/custom/Layout/AdminTabs/Tab.svelte';
	import TabsContent from '$components/custom/Layout/AdminTabs/TabsContent.svelte';
	import { page } from '$app/stores';

	export let data;

	const {
		elements: { image: imageB, fallback: fallbackB }
	} = createAvatar({
		src: ''
	});

	const initials = data.profile.fullName
		.split(' ')
		.map((name) => name[0])
		.join('')
		.slice(0, 2);

	const {
		elements: { root, list, content, trigger }
	} = createTabs();

	$: pathname = $page.url.pathname;

	$: pathUser = pathname.split('/')[2];
</script>

<svelte:head>
	<title>{data.profile.fullName} • Twoje ALDO</title>
	<meta name="description" content="Profil użytkownika {data.profile.fullName}" />
</svelte:head>

<div class="flex flex-col w-full px-8 pb-24">
	<section class="flex items-center w-full gap-4 py-5">
		<div class="flex items-center justify-center w-16 rounded-full aspect-square bg-muted">
			<img use:melt={$imageB} alt="Avatar" class="h-full w-full rounded-[inherit]" />
			<span use:melt={$fallbackB} class="mb-0.5 text-2xl font-medium sm:text-3xl">{initials}</span>
		</div>
		<div class="flex flex-col gap-2">
			<h1 class="text-3xl font-bold tracking-tight scroll-m-20 sm:text-3xl lg:text-4xl">
				{data.profile.fullName}
			</h1>
			<span class={cn('rounded-xl px-3 py-1 w-fit text-sm', roleColors[data.profile.role])}
				>{roleNames[data.profile.role]}</span
			>
		</div>
	</section>
	<div class="flex flex-col w-full h-full gap-y-4">
		<div>
			<TabsList>
				<Tab {pathname} href="/uzytkownik/{pathUser}">Informacje</Tab>
				<Tab {pathname} href="/uzytkownik/{pathUser}/zamowienia">Zamówienia</Tab>
				{#if data.user && isAtLeastModerator(data.user.role)}
					<Tab {pathname} href="/uzytkownik/{pathUser}/inne">Inne</Tab>
				{/if}
			</TabsList>
		</div>
		<TabsContent class="">
			<slot />
		</TabsContent>
	</div>
</div>
