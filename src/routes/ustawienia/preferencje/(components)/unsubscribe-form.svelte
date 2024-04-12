<script lang="ts">
	import toast from 'svelte-french-toast';
	import { base64StringToUint8Arr, getRegistration } from '$lib/client/functions/api/push.js';
	import { onMount } from 'svelte';
	import { Button } from '$components/ui/button/index.js';
	import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
	import { pushSubscription$ } from '$lib/client/schemas';
	import * as Form from '$shadcn/form/';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { UnsubscribeForm } from '$lib/client/schemas/pushSubscription';
	import { superForm, type FormOptions } from 'sveltekit-superforms/client';
	import Spinner from '$components/custom/Util/Spinner.svelte';

	let subscribeForm: SuperValidated<UnsubscribeForm>;
	export { subscribeForm as form };
	const { form, enhance, submitting } = superForm(subscribeForm, {
		onResult: async ({ result }) => {
			if (result.type !== 'success') {
				console.error('Usunięto subskrypcję push, ale nie udało się jej usunąć z bazy danych');
			} else {
				toast.success('Sukces');
			}
			await getSubscription();
		},
		onSubmit: async ({ cancel, formData, action }) => {
			const success = await requestSubscriptionRemoval();
			formData.append('allDevices', false.toString());
			if (!success) {
				toast.error('Form: Niepowodzenie');
				return cancel();
			}
		}
	});

	export let subscriptionExists: boolean;
	export let getSubscription: () => Promise<PushSubscription | undefined>;
	// export let loading = true;

	onMount(async () => {
		// loading = true;
		await getSubscription();
		// loading = false;
	});

	const requestSubscriptionRemoval = async () => {
		// Clicked on unsubscribe
		if (!('Notification' in window)) {
			alert('Twoja przeglądarka nie wspiera powiadomień');
			return false;
		}

		const registration = await getRegistration();
		if (!registration) {
			return false;
		}

		// Make sure subscription exists
		const subscription = await registration.pushManager.getSubscription();
		if (!subscription) {
			toast.error('Masz masz włączonych powiadomień');
			return false;
		}

		// Unsubscribe locally, refresh and update the db
		const unsubscribed = await subscription.unsubscribe();
		if (unsubscribed) {
			await getSubscription();
			return true;
		} else {
			toast.error('Nie udało się wyłączyć powiadomień');
		}
		return false;
	};
</script>

{#if subscriptionExists}
	<form action="?/unsubscribe" method="post" use:enhance>
		{#if $submitting}
			<Spinner />
		{:else}
			<Form.Button disabled={$submitting}>Wyłącz</Form.Button>
		{/if}
	</form>
{/if}
