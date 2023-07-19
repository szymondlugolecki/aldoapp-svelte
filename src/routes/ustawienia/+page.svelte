<script lang="ts">
	import { subscribe, unsubscribe } from '$lib/client/functions/api/push';
	import { settings } from '$lib/client/stores/settings';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import {
		Table,
		TableBody,
		TableCaption,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$shadcn/table';
	import { cn, flexRender } from '$lib/client/functions';
	import Switch from '$meltui/Switch.svelte';
	import Spinner from '$components/Spinner.svelte';
	import { sleep } from '@melt-ui/svelte/internal/helpers';
	import Address from '$components/Dialogs/Settings/Address.svelte';
	import { page } from '$app/stores';
	import type { User } from '$types';

	export let data;

	let subscribed: boolean | null = null;

	const isSubscribedCheck = async () => {
		await sleep(1_000);

		const registration = await navigator.serviceWorker.getRegistration();
		if (!registration) return false;
		const subscription = await registration.pushManager.getSubscription();
		if (!subscription) return false;

		return true;
	};

	// const sendMeANotification = async () => {
	// 	const response = await fetch('/api/push/send', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({
	// 			title: 'Test',
	// 			options: {
	// 				body: 'Test'
	// 			}
	// 		})
	// 	});

	// 	const data = await response.json();

	// 	if (response.ok) {
	// 		toast.success(data.message);
	// 	} else {
	// 		toast.error(data.message);
	// 	}
	// };

	const themeSwitchChange = (isChecked: boolean) => {
		if (isChecked) {
			$settings.theme = 'dark';
		} else {
			$settings.theme = 'light';
		}
	};

	let awaitingResponse = false;

	const notificationsToggle = async (isChecked: boolean) => {
		awaitingResponse = true;
		if (isChecked) {
			const { subscribed: sub } = await subscribe();
			awaitingResponse = false;
			subscribed = sub;
			return sub;
		} else {
			const { subscribed: sub } = await unsubscribe();
			awaitingResponse = false;
			subscribed = sub;
			return sub;
		}
	};

	const emptyAddress: User['address'] = {
		city: '',
		street: '',
		zipCode: ''
	};
</script>

<svelte:head>
	<title>Ustawienia • Twoje ALDO</title>
	<meta name="description" content="Ustawienia. Włącz powiadomienia. Zmień motyw." />
</svelte:head>

<div class="h-full w-full flex justify-center items-center">
	<div class="p-4 border border-border rounded-lg">
		<Table>
			<TableCaption>Ustawienia</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead class="w-[100px]">Nazwa</TableHead>
					<TableHead class="w-[500px]">Opis</TableHead>
					<TableHead>Wartość</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell class="font-medium">Tryb ciemny</TableCell>
					<TableCell>Zmień motyw kolorystyczny aplikacji</TableCell>
					<TableCell>
						<Switch defaultChecked={$settings.theme === 'dark'} onChange={themeSwitchChange} />
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell class="font-medium">Powiadomienia</TableCell>
					<TableCell
						>Powiadomienia Push służą do powiadamiania Cię o zmianach w statusie zamówienia i o
						specjalnych ofertach</TableCell
					>
					<TableCell>
						{#await isSubscribedCheck()}
							<Spinner />
						{:then exists}
							{#if awaitingResponse}
								<Spinner />
							{:else}
								<Switch
									defaultChecked={typeof subscribed === 'boolean' ? subscribed : exists}
									onChange={notificationsToggle}
									loading={awaitingResponse}
								/>
							{/if}
						{/await}
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell class="font-medium">Adres dostawy</TableCell>
					<TableCell
						>Zmień domyślny adres dostawy. Możesz też go zmienić jednorazowo przy składaniu
						zamówienia</TableCell
					>
					<TableCell>
						<Address address={data.address || emptyAddress} />
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>

		<!-- <button on:click={() => sendMeANotification()}> Wyślij powiadomienie </button> -->
	</div>
</div>
