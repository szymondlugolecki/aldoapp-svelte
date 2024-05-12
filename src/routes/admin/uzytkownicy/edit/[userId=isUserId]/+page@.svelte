<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$shadcn/form';
	import * as Select from '$shadcn/select';
	import * as Command from '$shadcn/command';
	import * as Popover from '$shadcn/popover';

	import { roleNames } from '$lib/client/constants';
	import { user$ } from '$lib/client/schemas';
	import { Button, buttonVariants } from '$shadcn/button';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';
	import { cn, getAvailableRoleNames, parseAddress, phoneParser } from '$lib/client/functions';
	import { browser } from '$app/environment';

	import Spinner from '$components/custom/Util/Spinner.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Input } from '$components/ui/input';
	import { Check, ChevronsUpDown, RotateCcw, Save, Undo2 } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';
	import { CaretSort } from 'radix-icons-svelte';
	import SuperDebug from 'sveltekit-superforms';
	import { Separator } from '$shadcn/separator';
	import EditLayout from '$routes/admin/(components)/edit-layout.svelte';
	import EditPageNavigationButtons from '$routes/admin/(components)/edit-page-navigation-buttons.svelte';

	export let data;

	const advisersCombobox = data.advisers
		? data.advisers.map((adviser) => ({
				label: adviser.fullName,
				value: adviser.id
		  }))
		: [];
	const availableRoleNames = getAvailableRoleNames($page.data.me?.role);

	const form = superForm(data.form, {
		id: data.user.id,
		validators: zod(user$.editForm),
		onUpdated: ({ form: f }) => {
			console.log(f, f.message, f.posted, f.errors);
			if (f.valid) {
				toast.success(`Sukces`);
			} else {
				toast.error('Błąd');
			}
		},
		invalidateAll: true
	});
	const { form: formData, enhance, delayed, submitting, reset } = form;

	// export const snapshot = { capture, restore };

	$: selectedRole = $formData.role
		? {
				label: roleNames[$formData.role],
				value: $formData.role
		  }
		: undefined;

	// Adviser combobox open/closed
	let open = false;

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<EditLayout>
	<h1 class="text-3xl font-extrabold tracking-tight scroll-m-20 lg:text-4xl">Edycja użytkownika</h1>
	<form method="POST" action="?/edit" use:enhance class="flex flex-col max-w-md gap-y-2">
		<Form.Field {form} name="id">
			<Form.Control let:attrs>
				<input hidden bind:value={$formData.id} name={attrs.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="fullName">
			<Form.Control let:attrs>
				<Form.Label>Imię i nazwisko<RequiredAsterisk /></Form.Label>
				<Input {...attrs} required bind:value={$formData.fullName} spellcheck="false" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email<RequiredAsterisk /></Form.Label>
				<Input {...attrs} type="email" required spellcheck="false" bind:value={$formData.email} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="phone">
			<Form.Control let:attrs>
				<Form.Label>Numer telefonu<RequiredAsterisk /></Form.Label>
				<Input {...attrs} type="tel" required minlength={9} bind:value={$formData.phone} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Separator />

		<Form.Field {form} name="role">
			<Form.Control let:attrs>
				<Form.Label>Rola<RequiredAsterisk /></Form.Label>
				<Select.Root
					selected={selectedRole}
					onSelectedChange={(v) => {
						v && ($formData.role = v.value);
					}}
				>
					<Select.Trigger {...attrs}>
						<Select.Value placeholder="Wybierz rolę dla użytkownika" />
					</Select.Trigger>
					<Select.Content>
						{#each Object.entries(availableRoleNames) as [value, label]}
							<Select.Item {value} {label} />
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.role} name={attrs.name} />
			</Form.Control>
			<Form.Description>Wybierz rolę dla użytkownika</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Separator />

		<Form.Field {form} name="adviserId" class="flex flex-col">
			<Popover.Root bind:open let:ids>
				<Form.Control let:attrs>
					<Form.Label>Doradca</Form.Label>
					{#if $page.data.me?.role === 'admin'}
						<Popover.Trigger
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'w-[200px] justify-between',
								!$formData.role && 'text-muted-foreground'
							)}
							role="combobox"
							{...attrs}
						>
							{advisersCombobox.find((f) => f.value === $formData.adviserId)?.label ??
								'Wybierz doradcę'}
							<CaretSort class="w-4 h-4 ml-2 opacity-50 shrink-0" />
						</Popover.Trigger>

						<input hidden bind:value={$formData.adviserId} name={attrs.name} />
					{/if}
				</Form.Control>
				{#if $page.data.me?.role === 'admin'}
					<Popover.Content class="w-[200px] p-0">
						<Command.Root>
							<Command.Input autofocus placeholder="Szukaj doradców" class="h-9" />
							<Command.Empty>Brak doradców</Command.Empty>
							<Command.Group>
								{#each advisersCombobox as adviser}
									<Command.Item
										value={adviser.value}
										onSelect={() => {
											$formData.adviserId = adviser.value;
											closeAndFocusTrigger(ids.trigger);
										}}
									>
										{adviser.label}
										<Check
											class={cn(
												'ml-auto h-4 w-4',
												adviser.value !== $formData.adviserId && 'text-transparent'
											)}
										/>
									</Command.Item>
								{/each}
							</Command.Group>
						</Command.Root>
					</Popover.Content>
				{:else}
					<span>{data.user.adviser?.fullName || 'Brak'}</span>
				{/if}
			</Popover.Root>
			<Form.Description>
				Wybierz doradcę, który będzie mógł zamawiać w imieniu tego użytkownika.
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Separator />

		<Form.Field {form} name="city">
			<Form.Control let:attrs>
				<Form.Label>Miasto<RequiredAsterisk /></Form.Label>
				<Input {...attrs} required bind:value={$formData.city} spellcheck="false" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="zipCode">
			<Form.Control let:attrs>
				<Form.Label>Kod pocztowy<RequiredAsterisk /></Form.Label>
				<Input
					{...attrs}
					required
					minlength={5}
					bind:value={$formData.zipCode}
					spellcheck="false"
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="street">
			<Form.Control let:attrs>
				<Form.Label>Ulica i numer domu<RequiredAsterisk /></Form.Label>
				<Input {...attrs} required bind:value={$formData.street} spellcheck="false" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<EditPageNavigationButtons delayed={$delayed} submitting={$submitting} {reset} />

		<!-- <SuperDebug data={$formData} /> -->
	</form>
</EditLayout>
