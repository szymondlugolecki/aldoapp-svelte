<script lang="ts">
	import { Send, Lock } from 'lucide-svelte';

	import * as Form from '$shadcn/form';
	import { auth$ } from '$lib/client/schemas/index.js';
	import Spinner from '$components/custom/spinner.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$components/ui/input';
	export let data;

	const form = superForm(data.form, {
		validators: zodClient(auth$.login),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
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

<svelte:head>
	<title>Zaloguj się • Twoje ALDO</title>
	<meta name="description" content="Zaloguj się do aplikacji Twoje ALDO." />
</svelte:head>

<section class="flex justify-center w-full pb-48 pt-44 sm:pt-48 sm:pb-64">
	<div class="flex flex-col px-8 sm:px-0 sm:w-full sm:max-w-xs gap-y-4">
		<div>
			<h1 class="text-xl font-semibold">Zaloguj się</h1>
			<p class="flex items-center text-sm text-muted-foreground">
				Bezpieczne bezhasłowe logowanie <Lock size={14} class="ml-1" />
			</p>
		</div>

		<form method="POST" use:enhance class="flex flex-col gap-y-6">
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Adres email</Form.Label>
					<Input {...attrs} type="email" required minlength={3} bind:value={$formData.email} />
				</Form.Control>
				<Form.Description>Wyślemy Ci 4 cyfrowy kod weryfikacyjny</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button disabled={$submitting}>
				{#if $submitting}
					<Spinner />
				{:else}
					Wyślij kod <Send class="w-4 h-4 ml-2" />
				{/if}
			</Form.Button>
		</form>
	</div>
</section>
