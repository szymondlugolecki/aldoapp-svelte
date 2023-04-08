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
		content="Dział pasz. Market. Dział maszyn. Komis maszyn. Serwis. Stacja paliw."
	/>
</svelte:head>

<section class="h-full space-y-10 w-full">
	<header class="w-full text-center mt-4">
		<h1 class="text-4xl font-semibold">{capitalize(service)}</h1>
		<h2 class="text-2xl">Numery telefonów</h2>
	</header>

	<div class="relative overflow-x-auto flex justify-center">
		<table class="w-full lg:w-3/4 text-sm text-left text-base-content bg-base-100">
			<thead class="text-xs uppercase">
				<tr>
					<th scope="col" class="px-3 sm:px-6 py-3"> Punkt sprzedaży </th>
					<th scope="col" class="px-3 sm:px-6 py-3"> Numery telefonu </th>
					<!-- <th scope="col" class="px-3 sm:px-6 py-3"> Akcja </th> -->
				</tr>
			</thead>
			<tbody>
				{#each Object.entries(contact) as data}
					<tr class="last:border-0 border-b border-base-content">
						<th scope="row" class="px-3 sm:px-6 py-4 font-medium whitespace-nowrap">
							{capitalize(data[0])}
						</th>
						<td class="px-3 sm:px-6 py-4 space-y-4 whitespace-nowrap">
							{#each data[1] as number}
								<a href={`tel:+48${number}`} class="block">{number}</a>
							{/each}
						</td>
						<!-- <td class="px-3 sm:px-6 py-4 space-y-4 whitespace-nowrap">
							{#each data[1] as number}
								<a class="block hover:text-primary" href={`tel:+48${number}`}>Zadzwoń 📞</a>
							{/each}
						</td> -->
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
