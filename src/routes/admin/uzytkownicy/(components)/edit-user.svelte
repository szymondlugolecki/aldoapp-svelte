<script lang="ts">
	import { page } from '$app/stores';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$shadcn/form';
	import * as Dialog from '$shadcn/dialog';
	import * as Select from '$shadcn/select';
	import * as Command from '$shadcn/command';
	import * as Popover from '$shadcn/popover';

	import { roleNames } from '$lib/client/constants';
	import { user$ } from '$lib/client/schemas';
	import type { EditUserForm } from '$lib/client/schemas/user';
	import { Button, buttonVariants } from '$shadcn/button';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';
	import { cn, getAvailableRoleNames, parseAddress, phoneParser } from '$lib/client/functions';

	import Spinner from '$components/custom/Util/Spinner.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Input } from '$components/ui/input';
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { CaretSort } from 'radix-icons-svelte';

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

	const availableRoleNames = getAvailableRoleNames($page.data.user?.role);

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
		validators: zodClient(user$.editForm),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				open = false;
				console.log(f, f.message, f.posted, f.errors);
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
		<!-- <Form.Root
			method="POST"
			action="?/edit"
			{form}
			let:message
			let:delayed
			let:timeout
			let:submitting
			schema={user$.editForm}
			let:config
			class="flex flex-col gap-y-2"
			options={{
				onResult: ({ result }) => {
					console.log('result', result);
					if (result.type === 'success') {
						open = false;
					}
				},
				id: user.id,
				delayMs: 1000,
				timeoutMs: 8000
			}}
		> -->
		<form method="POST" action="?/edit" use:enhance class="flex flex-col gap-y-2">
			{#if key === 'fullName'}
				<Form.Field {form} name="fullName">
					<Form.Control let:attrs>
						<Form.Label>Imię i nazwisko<RequiredAsterisk /></Form.Label>
						<Input {...attrs} required bind:value={$formData.fullName} spellcheck="false" />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{:else if key === 'email'}
				<Form.Field {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>{label}<RequiredAsterisk /></Form.Label>
						<Input
							{...attrs}
							type="email"
							required
							spellcheck="false"
							bind:value={$formData.email}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{:else if key === 'phone'}
				<Form.Field {form} name="phone">
					<Form.Control let:attrs>
						<Form.Label>Numer telefonu<RequiredAsterisk /></Form.Label>
						<Input {...attrs} type="tel" required minlength={9} bind:value={$formData.phone} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{:else if key === 'role'}
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
								{#each Object.entries(availableRoleNames) as [label, value]}
									<Select.Item {value} {label} />
								{/each}
							</Select.Content>
						</Select.Root>
						<input hidden bind:value={$formData.role} name={attrs.name} />
					</Form.Control>
					<Form.Description>Wybierz rolę dla użytkownika</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			{:else if key === 'address'}
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
			{:else if key === 'adviser'}
				{#if $page.data.user?.role === 'admin'}
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
							<!-- <Popover.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								variant="outline"
								role="combobox"
								aria-expanded={open}
								class="w-[200px] justify-between"
								{...attrs}
							>
								{selectedValue}
								<ChevronsUpDown class="w-4 h-4 ml-2 opacity-50 shrink-0" />
							</Button>
						</Popover.Trigger> -->
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
					<!-- {#if advisers}
						<Form.Field {form} name="adviserId">
							<Form.Control let:attrs>
								<Form.Label>Wybierz doradcę</Form.Label>
								<Form.Select>
									<Form.SelectTrigger placeholder="Wybierz spośród użytkowników z rolą doradcy" />
									<Form.SelectContent>
										{#each advisersCombobox as adviser}
											<Form.SelectItem bind:value={adviser.id}>{adviser.fullName}</Form.SelectItem>
										{:else}
											Brak doradców
										{/each}
									</Form.SelectContent>
								</Form.Select>
								<Form.Description>
									Wybrany doradca będzie mógł zamawiać w imieniu tego użytkownika.
								</Form.Description>
								<Form.FieldErrors />
							</Form.Control>
						</Form.Field>
					{:else}
						<span>Brak doradców</span>
					{/if} -->
				{:else}
					<span>{user.adviser?.fullName || 'Brak'}</span>
				{/if}
			{/if}

			<Form.Field {form} name="id" hidden={true}>
				<Form.Control let:attrs>
					<input {...attrs} type="hidden" bind:value={user.id} />
				</Form.Control>
			</Form.Field>

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
		</form>
	</Dialog.Content>
</Dialog.Root>
