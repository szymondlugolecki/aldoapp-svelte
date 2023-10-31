<script lang="ts">
	import { page } from '$app/stores';
	import { roleNames } from '$lib/client/constants';
	import { userRoles } from '$lib/client/constants/dbTypes';
	import { cn } from '$lib/client/functions';
	import type { Role } from '$types';
	import { createCombobox, type ComboboxFilterFunction, melt } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	export let defaultValue: Role;
	export let showLabel = true;

	const filterFunction: ComboboxFilterFunction<Role> = ({ input, itemValue }) => {
		// Example string normalization function. Replace as needed.
		const normalize = (str: string) => str.normalize().toLowerCase();
		const normalizedInput = normalize(input);
		return (
			normalizedInput === '' ||
			normalize(itemValue).includes(normalizedInput) ||
			normalize(roleNames[itemValue]).includes(normalizedInput)
		);
	};

	const {
		elements: { menu, input, option, label },
		states: { open, selected, isEmpty },
		helpers: { isSelected }
	} = createCombobox({
		filterFunction,
		forceVisible: true,
		defaultSelected: defaultValue
			? {
					value: defaultValue,
					label: roleNames[defaultValue]
			  }
			: undefined
	});

	//   value.subscribe((v) => {
	//       selectedValue = v as string | null;
	//   });

	const roles = [];
</script>

<div class={cn('flex gap-1', showLabel ? 'flex-col' : 'flex-row')}>
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->

	{#if showLabel}
		<label use:melt={$label}>
			<span class="block">Wybierz rolę:</span>
		</label>
	{/if}

	<div class="relative">
		<input type="hidden" name="role" value={$selected?.value} />
		<input
			use:melt={$input}
			class="flex h-10 items-center justify-between rounded-md px-3 pr-12 bg-background"
			placeholder="Rola"
			spellcheck="false"
		/>
		<div class="absolute right-1 top-1/2 z-10 -translate-y-1/2">
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
		class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-md"
		use:melt={$menu}
		transition:slide={{ duration: 150 }}
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div class="flex max-h-full flex-col gap-2 overflow-y-auto px-2 py-2" tabindex="0">
			{#each userRoles as role, index (index)}
				<li
					use:melt={$option({
						value: role,
						label: roleNames[role],
						disabled: role === 'admin' ? $page.data.user?.role !== 'admin' : false
					})}
					class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 bg-background data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground data-[disabled]:opacity-50"
				>
					{#if $isSelected(role)}
						<div class="check">
							<Check class="square-4" />
						</div>
					{/if}
					<div>
						<span>{roleNames[role]}</span>
					</div>
				</li>
			{/each}
			{#if $isEmpty}
				<li
					class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 bg-primary data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground/50"
				>
					Brak wyników
				</li>
			{/if}
		</div>
	</ul>
{/if}

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2;
		translate: 0 calc(-50% + 1px);
	}
</style>
