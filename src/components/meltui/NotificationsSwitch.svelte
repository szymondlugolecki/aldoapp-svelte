<script lang="ts" context="module">
	import { z } from 'zod';
	export const formSchema = z.object({
		subscribe: z.boolean().default(false)
	});
	export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
	import { createSwitch, melt } from '@melt-ui/svelte';
	import { subscribe, unsubscribe } from '$lib/client/functions/api/push';
	import { writable } from 'svelte/store';
	import { isBrowser, sleep } from '@melt-ui/svelte/internal/helpers';
	import { onMount } from 'svelte';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import { Label } from '$shadcn/label';
	import { Switch } from '$shadcn/switch';

	import { page } from '$app/stores';
	import * as Form from '$shadcn/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	export let form: SuperValidated<FormSchema> = $page.data.switch;

	let loading = true;

	const isSubscribedCheck = async () => {
		loading = true;
		await sleep(1_000);

		const registration = await navigator.serviceWorker.getRegistration();
		if (!registration) return false;
		const subscription = await registration.pushManager.getSubscription();
		if (!subscription) return false;

		return true;
	};

	const notificationsToggle = async (isChecked: boolean) => {
		loading = true;
		const { subscribed } = isChecked ? await subscribe() : await unsubscribe();
		loading = false;
		return subscribed;
	};

	const isSubscribed = writable<boolean>(false);

	if (isBrowser) {
		isSubscribedCheck().then((v) => {
			isSubscribed.set(v);
			loading = false;
		});
	}

	const {
		elements: { root, input },
		states: { checked }
	} = createSwitch({
		checked: isSubscribed,
		onCheckedChange: (args) => {
			notificationsToggle(args.next);
			return args.next;
		}
	});
</script>

<Form.Root
	{form}
	schema={formSchema}
	let:config
	method="POST"
	action="?/switch"
	class="w-full space-y-6"
>
	<fieldset>
		<legend class="mb-4 text-lg font-medium"> Email Notifications </legend>
		<div class="space-y-4">
			<Form.Field {form} name="subscribe">
				<Form.Item class="flex flex-row items-center justify-between p-4 border rounded-lg">
					<div class="space-y-0.5">
						<Form.Label>Powiadomienia Push</Form.Label>
						<Form.Description
							>Powiadomienia na telefon z interesującymi Cię informacjami</Form.Description
						>
					</div>
					<Form.Switch aria-readonly disabled />
				</Form.Control>
			</Form.Field>
		</div>
	</fieldset>
	<Form.Button>Submit</Form.Button>
</Form.Root>
