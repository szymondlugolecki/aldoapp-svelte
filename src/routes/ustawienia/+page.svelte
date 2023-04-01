<script lang="ts">
	import { subscribe, unsubscribe } from '$lib/client/functions/push';
	import { nextTheme, settings, themeNames } from '$lib/client/stores/settings';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	let subscribed = false;

	const subscribedCheck = async () => {
		const registration = await navigator.serviceWorker.getRegistration();
		if (!registration) return;
		const subscription = await registration.pushManager.getSubscription();
		if (!subscription) return;

		subscribed = true;
	};

	onMount(() => {
		subscribedCheck();
	});

	const sendMeANotification = async () => {
		const response = await fetch('/api/push/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: 'Test',
				options: {
					body: 'Test'
				}
			})
		});

		const data = await response.json();

		if (response.ok) {
			toast.success(data.message);
		} else {
			toast.error(data.message);
		}
	};
</script>

<svelte:head>
	<title>Ustawienia • Twoje ALDO</title>
	<meta name="description" content="Ustawienia. Włącz powiadomienia. Zmień motyw." />
</svelte:head>

<div class="w-full h-full">
	<h1 class="text-3xl sm:text-3xl font-bold mb-3 mt-2 text-center">Ustawienia</h1>

	<div class="overflow-x-auto">
		<table class="table w-full table-compact xs:table-normal">
			<!-- head -->
			<thead>
				<tr>
					<th>Nazwa</th>
					<th>Stan</th>
					<th>Akcja</th>
				</tr>
			</thead>
			<tbody>
				<!-- row 1 -->
				<tr class="text-xs xxs:text-sm">
					<td>Powiadomienia</td>
					<td>{subscribed ? 'Włączone 🟢' : 'Wyłączone 🔴'}</td>
					<td>
						<button
							class="btn btn-secondary btn-sm"
							on:click={() => {
								if (subscribed) unsubscribe().then(() => (subscribed = false));
								else subscribe().then(() => (subscribed = true));
							}}>{subscribed ? 'Wyłącz' : 'Włącz'}</button
						>
					</td>
				</tr>
				<!-- row 2 -->
				<tr class="text-xs xxs:text-sm">
					<td>Motyw</td>
					<td>{themeNames[$settings.theme]}</td>
					<td
						><button class="btn btn-secondary btn-sm" on:click={() => nextTheme()}
							>Zmień tryb</button
						></td
					>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<style>
	.table th:first-child {
		position: static;
	}
</style>
