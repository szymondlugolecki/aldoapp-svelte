<script lang="ts">
	import * as Sheet from '$shadcn/sheet';
	import { Input } from '$shadcn/input';
	import { Label } from '$shadcn/label';
	import { Button } from '$shadcn/button';
	import type { PageServerData } from '../$types';
	// import * as Alert from "$shadcn/alert";
	import * as Card from '$shadcn/card';
	import { orderEventsList } from '$lib/client/constants';
	import { dateParser } from '$lib/client/functions';
	import { cn } from '$lib/utils';

	export let data: PageServerData['statusHistory'];

	console.log('data', data);

	let open = true;
</script>

<Sheet.Root
	bind:open
	onOpenChange={(isOpen) => {
		if (isOpen === false) {
			history.back();
		}
	}}
>
	<Sheet.Content side="right" class="w-full pt-10 sm:max-w-none">
		{#if data}
			<Sheet.Header>
				<Sheet.Title>Historia statusu zamówienia #{data.id}</Sheet.Title>
				<Sheet.Description
					>Poniżej znajdują się wszystkie zmiany jakie zaszły w statusie tego zamówienia.</Sheet.Description
				>
			</Sheet.Header>
			<div class="flex justify-center pt-10">
				<Card.Root class="w-full max-w-2xl">
					<Card.Header>
						<Card.Title>Historia</Card.Title>
						<Card.Description>Liczba zapisów - {data.statusLogs.length}</Card.Description>
					</Card.Header>
					<Card.Content class="grid gap-4 p-4 pt-0 sm:pt-0 sm:p-6">
						<div>
							{#each data.statusLogs as { event, user, createdAt }, idx (idx)}
								<div class="flex pb-4 mb-4 last:mb-0 last:pb-0">
									<div class="grid grid-cols-[25px_1fr] items-start flex-1">
										<span
											class={cn(
												'flex w-2 h-2 translate-y-1 rounded-full bg-sky-500',
												event === 'CREATED' && 'bg-yellow-500',
												event === 'CANCEL' && 'bg-red-500',
												(event === 'DELIVERED' || event === 'PICKED_UP') && 'bg-green-500',
												event === 'IS_UNAVAILABLE' && 'bg-gray-500'
											)}
										/>
										<div class="space-y-1">
											<p class="text-sm font-medium leading-none">
												{orderEventsList[event]}
											</p>
											<p class="text-sm text-muted-foreground">
												{user.fullName}
											</p>
										</div>
									</div>
									<div class="flex items-center">
										<p class="text-sm text-right text-muted-foreground">
											{dateParser(createdAt, 'medium')}
										</p>
									</div>
								</div>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			</div>
			<!-- <Sheet.Footer>
				<Sheet.Close asChild let:builder>
					<Button builders={[builder]} type="submit">Save changes</Button>
				</Sheet.Close>
			</Sheet.Footer> -->
		{:else}
			<Sheet.Header>
				<Sheet.Title>Brak historii zamówienia</Sheet.Title>
				<Sheet.Description>Historia zamówienia jest pusta.</Sheet.Description>
			</Sheet.Header>
			<Sheet.Footer>
				<Sheet.Close asChild let:builder>
					<Button builders={[builder]}>Wyjdź</Button>
				</Sheet.Close>
			</Sheet.Footer>
		{/if}
	</Sheet.Content>
</Sheet.Root>
