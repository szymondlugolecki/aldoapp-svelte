<script lang="ts">
	import { BellRing, X } from 'lucide-svelte';
	import { Textarea } from '$shadcn/textarea';
	import { Input } from '$shadcn/input';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$shadcn/card';

	import { createLabel, createDialog } from '@melt-ui/svelte';
	import { flyAndScale } from '$lib/client/functions';
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';

	const { trigger, portal, overlay, content, title, description, close, open } = createDialog();

	const root = createLabel();

	let pushTitle = '';
	let pushBody = '';
</script>

<svelte:head>
	<title>Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Statystyki i zarządzanie aplikacją Twoje ALDO."
	/>
</svelte:head>

<section class="w-full h-full p-2 space-y-3">
	<Card class="sm:w-[380px]">
		<CardHeader class="p-5 sm:p-6">
			<CardTitle class="text-base sm:text-lg">Wyślij powiadomienie PUSH</CardTitle>
			<CardDescription class="text-xs sm:text-sm"
				>Aby otrzymać powiadomienie wymagane jest włączenie powiadomień w ustawieniach konta</CardDescription
			>
		</CardHeader>
		<CardContent class="grid gap-4 p-5 pt-0 sm:p-6 sm:pt-0">
			<div class="space-y-2">
				<div class="flex flex-col items-start justify-center">
					<label use:root for="title" class="mb-0.5 font-medium" data-melt-part="root">
						<span class="text-sm sm:text-base">Tytuł</span>
					</label>
					<Input
						class="text-xs xs:text-sm sm:text-base"
						bind:value={pushTitle}
						id="title"
						placeholder="Super promocja!"
					/>
				</div>
				<div class="flex flex-col items-start justify-center">
					<label use:root for="title" class="mb-0.5 font-medium" data-melt-part="root">
						<span>Wiadomość</span>
					</label>
					<Textarea
						bind:value={pushBody}
						class="text-xs xs:text-sm sm:text-base"
						id="message"
						placeholder="Z kodem promocyjnym WAKACJE2023 15% zniżki na wszystkie zakupy!"
					/>
				</div>
			</div>

			<!-- <div class=" flex items-center space-x-4 rounded-md border p-4">
				<div class="flex-1 space-y-1">
					<p class="text-sm font-medium leading-none">Push Notifications</p>
					<p class="text-sm text-muted-foreground">Send notifications to device.</p>
				</div>
			</div> -->

			<!-- <div>
				<div class="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
					<span class="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
					<div class="space-y-1">
						<p class="text-sm font-medium leading-none">tytul</p>
						<p class="text-sm text-muted-foreground">opis</p>
					</div>
				</div>
			</div> -->
		</CardContent>
		<CardFooter class="p-5 pt-0 sm:p-6 sm:pt-0">
			<button
				{...$trigger}
				use:trigger
				disabled={!pushBody.length || !pushTitle.length}
				class="w-full h-10 py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90"
			>
				<BellRing class="mr-2 h-4 w-4" /> Wyślij
			</button>

			<div use:portal>
				{#if $open}
					<div {...$overlay} class="fixed inset-0 z-40 bg-black/50" />
					<div
						class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px]
            translate-x-[-50%] translate-y-[-50%] rounded-md p-[25px]
            shadow-lg bg-black"
						transition:flyAndScale={{
							duration: 150,
							y: 8,
							start: 0.96
						}}
						{...$content}
						use:content
					>
						<form
							method="post"
							action="?/push"
							use:enhance={({ formData }) => {
								const toastId = createLoadingToast('please-wait');

								formData.append('title', pushTitle);
								formData.append('body', pushBody);
								formData.append('targets', 'all');

								console.log('sending form');

								return async ({ result, update }) => {
									console.log('result', result);
									handleFormResponse(result, toastId);
									update();
								};
							}}
						>
							<h2 {...$title} class="m-0 text-lg font-medium">Uwaga!</h2>
							<p {...$description} class="mb-5 mt-[10px] leading-normal">
								Zamierzasz wysłać powiadomienie do wszystkich użytkowników. Czy jesteś pewny?
							</p>

							<div class="mt-[25px] flex justify-end gap-4">
								<button
									{...$close}
									use:close
									class="inline-flex h-[35px] items-center justify-center rounded-[4px] px-4 font-medium leading-none"
								>
									Anuluj
								</button>
								<button
									{...$close}
									use:close
									class="inline-flex h-[35px] items-center justify-center rounded-[4px] px-4 font-medium leading-none bg-destructive text-destructive-foreground hover:bg-destructive/90"
									type="submit"
								>
									Tak
								</button>
							</div>

							<button
								{...$close}
								use:close
								class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full"
							>
								<X />
							</button>
						</form>
					</div>
				{/if}
			</div>
		</CardFooter>
	</Card>
</section>
