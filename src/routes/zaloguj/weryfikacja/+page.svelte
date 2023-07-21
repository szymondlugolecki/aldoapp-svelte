<script>
	import { enhance } from '$app/forms';
	import Alert from '$components/Alerts/Alert.svelte';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import logo from '$lib/assets/logo.png?run&width=110&height=80&format=webp';
	// import Img from '@zerodevx/svelte-img';
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
	import { Key } from 'lucide-svelte';
	import { Label } from '$shadcn/label';

	import { createPinInput } from '@melt-ui/svelte';
	import { verificationCodeSchema } from '$lib/client/schemas/auth';
	import toast from 'svelte-french-toast';
	const { root, input, valueStr } = createPinInput();

	$: validCode = verificationCodeSchema.shape.code.safeParse($valueStr).success;
</script>

<svelte:head>
	<title>Weryfikacja logowania • Twoje ALDO</title>
	<meta name="description" content="Weryfikacja logowania. Sprawdź swoją pocztę." />
</svelte:head>

<section class="w-full flex justify-center items-center">
	<form
		method="post"
		use:enhance={({ formData }) => {
			if (!validCode) {
				toast.error('Nieprawidłowy kod weryfikacyjny');
				return;
			}

			const toastId = createLoadingToast('redirecting');

			formData.append('code', $valueStr);

			return async ({ result, update }) => {
				handleFormResponse(result, toastId);
				update();
			};
		}}
	>
		<Card class="w-[312px] xs:w-[400px]">
			<CardHeader>
				<CardTitle>Weryfikacja</CardTitle>
				<CardDescription
					>Podaj kod weryfikacyjny, który wysłaliśmy na podany adres email</CardDescription
				>
			</CardHeader>
			<CardContent class="grid gap-4">
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for="email">Kod weryfikacyjny<span class="text-red-500">*</span></Label>
					<div {...$root} use:root class="flex items-center gap-2">
						{#each Array.from({ length: 4 }) as _, i}
							<input
								class="rounded-md text-center text-lg shadow-sm square-12"
								{...$input}
								use:input
							/>
						{/each}
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button class="w-full" type="submit" disabled={!validCode}>
					<Key class="mr-2 h-4 w-4" /> Zaloguj się
				</Button>
			</CardFooter>
		</Card>
	</form>
</section>

<!-- 
<section class="w-full flex justify-center items-center">
	<div
		class="flex flex-col items-center justify-center px-6 py-8 mx-auto w-96 shadow-2xl space-y-2"
	>

		<div class="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0 bg-base dark:border-gray-700">
			<div class="px-1 py-2 space-y-4">
				<h1
					class="font-semibold leading-tight tracking-tight text-base-content text-2xl text-center"
				>
					Weryfikacja kodu
				</h1>

				<Alert
					type="info"
					message="Email weryfikacyjny został wysłany na twoją pocztę. W razie potrzeby sprawdź folder spam."
				/>

				<form
					class="space-y-4"
					method="post"
					use:enhance={() => {
						const toastId = createLoadingToast('redirecting');
						return async ({ result, update }) => {
							handleFormResponse(result, toastId);
							update();
						};
					}}
				>
					<div>
						<label for="code" class="block mb-2 text-sm font-medium text-base-content"
							>4-o cyfrowy kod*</label
						>

						<input
							type="number"
							name="code"
							class="bg-base placeholder:text-bg-base-content border border-base-300 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
							required
						/>
					</div>
					<button
						type="submit"
						class="mt-6 w-full text-primary-content bg-primary hover:bg-primary-focus focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-800"
						>Zaloguj</button
					>
				</form>
			</div>
		</div>
	</div>
</section> -->
