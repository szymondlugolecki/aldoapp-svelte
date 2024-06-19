<script lang="ts">
	// import { BellRing } from 'lucide-svelte';
	// import { pushSubscription$ } from '$lib/client/schemas/index.js';
	// import * as Form from '$shadcn/form';
	// import Spinner from '$components/custom/spinner.svelte';

	// export let data;
</script>

<svelte:head>
	<title>Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Statystyki i zarządzanie aplikacją Twoje ALDO."
	/>
</svelte:head>

<section class="flex flex-col w-full p-2 gap-y-3">
	<!-- <div class="flex flex-col gap-y-0">
		<h2 class="text-lg font-semibold">Powiadomienie Push</h2>
		<p class="text-sm text-muted-foreground">Do wszystkich użytkowników</p>
	</div>
	<div class="flex w-full max-w-xs">
		<Form.Root
			class="w-full"
			action="?/sendAll"
			method="POST"
			form={data.form}
			schema={pushSubscription$.notificationAll}
			let:config
			let:submitting
		>
			<Form.Field {form} name="title">
				<Form.Control let:attrs>
					<Form.Label>Tytuł</Form.Label>
					<Form.Input spellcheck="false" placeholder="Uwaga, promocja!" disabled={submitting} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="body">
				<Form.Control let:attrs>
					<Form.Label>Wiadomość</Form.Label>
					<Form.Textarea
						spellcheck="false"
						placeholder="Wakacyjna promocja -20% z kodem: WAKACJE2023"
						class="resize-none"
						disabled={submitting}
					/>
					<Form.Description
						>Wiadomość zostanie wysłana do wszystkich użytkowników, którzy włączyli Powiadomienia
						Push w ustawieniach</Form.Description
					>
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>

			{#if submitting}
				<Spinner />
			{:else}
				<Form.Button disabled={submitting}
					>Wyślij wiadomość <BellRing class="ml-2" size={16} /></Form.Button
				>
			{/if}
		</Form.Root>
	</div> -->
</section>
