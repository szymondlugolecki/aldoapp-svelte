<script lang="ts">
	import { Send, Lock } from 'lucide-svelte';

	import * as Form from '$shadcn/form';
	import { auth$ } from '$lib/client/schemas/index.js';
	import MessageAlert from '$components/custom/Form/MessageAlert.svelte';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	export let data;
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
		<Form.Root
			schema={auth$.login}
			form={data.form}
			let:config
			let:submitting
			method="POST"
			class="flex flex-col gap-y-6"
		>
			<Form.Field {config} name="email">
				<Form.Item>
					<Form.Label>Adres email</Form.Label>
					<Form.Input type="email" required minlength={3} />
					<Form.Description>Wyślemy Ci 4 cyfrowy kod weryfikacyjny</Form.Description>
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<MessageAlert />
			<Form.Button disabled={submitting}>
				{#if submitting}
					<Spinner />
				{:else}
					<Send class="w-4 h-4 mr-2" /> Wyślij kod
				{/if}
			</Form.Button>
		</Form.Root>
	</div>
</section>
