<script lang="ts">
	import { page } from '$app/stores';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$shadcn/form';
	import * as Dialog from '$shadcn/dialog';

	import { userRoles, type UserRole } from '$lib/client/constants/dbTypes';
	import { roleNames } from '$lib/client/constants';
	import { user$ } from '$lib/client/schemas';
	import type { EditUserForm } from '$lib/client/schemas/user';
	import { buttonVariants } from '$shadcn/button';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';
	import type { User } from '$types';
	import { cn, parseAddress, phoneParser } from '$lib/client/functions';
	import { writable } from 'svelte/store';
	import UserId from './user-id.svelte';
	import Feedback from '$components/custom/Form/Feedback.svelte';
	import Spinner from '$components/custom/Util/Spinner.svelte';

	type ExtendedUser = import('../$types').PageServerData['users'];

	export let label: string;
	export let key: keyof ExtendedUser[number];
	export let value: ExtendedUser[number][keyof ExtendedUser[number]];
	let user: ExtendedUser[number];

	export { user as item };

	const noAdminRoles = userRoles.filter((role) => role !== 'admin');

	export let form: SuperValidated<EditUserForm>;
	console.log('user role', $page.data.user?.role, user.role);
	const roles = $page.data.user?.role === 'admin' ? userRoles : noAdminRoles;

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
		<Form.Root
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
		>
			{#if key === 'fullName'}
				<Form.Field {config} name="fullName">
					<Form.Item>
						<Form.Label>Imię i nazwisko<RequiredAsterisk /></Form.Label>
						<Form.Input required value={user.fullName} spellcheck="false" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{:else if key === 'email'}
				<Form.Field {config} name="email">
					<Form.Item>
						<Form.Label>{label}<RequiredAsterisk /></Form.Label>
						<Form.Input type="email" required spellcheck="false" value={user.email} />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{:else if key === 'phone'}
				<Form.Field {config} name="phone">
					<Form.Item>
						<Form.Label>Numer telefonu<RequiredAsterisk /></Form.Label>
						<Form.Input type="tel" required minlength={9} value={user.phone} />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{:else if key === 'role'}
				<Form.Field {config} name="role">
					<Form.Item>
						<Form.Label>Rola<RequiredAsterisk /></Form.Label>
						<Form.Select
							required
							selected={{
								value: user.role,
								label: roleNames[user.role]
							}}
						>
							<Form.SelectTrigger placeholder="Wybierz rolę" />
							<Form.SelectContent>
								{#each roles as role}
									<Form.SelectItem value={role}>{roleNames[role]}</Form.SelectItem>
								{/each}
							</Form.SelectContent>
						</Form.Select>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{:else if key === 'address'}
				<Form.Field {config} name="city">
					<Form.Item>
						<Form.Label>Miasto<RequiredAsterisk /></Form.Label>
						<Form.Input required value={user.address?.city} spellcheck="false" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>

				<Form.Field {config} name="zipCode">
					<Form.Item>
						<Form.Label>Kod pocztowy<RequiredAsterisk /></Form.Label>
						<Form.Input required minlength={5} value={user.address?.zipCode} spellcheck="false" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>

				<Form.Field {config} name="street">
					<Form.Item>
						<Form.Label>Ulica i numer domu<RequiredAsterisk /></Form.Label>
						<Form.Input required value={user.address?.street} spellcheck="false" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{/if}

			<Form.Field {config} name="id">
				<UserId userId={user.id} />
			</Form.Field>

			<Feedback {message} {timeout} />

			<div class="flex justify-end">
				<Form.Button class="w-20" disabled={submitting}>
					{#if delayed}
						<Spinner />
					{:else}
						Zapisz
					{/if}
				</Form.Button>
			</div>
		</Form.Root>
	</Dialog.Content>
</Dialog.Root>
