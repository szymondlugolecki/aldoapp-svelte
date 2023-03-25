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
	<h1 class="text-4xl sm:text-5xl font-bold mb-6 mt-4 text-center">Ustawienia</h1>

	<div class="overflow-x-auto">
		<table class="table w-full">
			<caption>Twoje ustawienia</caption>
			<!-- head -->
			<thead>
				<tr>
					<th>Nazwa</th>
					<th>Stan</th>
					<th>Zmiana stanu</th>
				</tr>
			</thead>
			<tbody>
				<!-- row 1 -->
				<tr>
					<th>Powiadomienia</th>
					<td>{subscribed ? 'Włączone 🟢' : 'Wyłączone 🔴'}</td>
					<td>
						<button
							class="btn btn-secondary text-white"
							on:click={() => {
								if (subscribed) unsubscribe();
								else subscribe();
							}}>{subscribed ? 'Wyłącz 😟' : 'Włącz 🙂'}</button
						>
					</td>
				</tr>
				<!-- row 2 -->
				<tr>
					<th>Motyw</th>
					<td>{themeNames[$settings.theme]}</td>
					<td><button class="btn btn-secondary" on:click={() => nextTheme()}>Zmień tryb</button></td
					>
				</tr>
				<!-- row 3 -->
				<tr>
					<th>Brice Swyre</th>
					<td>Tax Accountant</td>
					<td>Red</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
