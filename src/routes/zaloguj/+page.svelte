<script lang="ts">
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { userPropertySchemas } from '$lib/client/schemas/users';
	import toast from 'svelte-french-toast';
	import Input from '$shadcn/input/Input.svelte';
	import Button from '$shadcn/button/Button.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$shadcn/card';
	import { Key, Send } from 'lucide-svelte';
	import { Label } from '$shadcn/label';

	let emailInput = '';

	$: validEmail = userPropertySchemas.email.safeParse(emailInput).success;
</script>

<svelte:head>
	<title>Zaloguj się • Twoje ALDO</title>
	<meta name="description" content="Zaloguj się do aplikacji Twoje ALDO." />
</svelte:head>

<section class="w-full flex justify-center items-center">
	<form
		method="post"
		use:enhance={() => {
			if (!validEmail) {
				toast.error('Nieprawidłowy adres email');
				return;
			}

			const toastId = createLoadingToast('redirecting');

			return async ({ result, update }) => {
				handleFormResponse(result, toastId);
				update();
			};
		}}
	>
		<Card class="w-[312px] xs:w-[400px]">
			<CardHeader>
				<CardTitle>Logowanie</CardTitle>
				<CardDescription>Podaj email, na który mamy wysłać kod weryfikacyjny</CardDescription>
			</CardHeader>
			<CardContent class="grid gap-4">
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for="email">Email<span class="text-red-500">*</span></Label>
					<Input
						type="email"
						id="email"
						name="email"
						placeholder="twoj.email@gmail.com"
						bind:value={emailInput}
					/>
				</div>
			</CardContent>
			<CardFooter>
				<Button class="w-full" type="submit" disabled={!validEmail}>
					<Send class="mr-2 h-4 w-4" /> Wyślij kod
				</Button>
			</CardFooter>
		</Card>
	</form>
</section>
