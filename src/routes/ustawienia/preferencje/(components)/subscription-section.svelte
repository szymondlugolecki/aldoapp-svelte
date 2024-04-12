<script lang="ts">
	import { getRegistration, getSubscription } from '$lib/client/functions/api/push';
	// import SubscribeForm from './subscribe-form.svelte';
	// import UnsubscribeForm from './unsubscribe-form.svelte';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { cn } from '$lib/utils';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { SubscribeForm, UnsubscribeForm } from '$lib/client/schemas/pushSubscription';
	import * as Form from '$shadcn/form';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';

	let subscriptionStatus = 'loading' as 'exists' | 'not-exists' | 'loading';
	let subscriptionMessage: string | null = null;
	export let subscribeForm: SuperValidated<SubscribeForm>;
	export let unsubscribeForm: SuperValidated<UnsubscribeForm>;

	const initialGetSubscription = async () => {
		// Check if service worker is supported/exists
		const registration = await getRegistration();
		if (!registration) {
			subscriptionStatus = 'not-exists';
			return null;
		}

		const sub = await registration.pushManager.getSubscription();
		if (!sub) {
			subscriptionStatus = 'not-exists';
			return null;
		}

		subscriptionStatus = 'exists';
		return sub;
	};

	$: console.log('subscriptionStatus', subscriptionStatus);

	const { enhance: unsubEnhance, submitting: unsubSubmitting } = superForm(unsubscribeForm, {
		onResult: async ({ result }) => {
			if (result.type !== 'success') {
				console.error('Usunięto subskrypcję push, ale nie udało się jej usunąć z bazy danych');
			} else {
				toast.success('Sukces');
			}
		},
		onSubmit: async ({ cancel, formData, action }) => {
			// const success = await requestSubscriptionRemoval();
			formData.append('allDevices', false.toString());
			// if (!success) {
			// toast.error('Form: Niepowodzenie');
			// return cancel();
			// }
		}
	});

	const { enhance: subEnhance, submitting: subSubmitting } = superForm(subscribeForm, {
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
			// await getSubscription();
		},
		onSubmit: async ({ cancel, formData }) => {
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
</script>

<div class="grid grid-cols-2 gap-4">
	<div class="col-span-2 sm:col-span-1">
		<div class="flex items-center gap-x-2">
			<label
				for="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>Powiadomienia Push</label
			>
			<span
				class={cn(
					'square-3 rounded-full',
					subscriptionStatus === 'exists' && 'bg-green-500',
					subscriptionStatus === 'not-exists' && 'bg-red-500 animate-pulse',
					subscriptionStatus === 'loading' && 'bg-gray-500 animate-pulse'
				)}
			/>
		</div>
		<p class="text-sm text-muted-foreground">
			Powiadomienia na telefon o zmianach w statusie zamówienia, nowych promocjach, itp.
		</p>
	</div>
	<div class="sm:justify-self-end sm:place-self-center">
		{#await initialGetSubscription()}
			Loading
		{:then subscription}
			{#if !subscriptionMessage}
				{#if subscription}
					<!-- Subscribe Form -->
					<form action="?/subscribe" method="post" use:unsubEnhance>
						<Form.Button disabled={$unsubSubmitting}>
							{#if $unsubSubmitting}
								<Spinner />
							{:else}
								Włącz
							{/if}
						</Form.Button>
					</form>
				{:else}
					<!-- Unsubscribe Form -->
					<form action="?/unsubscribe" method="post" use:subEnhance>
						<Form.Button disabled={$subSubmitting}>
							{#if $subSubmitting}
								<Spinner />
							{:else}
								Włącz
							{/if}
						</Form.Button>
					</form>
				{/if}
			{:else}
				<p>{subscriptionMessage}</p>
			{/if}
		{/await}
	</div>
</div>
