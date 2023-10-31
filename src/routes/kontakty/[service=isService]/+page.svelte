<script lang="ts">
	import { page } from '$app/stores';
	import { serviceNames, contactInfo, nutritionalAdvisors } from '$lib/client/constants';
	import { capitalize } from '$lib/client/functions';

	import {
		Table,
		TableBody,
		TableCaption,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$shadcn/table';

	import type { ShortService } from '$types';
	$: service = serviceNames[$page.params.service as ShortService];
	$: contact = contactInfo[service];
	$: contactEntries = Object.entries(contact) as [string, [string[], string[] | undefined]][];
</script>

<svelte:head>
	<title>Kontakty • Twoje ALDO</title>
	<meta
		name="description"
		content="Dział pasz. Market. Dział maszyn. Komis maszyn. Serwis. Stacja paliw."
	/>
</svelte:head>

<section class="gap-y-20 w-full flex flex-col items-center pt-10 pb-48">
	<div class="flex max-w-3xl w-full">
		<Table class="caption-top">
			<TableCaption>Kontakt - {capitalize(service)}</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Punkt sprzedaży</TableHead>
					<TableHead>Numery telefonu</TableHead>
					<TableHead>Adres email</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each contactEntries as data}
					{@const emails = data[1][1]}
					<TableRow>
						<TableCell class="font-medium">{capitalize(data[0])}</TableCell>
						<TableCell class="flex flex-col space-y-4 min-w-[120px]">
							{#each data[1][0] as phoneNumber}
								<a
									href={`tel:+48${phoneNumber.split(' ').join('')}`}
									class="block hover:text-primary duration-150">{phoneNumber}</a
								>
							{/each}
						</TableCell>
						<TableCell>
							{#if emails && emails.length}
								{#each emails as email}
									<a href="mailto:{email}" class="block hover:text-primary duration-150">{email}</a>
								{/each}
							{:else}
								Brak
							{/if}
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>

	{#if service === 'dział pasz'}
		<div class="flex max-w-3xl w-full">
			<Table class="caption-top">
				<TableCaption>Doradcy żywieniowi</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Doradca</TableHead>
						<TableHead>Numer telefonu</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each nutritionalAdvisors as advisor}
						<TableRow>
							<TableCell class="font-medium">{advisor.name}</TableCell>
							<TableCell class="flex flex-col space-y-4">
								{#each advisor.phone as phone}
									<a href={`tel:+48${phone.split(' ').join('')}`} class="block">{phone}</a>
								{/each}
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</div>
	{/if}
</section>
