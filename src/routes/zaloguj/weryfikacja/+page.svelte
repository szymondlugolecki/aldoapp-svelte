<script lang="ts">
	import { Button } from '$shadcn/button';
	import { Key, Lock } from 'lucide-svelte';
	import { Label } from '$shadcn/label';
	import { createPinInput, melt } from '@melt-ui/svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { auth$ } from '$lib/client/schemas';
	import MessageAlert from '$components/custom/Form/MessageAlert.svelte';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import { derived, writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let data;

	const { errors, submitting, enhance } = superForm(data.form);

	const {
		elements: { root, input, hiddenInput },
		states: { valueStr, value }
	} = createPinInput({
		name: 'code'
	});

	const successfullyRedirected = $page.url.searchParams.get('success');
	let showSuccessMessage = false;

	onMount(() => {
		if (successfullyRedirected) {
			showSuccessMessage = true;
		}
		setTimeout(() => {
			showSuccessMessage = false;
		}, 5000);
	});
</script>

<svelte:head>
	<title>Weryfikacja logowania • Twoje ALDO</title>
	<meta name="description" content="Weryfikacja logowania. Sprawdź swoją pocztę." />
</svelte:head>

<section class="flex justify-center w-full pb-48 pt-44 sm:pt-48 sm:pb-64">
	<div class="flex flex-col px-8 sm:px-0 sm:w-full sm:max-w-xs gap-y-4">
		<div>
			<h1 class="text-xl font-semibold">Weryfikacja</h1>
			<p class="flex items-center text-sm text-muted-foreground">
				Bezpieczne bezhasłowe logowanie <Lock size={14} class="ml-1" />
			</p>
		</div>

		{#if showSuccessMessage}
			<span class="text-success">Wysłano!</span>
		{/if}

		<form method="POST" class="flex flex-col gap-y-6" use:enhance>
			<div class="flex flex-col gap-y-2">
				<Label for={$root.id}>Kod weryfikacyjny</Label>
				<div use:melt={$root} class="flex items-center gap-x-2">
					{#each Array.from({ length: 4 }) as _, i}
						<input
							class="text-lg text-center rounded-md shadow-sm square-12"
							use:melt={$input()}
							aria-invalid={$errors.code ? 'true' : undefined}
						/>
					{/each}
				</div>
				<div class="">
					<p class="text-sm text-muted-foreground">
						Jeżeli nie widzisz maila z kodem, sprawdź folder spam lub spróbuj zalogować się ponownie
					</p>
				</div>

				{#if $errors.code}<span class="text-destructive">{$errors.code}</span>{/if}
			</div>
			<button
				disabled={$submitting}
				class="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
			>
				{#if $submitting}
					<Spinner />
				{:else}
					<Key class="w-4 h-4 mr-2" /> Zweryfikuj
				{/if}
			</button>
			<input use:melt={$hiddenInput} />
		</form>
	</div>
</section>
