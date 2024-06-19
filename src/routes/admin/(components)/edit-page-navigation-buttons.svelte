<script lang="ts">
	import { Button as FormButton } from '$shadcn/form';
	import Spinner from '$components/custom/spinner.svelte';
	import { Button } from '$shadcn/button';
	import { RotateCcw, Save, Undo2 } from 'lucide-svelte';
	import { preloadData, goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let backPathname = '';
	onMount(() => (backPathname = document.referrer));

	const goBack = () => {
		if (browser) {
			console.log('browser', backPathname);
			if (backPathname === window.location.href) {
				return goto('/admin/uzytkownicy', { replaceState: true });
			}

			goto(backPathname);
		}
	};

	export let delayed: boolean;
	export let submitting: boolean;
	export let reset: () => void;
</script>

<div class="flex justify-between">
	<div class="invisible" />
	<!-- <Button
		variant="secondary"
		on:mouseenter={async () => await preloadData(backPathname)}
		on:click={goBack}>Powrót <Undo2 class="ml-1.5 square-4" /></Button
	> -->

	<div class="flex gap-x-2">
		<Button variant="secondary" on:click={() => reset()}
			>Reset <RotateCcw class="ml-1.5 square-4" /></Button
		>
		<FormButton disabled={submitting}>
			{#if delayed}
				<Spinner />
			{:else}
				Zapisz <Save class="ml-1.5 square-4" />
			{/if}
		</FormButton>
	</div>
</div>
