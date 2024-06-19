<script lang="ts">
	import { page } from '$app/stores';
	import { defaults, superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$shadcn/form';
	import * as Dialog from '$shadcn/dialog';
	import * as Select from '$shadcn/select';
	import * as Command from '$shadcn/command';
	import * as Popover from '$shadcn/popover';

	import { roleNames } from '$lib/client/constants';
	import { user$ } from '$lib/client/schemas';
	import type { EditUserForm } from '$lib/client/schemas/user';
	import { Button, buttonVariants } from '$shadcn/button';
	import RequiredAsterisk from '$components/custom/required-asterisk.svelte';
	import { cn, getAvailableRoleNames, parseAddress, phoneParser } from '$lib/client/functions';

	import Spinner from '$components/custom/spinner.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Input } from '$components/ui/input';
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { CaretSort } from 'radix-icons-svelte';
	import SuperDebug from 'sveltekit-superforms';

	type ExtendedUser = import('../$types').PageServerData['users'][number];
	type Advisers = import('../$types').PageServerData['advisers'];

	export let label: string;
	export let key: keyof ExtendedUser;
	export let value: ExtendedUser[keyof ExtendedUser];
	export let advisers: Advisers | undefined = undefined;
	let user: ExtendedUser;

	const advisersCombobox = advisers
		? advisers.map((adviser) => ({
				label: adviser.fullName,
				value: adviser.id
		  }))
		: [];

	export { user as item };

	const availableRoleNames = getAvailableRoleNames($page.data.me?.role);

	export let superform: SuperValidated<Infer<EditUserForm>>;

	let cellOverride: string | undefined = undefined;

	if (key === 'phone') {
		cellOverride = phoneParser(user.phone);
	} else if (key === 'role') {
		cellOverride = roleNames[user.role];
	} else if (key === 'adviser') {
		cellOverride = user.adviser?.fullName || 'Brak';
	} else if (key === 'address') {
		cellOverride = parseAddress(user.address) || 'Brak';
	}

	let open = false;

	const form = superForm(superform, {
		id: `${key}-${user.id}`,
		validators: zod(user$.editForm),
		onUpdated: ({ form: f }) => {
			console.log(f, f.message, f.posted, f.errors);
			if (f.valid) {
				open = false;
				// toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
				toast.success(`Sukces`);
			} else {
				toast.error('Błąd');
			}
		}
	});
	const { form: formData, enhance, delayed, submitting } = form;

	$: selectedRole = $formData.role
		? {
				label: roleNames[$formData.role],
				value: $formData.role
		  }
		: undefined;

	switch (key) {
		case 'id':
			break;
		case 'createdAt':
			break;
		case 'adviser':
			break;
		case 'address':
			$formData.city = user.address.city;
			$formData.zipCode = user.address.zipCode;
			$formData.street = user.address.street;
			break;
		case 'role':
			$formData.role = user.role;
			break;
		default:
			$formData[key] = user[key];
			break;
	}

	let adviserPopoverOpen = false;
	let selectedAdviser = '';

	$: selectedValue = advisersCombobox.find((f) => f.value === value)?.label ?? 'Wybierz doradcę...';

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

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'link' }), 'whitespace-pre')}
		>{cellOverride || value}</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edytuj użytkownika</Dialog.Title>
			<Dialog.Description>Po dokonaniu zmian wciśnij przycisk Zapisz</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/edit" use:enhance class="flex flex-col gap-y-2">
			<Form.Field {form} name="fullName">
				<Form.Control let:attrs>
					<Form.Label>Imię i nazwisko<RequiredAsterisk /></Form.Label>
					<Input {...attrs} required bind:value={$formData.fullName} spellcheck="false" />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>{label}<RequiredAsterisk /></Form.Label>
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
			{#if $page.data.me?.role === 'admin'}
				<Form.Field {form} name="adviserId" class="flex flex-col">
					<Popover.Root bind:open let:ids>
						<Form.Control let:attrs>
							<Form.Label>Doradca</Form.Label>
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
							<input hidden value={$formData.adviserId} name={attrs.name} />
						</Form.Control>

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
					</Popover.Root>
					<Form.Description>
						Wybierz doradcę, który będzie mógł zamawiać w imieniu tego użytkownika.
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			{:else}
				<span>{user.adviser?.fullName || 'Brak'}</span>
			{/if}
			<!-- <input type="hidden" name="id" bind:value={$formData.id} /> -->

			<!-- <Feedback {message} {timeout} /> -->

			<div class="flex justify-end">
				<Form.Button class="w-20" disabled={$submitting}>
					{#if $delayed}
						<Spinner />
					{:else}
						Zapisz
					{/if}
				</Form.Button>
			</div>

			<!-- <SuperDebug data={$formData} /> -->
		</form>
	</Dialog.Content>
</Dialog.Root>
