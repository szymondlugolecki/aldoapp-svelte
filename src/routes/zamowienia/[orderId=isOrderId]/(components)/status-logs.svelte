<script lang="ts">
	import * as Sheet from '$shadcn/sheet';
	import { Button } from '$shadcn/button';
	import type { PageServerData } from '../$types';
	import * as Card from '$shadcn/card';
	import { orderEventsList } from '$lib/client/constants';
	import { dateParser } from '$lib/client/functions';
	import { cn } from '$lib/utils';

	export let data: NonNullable<PageServerData['statusHistory']>;
</script>

<Card.Root class="w-full max-w-2xl">
	<Card.Header>
		<Card.Title>Historia statusu</Card.Title>
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
