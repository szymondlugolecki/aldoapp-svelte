<script lang="ts">
	import { orderStatusList } from '$lib/client/constants';
	import { orderStatus, type OrderStatus } from '$lib/client/constants/dbTypes';
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	type ExtendedOrderStatus = OrderStatus | 'all';
	export let combobox: ReturnType<typeof createCombobox<ExtendedOrderStatus>>;
	const statusList: [...OrderStatus[], 'all'] = [...orderStatus, 'all'];

	const toOption = (status: ExtendedOrderStatus): ComboboxOptionProps<ExtendedOrderStatus> => ({
		value: status,
		label: status === 'all' ? 'Wszystkie' : orderStatusList[status]
	});

	const {
		elements: { menu, input, option, label },
		states: { open, selected, touchedInput, inputValue, highlighted },
		helpers: { isSelected }
	} = combobox;

	$: if (!$open) {
		$inputValue = $selected?.label ?? '';
	}

	$: filteredStatusList = $touchedInput
		? statusList.filter((status) => {
				const normalizedInput = $inputValue.toLowerCase();
				return (
					status.toLowerCase().includes(normalizedInput) ||
					normalizedInput.includes(status.toLowerCase())
				);
		  })
		: statusList;
</script>

<div class="flex flex-col gap-1">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label use:melt={$label}>
		<span class="text-sm font-medium">Status</span>
	</label>

	<div class="relative">
		{#if $selected}
			<input type="hidden" name="status_zamowienia" value={$selected.value} />
		{/if}
		<input
			use:melt={$input}
			class="flex items-center justify-between w-full h-10 px-3 pr-12 rounded-lg bg-input"
			placeholder="Wszystkie"
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
</div>
{#if $open}
	<ul
		class="z-20 flex max-h-[300px] flex-col overflow-hidden rounded-lg bg-background"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div class="flex flex-col max-h-full gap-0 px-2 py-2 overflow-y-auto" tabindex="0">
			{#each filteredStatusList as status, index (index)}
				<li
					use:melt={$option(toOption(status))}
					class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4 hover:bg-blue-100 data-[highlighted]:bg-blue-200 data-[highlighted]:text-blue-900 data-[disabled]:opacity-50"
				>
					{#if $isSelected(status)}
						<div class="absolute z-10 text-blue-900 check left-2 top-1/2">
							<Check class="square-4" />
						</div>
					{/if}
					<div class="pl-4">
						<span class="font-medium"
							>{status === 'all' ? 'Wszystkie' : orderStatusList[status]}</span
						>
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
		@apply absolute left-2 top-1/2 text-primary;
		translate: 0 calc(-50% + 1px);
	}
</style>
