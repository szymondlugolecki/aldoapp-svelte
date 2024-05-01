<script lang="ts">
	import { BellRing } from 'lucide-svelte';
	import { pushSubscription$ } from '$lib/client/schemas/index.js';
	import * as Form from '$shadcn/form';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import { Input } from '$components/ui/input';
	import { Textarea } from '$components/ui/textarea';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { NotificationForm } from '$lib/client/schemas/pushSubscription';

	export let data;

	export let superform: SuperValidated<Infer<NotificationForm>>;
	export let open: boolean;

	const form = superForm(superform, {
		validators: zodClient(pushSubscription$.notification),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				open = false;
				console.log(f, f.message, f.posted, f.errors);
				// toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
				toast.success(`Sukces`);
			} else {
				toast.error('Błąd');
			}
		}
	});
	const { form: formData, enhance, delayed, submitting } = form;
</script>

<section class="flex flex-col w-full px-2 pb-2 gap-y-3">
	<div class="flex flex-col gap-y-0">
		<h2 class="text-lg font-semibold">Powiadomienie Push</h2>
		<p class="text-sm text-muted-foreground">Do tego użytkownika</p>
	</div>
	<div class="flex w-full max-w-xs">
		<form method="POST" action="?/send" use:enhance class="flex flex-col gap-y-2">
			<Form.Field {form} name="title">
				<Form.Control let:attrs>
					<Form.Label>Tytuł</Form.Label>
					<Input
						{...attrs}
						bind:value={$formData.title}
						spellcheck="false"
						placeholder="Zamówienie gotowe"
						disabled={$submitting}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="body">
				<Form.Control let:attrs>
					<Form.Label>Wiadomość</Form.Label>
					<Textarea
						spellcheck="false"
						placeholder="Zapraszamy po odbiór zamówienia"
						class="resize-none"
						disabled={$submitting}
						bind:value={$formData.body}
					/>
					<Form.Description
						>Wiadomość zostanie dostarczona pod warunkiem, że użytkownik włączył powiadomienia w
						ustawieniach</Form.Description
					>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="targets">
				<Form.Control let:attrs>
					<input {...attrs} type="hidden" value={data.profile.id} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button class="w-20" disabled={$submitting}>
				{#if $delayed}
					<Spinner />
				{:else}
					Wyślij wiadomość <BellRing class="ml-2" size={16} />
				{/if}
			</Form.Button>
		</form>
	</div>
</section>
