<script lang="ts">
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import logo from '$lib/assets/logo.png?run&width=68&height=50&format=webp';
	import Img from '@zerodevx/svelte-img';
	import Danger from '$components/Alerts/Danger.svelte';
</script>

<svelte:head>
	<title>Zaloguj się • Twoje ALDO</title>
	<meta
		name="description"
		content="Zaloguj się do aplikacji Twoje ALDO. Po zalogowaniu możesz składać zamówienia, śledzić historię zamówień oraz zarządzać swoim kontem."
	/>
</svelte:head>

<section class="w-full h-full flex justify-center items-center">
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 w-96 shadow-2xl">
		<!-- <h1
			class="text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center"
		>
			Logowanie

		</h1> -->
		<a
			href="/#"
			class="flex items-center mt-6 text-2xl font-semibold text-gray-900 dark:text-white"
		>
			Twoje
			<Img class="h-12 ml-2" src={logo} alt="Logo ALDO" />
		</a>

		<Danger />

		<!-- <div class="h-0 w-full border-t border-dashed border-gray-300" /> -->
		<div
			class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
		>
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
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
						<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>Adres email</label
						>
						<input
							type="email"
							name="email"
							id="email"
							class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="przykladowy.email@gmail.com"
							required
						/>
					</div>
					<button
						type="submit"
						class="mt-6 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>Zaloguj</button
					>
				</form>
			</div>
		</div>
	</div>
</section>
