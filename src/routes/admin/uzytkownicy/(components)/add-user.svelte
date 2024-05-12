<script lang="ts">
	import { page } from '$app/stores';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$shadcn/form';
	import * as Dialog from '$shadcn/dialog';
	import * as Select from '$components/ui/select';

	import { userRoles } from '$lib/client/constants/dbTypes';
	import { roleNames } from '$lib/client/constants';
	import { products$, user$ } from '$lib/client/schemas';
	import type { AddUserForm } from '$lib/client/schemas/user';
	import { buttonVariants } from '$shadcn/button';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';
	import { getAvailableRoleNames } from '$lib/client/functions';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Input } from '$components/ui/input';
	import Spinner from '$components/custom/Util/Spinner.svelte';

	const noAdminRoles = userRoles.filter((role) => role !== 'admin');

	export let superform: SuperValidated<Infer<AddUserForm>>;

	const availableRoleNames = getAvailableRoleNames($page.data.me?.role);

	let open = false;

	const form = superForm(superform, {
		validators: zodClient(user$.addForm),
		onUpdated: ({ form: f }) => {
			console.log(f, f.message, f.posted, f.errors);
			if (f.valid) {
				open = false;
				// toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
				toast.success(`Sukces`);
			} else {
				toast('Błąd');
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
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Dodaj użytkownika</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Dodaj użytkownika</Dialog.Title>
			<Dialog.Description>
				Po dodaniu, użytkownik będzie mógł zalogować się do aplikacji
			</Dialog.Description>
		</Dialog.Header>

		<form method="POST" class="flex flex-col gap-y-2" action="?/add" use:enhance>
			<Form.Field {form} name="fullName">
				<Form.Control let:attrs>
					<Form.Label>Imię i nazwisko<RequiredAsterisk /></Form.Label>
					<Input
						{...attrs}
						bind:value={$formData.fullName}
						required
						placeholder="Jan Kowalski"
						spellcheck="false"
						type="text"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email<RequiredAsterisk /></Form.Label>
					<Input
						{...attrs}
						type="email"
						required
						placeholder="jan.kowalski@gmail.com"
						spellcheck="false"
						bind:value={$formData.email}
					/>
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="phone">
				<Form.Control let:attrs>
					<Form.Label>Numer telefonu<RequiredAsterisk /></Form.Label>
					<Input
						{...attrs}
						bind:value={$formData.phone}
						type="tel"
						placeholder="123456789"
						required
						minlength={9}
					/>
					<Form.FieldErrors />
				</Form.Control>
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
