<script lang="ts">
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import logo from '$lib/assets/logo.png?run&width=110&height=80&format=webp';
	import Img from '@zerodevx/svelte-img';
	// import Danger from '$components/Alerts/Danger.svelte';
	import Success from '$components/Alerts/Alert.svelte';
</script>

<svelte:head>
	<title>Zaloguj się • Twoje ALDO</title>
	<meta name="description" content="Zaloguj się do aplikacji Twoje ALDO." />
</svelte:head>

<section class="w-full h-full flex justify-center items-center flex-1">
	<div
		class="flex flex-col items-center justify-center px-6 py-8 mx-auto w-96 shadow-2xl space-y-2"
	>
		<!-- <h1
			class="text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center"
		>
			Logowanie

		</h1> -->
		<div class="flex items-center mt-6 text-2xl font-semibold text-base-content select-none">
			Twoje
			<Img class="ml-2" src={logo} width={55} height={40} alt="Logo ALDO" />
		</div>

		<!-- <div class="h-0 w-full border-t border-dashed border-gray-300" /> -->
		<div
			class="w-full rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
		>
			<div class="px-6 py-2 space-y-4 md:space-y-6 sm:px-8 sm:py-3">
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
						<label for="email" class="block mb-2 text-sm font-medium text-base-content"
							>Adres email*</label
						>
						<input
							type="email"
							name="email"
							id="email"
							class="bg-base placeholder:text-bg-base-content border border-base-300 text-xs sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="przykladowy.email@gmail.com"
							required
						/>
					</div>
					<button
						type="submit"
						class="mt-6 w-full text-white bg-primary hover:bg-primary-focus focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-800"
						>Zaloguj</button
					>
				</form>
			</div>
		</div>
	</div>
</section>
