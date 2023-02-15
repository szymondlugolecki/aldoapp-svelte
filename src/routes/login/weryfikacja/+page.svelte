<script>
	import { enhance } from '$app/forms';
	import { isValidObject } from '$lib/client/functions';
	import { errorToast, successToast } from '$lib/client/functions/toasts';
</script>

<section class="w-full h-full flex justify-center items-center">
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 w-96 shadow-2xl">
		<a
			href="/#"
			class="flex items-center mb-6 mt-6 text-2xl font-semibold text-gray-900 dark:text-white"
		>
			Twoje
			<img class="h-12 ml-2" src="/logo.png" alt="Logo ALDO" />
		</a>
		<div class="h-0 w-full border-t border-dashed border-gray-300" />
		<div
			class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
		>
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1
					class="text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center"
				>
					Weryfikacja kodu
				</h1>
				<h2>Przepisz kod z maila lub kliknij w link aktywacyjny</h2>
				<form
					class="space-y-4"
					method="post"
					use:enhance={() => {
						return async ({ result, update }) => {
							console.log('result', result);
							if (result.type === 'failure') {
								if (isValidObject(result.data?.errors)) {
									const errorList = Object.values(result.data?.errors).flatMap((x) => x);
									if (errorList.length) {
										const formatErrors = '• ' + errorList.join('\n• ');
										errorToast({ title: 'Wystąpił błąd', description: formatErrors });
									}
								}
							} else if (result.type === 'success') {
								successToast({ title: 'Sukces', description: 'Zostałeś zalogowany' });
							}
							update();
						};
					}}
				>
					<div>
						<label for="code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>4-o cyfrowy kod</label
						>
						<input
							type="number"
							name="code"
							class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
