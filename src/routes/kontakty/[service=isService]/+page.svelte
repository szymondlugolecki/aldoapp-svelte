<script lang="ts">
	import { page } from '$app/stores';
	import { serviceNames, contactInfo } from '$lib/client/constants';
	import { capitalize } from '$lib/client/functions';
	import type { ShortService } from '$types';
	$: service = serviceNames[$page.params.service as ShortService];
	$: contact = contactInfo[service];
</script>

<svelte:head>
	<title>Kontakty • Twoje ALDO</title>
	<meta
		name="description"
		content="Lista produktów dostępnych w Twoje ALDO. Dodaj, edytuj lub usuń."
	/>
</svelte:head>

<section class="h-full space-y-6">
	<header class="w-full text-center">
		<h1 class="text-4xl font-semibold">{capitalize(service)}</h1>
		<h2 class="text-2xl">Numery telefonów</h2>
	</header>

	<div class="relative overflow-x-auto flex justify-center">
		<table class="w-full lg:w-3/4 text-sm text-left text-gray-500 dark:text-gray-400">
			<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
				<tr>
					<th scope="col" class="px-3 sm:px-6 py-3"> Punkt sprzedaży </th>
					<th scope="col" class="px-3 sm:px-6 py-3"> Numer telefonu </th>
					<th scope="col" class="px-3 sm:px-6 py-3"> Akcja </th>
				</tr>
			</thead>
			<tbody>
				{#each Object.entries(contact) as data}
					<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
						<th
							scope="row"
							class="px-3 sm:px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
						>
							{capitalize(data[0])}
						</th>
						<td class="px-3 sm:px-6 py-4 space-y-4 whitespace-nowrap">
							{#each data[1] as number}
								<span class="block">{number}</span>
							{/each}
						</td>
						<td class="px-3 sm:px-6 py-4 space-y-4 whitespace-nowrap">
							{#each data[1] as number}
								<a class="block hover:text-blue-700" href={`tel:+48${number}`}>Zadzwoń 📞</a>
							{/each}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
