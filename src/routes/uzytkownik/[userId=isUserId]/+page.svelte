<script lang="ts">
	import Separator from '$components/ui/separator/separator.svelte';
	import { parseAddress, dateParser, phoneParser } from '$lib/client/functions/index.js';

	export let data;

	const userInfo = {
		email: ['Email', data.profile.email],
		phone: ['Numer telefonu', phoneParser(data.profile.phone)],
		address: ['Adres', parseAddress(data.profile.address) || 'Brak'],
		adviser: ['Doradca', data.profile.adviser ? data.profile.adviser.fullName : 'Brak'],
		createdAt: ['Data rejestracji', dateParser(data.profile.createdAt, 'long')]
	};
</script>

<div class="flex flex-col xl:flex-row">
	<section class="flex flex-col px-2 ss:px-4 gap-y-3">
		<h2 class="text-2xl font-semibold tracking-tight scroll-m-20">Podstawowe informacje</h2>
		<div class="flex flex-col w-full overflow-x-auto gap-y-2">
			{#each Object.entries(userInfo) as [key, [label, value]]}
				<div class="flex flex-col gap-0.5 w-full">
					<span class="text-sm font-medium text-muted-foreground">{label}</span>
					{#if key === 'phone' && value}
						<a class="pl-0.5 text-base font-medium" href="tel:+48{value}">{value}</a>
					{:else if key === 'email'}
						<a class="pl-0.5 text-base font-medium" href="mailto:{value}">{value}</a>
					{:else}
						<span class="pl-0.5 text-base font-medium whitespace-break-spaces">{value}</span>
					{/if}
				</div>
				<Separator />
			{/each}
		</div>
	</section>
</div>
