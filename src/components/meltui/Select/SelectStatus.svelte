<script lang="ts">
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';
	import { orderEventsList, orderStatusList } from '$lib/client/constants';
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { cn } from '$lib/client/functions';
	import { getNextEvents } from '$lib/client/machines/orderStatus';
	import type { OrderEvent } from '$types';
	import type { OrderStatus } from '$lib/client/constants/dbTypes';

	export let defaultValue: OrderStatus;
	export let required = false;

	const toOption = (event: OrderEvent): ComboboxOptionProps<OrderEvent> => ({
		value: event,
		label: orderEventsList[event]
	});

	const {
		elements: { menu, input, option, label },
		states: { open, selected, touchedInput, inputValue, highlighted },
		helpers: { isSelected }
	} = createCombobox<OrderStatus>({
		forceVisible: true
	});

	$: if (!$open) {
		$inputValue = $selected?.label ?? '';
	}

	$: filteredStatusList = $touchedInput
		? availableEvents.filter((event) => {
				const normalizedInput = $inputValue.toLowerCase();
				return (
					event.toLowerCase().includes(normalizedInput) ||
					normalizedInput.includes(event.toLowerCase())
				);
		  })
		: availableEvents;

	const availableEvents = getNextEvents(defaultValue);
</script>

<div class="flex flex-col gap-y-4">
	<div>
		<span class="block text-sm">Obecny status</span>
		<span class="block text-base font-semibold text-blue-600">{orderStatusList[defaultValue]}</span>
	</div>

	<fieldset>
		{#if availableEvents.length}
			<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
			<label use:melt={$label}>
				<span class="text-sm font-medium text-right">Status<RequiredAsterisk {required} /></span>
			</label>
			<div class="relative">
				{#if $selected}
					<input type="hidden" name="event" value={$selected.value} />
				{/if}

				<input
					use:melt={$input}
					class="flex items-center justify-between w-full h-10 px-3 pr-12 rounded-lg bg-input"
					placeholder="Zmień status"
					spellcheck="false"
				/>
				<div class="absolute z-10 -translate-y-1/2 right-2 top-1/2">
					{#if $open}
						<ChevronUp class="square-4" />
					{:else}
						<ChevronDown class="square-4" />
					{/if}
				</div>
			</div>
		{/if}
	</fieldset>
</div>
{#if $open && filteredStatusList.length}
	<ul
		class="z-20 flex max-h-[300px] flex-col overflow-hidden rounded-lg bg-background"
		use:melt={$menu}
		transition:slide={{ duration: 150 }}
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div class="flex flex-col max-h-full gap-0 px-2 py-2 overflow-y-auto" tabindex="0">
			{#each filteredStatusList as event, index (index)}
				<li
					use:melt={$option(toOption(event))}
					class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4 hover:bg-pink-100 data-[highlighted]:bg-pink-200 data-[highlighted]:text-pink-900 data-[disabled]:opacity-50"
				>
					{#if $isSelected(event)}
						<div class="absolute z-10 text-pink-900 check left-2 top-1/2">
							<Check class="square-4" />
						</div>
					{/if}
					<div class="pl-4">
						<span class="font-medium">{orderEventsList[event]}</span>
					</div>
				</li>
			{:else}
				<li class="relative py-1 pl-8 pr-4 rounded-md cursor-pointer">Brak wyników</li>
			{/each}
		</div>
	</ul>
{/if}

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2;
		translate: 0 calc(-50% + 1px);
	}
</style>
