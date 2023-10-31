<script lang="ts">
	import { BellRing } from 'lucide-svelte';
	import { pushSubscription$ } from '$lib/client/schemas/index.js';
	import * as Form from '$shadcn/form';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import MessageAlert from '$components/custom/Form/MessageAlert.svelte';

	export let data;
</script>

<section class="flex flex-col w-full px-2 pb-2 gap-y-3">
	<div class="flex flex-col gap-y-0">
		<h2 class="text-lg font-semibold">Powiadomienie Push</h2>
		<p class="text-sm text-muted-foreground">Do tego użytkownika</p>
	</div>
	<div class="flex w-full max-w-xs">
		<Form.Root
			class="w-full"
			action="?/send"
			method="POST"
			form={data.form}
			schema={pushSubscription$.notification}
			let:config
			let:submitting
		>
			<Form.Field {config} name="title">
				<Form.Item>
					<Form.Label>Tytuł</Form.Label>
					<Form.Input spellcheck="false" placeholder="Zamówienie gotowe" disabled={submitting} />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="body">
				<Form.Item>
					<Form.Label>Wiadomość</Form.Label>
					<Form.Textarea
						spellcheck="false"
						placeholder="Zapraszamy po odbiór zamówienia"
						class="resize-none"
						disabled={submitting}
					/>
					<Form.Description
						>Wiadomość zostanie dostarczona pod warunkiem, że użytkownik włączył powiadomienia w
						ustawieniach</Form.Description
					>
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<MessageAlert />

			<Form.Field {config} name="targets">
				<Form.Item hidden>
					<Form.Input
						spellcheck="false"
						placeholder="Zapraszamy po odbiór zamówienia"
						class="resize-none"
						hidden
						value={data.profile.id}
					/>
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Button disabled={submitting}
				>{#if submitting}
					<Spinner />
				{:else}Wyślij wiadomość <BellRing class="ml-2" size={16} />{/if}</Form.Button
			>
		</Form.Root>
	</div>
</section>
