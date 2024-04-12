<script lang="ts">
	import toast from 'svelte-french-toast';
	import { base64StringToUint8Arr, getRegistration } from '$lib/client/functions/api/push.js';
	import { getContext, onMount } from 'svelte';
	import { Button } from '$components/ui/button/index.js';
	import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
	import { pushSubscription$ } from '$lib/client/schemas';
	import * as Form from '$shadcn/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { SubscribeForm } from '$lib/client/schemas/pushSubscription';
	import { superForm, type FormOptions } from 'sveltekit-superforms/client';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	// import type { PushSubscription as PushSubscriptionWithKeys } from 'web-push-edge';

	let subscribeForm: SuperValidated<SubscribeForm>;
	export { subscribeForm as form };
	const { form, enhance, submitting } = superForm(subscribeForm, {
		onResult: async ({ result }) => {
			if (result.type !== 'success') {
				console.error(
					'Powiadomienia Push zostały włączone, ale nie zostały zapisane w bazie danych. Spróbuj ponownie'
				);
				// This is a problem
				// Despite locally subscribing to push notifications
				// They were not saved to the db

				// So we need to unsubscribe locally
				// await requestSubscriptionRemoval();
				toast.error('Spróbuj ponownie');
			} else {
				toast.success('Sukces');
			}
			await getSubscription();
		},
		onSubmit: async ({ cancel, formData }) => {
			const success = await requestSubscription();
			if (!success) {
				toast.error('Form: Niepowodzenie');
				return cancel();
			}

			const subscription = await getSubscription();
			if (!subscription) {
				toast.error('Form: Niepowodzenie');
				return cancel();
			}

			const { keys } = subscription.toJSON() as PushSubscriptionJSON;

			subscription.endpoint && formData.append('endpoint', subscription.endpoint);
			subscription.expirationTime &&
				formData.append('expirationTime', subscription.expirationTime.toString());
			keys?.auth && formData.append('auth', keys.auth);
			keys?.p256dh && formData.append('p256dh', keys.p256dh);
		}
	});
	export let subscriptionExists: boolean;
	export let getSubscription: () => Promise<PushSubscription | undefined>;

	onMount(async () => {
		// loading = true;
		await getSubscription();
		// loading = false;
	});

	const requestNotificationPermission = async () => {
		const result = await Notification.requestPermission();

		if (result === 'granted') {
			return true;
		}

		if (result === 'denied') {
			toast.error('Nie zezwolono na powiadomienia', { duration: 3000 });
		}

		return false;
	};

	const requestSubscription = async () => {
		// Clicked on subscribe
		const granted = await requestNotificationPermission();
		if (!granted) {
			toast.error('Odmówiono dostępu do powiadomień');
			return false;
		}

		if (!('Notification' in window)) {
			alert('Twoja przeglądarka nie wspiera powiadomień');
			return false;
		}

		const registration = await getRegistration();
		if (!registration) {
			return false;
		}

		// Check if subscription already exists
		const subscription = await registration.pushManager.getSubscription();
		if (subscription) {
			toast.error('Masz już włączone powiadomienia');
			return false;
		}

		// Create new sub, refresh and save to db
		if (Notification.permission === 'granted') {
			const newSubscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: base64StringToUint8Arr(PUBLIC_VAPID_PUBLIC_KEY)
			});
			if (newSubscription) {
				await getSubscription();
				return true;
			}
		}

		// Wants to subscribe but has previously denied access
		if (Notification.permission !== 'denied') {
			// Request permission
			const permission = await Notification.requestPermission();
			if (permission === 'granted') {
				const newSubscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: base64StringToUint8Arr(PUBLIC_VAPID_PUBLIC_KEY)
				});
				if (newSubscription) {
					await getSubscription();
					return true;
				}
			} else {
				toast.error('Odmówiono dostępu do powiadomień');
			}
		}
		return false;
	};
</script>

{#if !subscriptionExists}
	<form action="?/subscribe" method="post" use:enhance>
		<Form.Button disabled={$submitting}>
			{#if $submitting}
				<Spinner />
			{:else}
				Włącz
			{/if}
		</Form.Button>
	</form>
{/if}
