<script lang="ts">
	import { page } from '$app/stores';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$shadcn/form';
	import * as Dialog from '$shadcn/dialog';

	import { userRoles } from '$lib/client/constants/dbTypes';
	import { roleNames } from '$lib/client/constants';
	import { user$ } from '$lib/client/schemas';
	import type { AddUserForm } from '$lib/client/schemas/user';
	import { buttonVariants } from '$shadcn/button';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';
	import { cn } from '$lib/client/functions';

	const noAdminRoles = userRoles.filter((role) => role !== 'admin');

	export let form: SuperValidated<AddUserForm>;
	const roles = $page.data.user?.role === 'admin' ? userRoles : noAdminRoles;

	let open = false;
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
		<Form.Root
			method="POST"
			action="?/add"
			{form}
			schema={user$.addForm}
			let:config
			class="flex flex-col gap-y-2"
			options={{
				onResult: ({ result }) => {
					console.log('result', result);
					if (result.type === 'success') {
						open = false;
					}
				}
			}}
		>
			<Form.Field {config} name="fullName">
				<Form.Item>
					<Form.Label>Imię i nazwisko<RequiredAsterisk /></Form.Label>
					<Form.Input required placeholder="Jan Kowalski" spellcheck="false" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="email">
				<Form.Item>
					<Form.Label>Email<RequiredAsterisk /></Form.Label>
					<Form.Input
						type="email"
						required
						placeholder="jan.kowalski@gmail.com"
						spellcheck="false"
					/>
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="phone">
				<Form.Item>
					<Form.Label>Numer telefonu<RequiredAsterisk /></Form.Label>
					<Form.Input type="tel" placeholder="123456789" required minlength={9} />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="role">
				<Form.Item>
					<Form.Label>Rola<RequiredAsterisk /></Form.Label>
					<Form.Select se required>
						<Form.SelectTrigger placeholder="Wybierz rolę" />
						<Form.SelectContent>
							{#each roles.filter((r) => r !== 'banned') as role}
								<Form.SelectItem value={role} class={cn(role === 'admin' && 'text-red-500')}
									>{roleNames[role]}</Form.SelectItem
								>
							{/each}
						</Form.SelectContent>
					</Form.Select>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<div class="flex justify-end">
				<Form.Button class="w-20">Dodaj</Form.Button>
			</div>
		</Form.Root>
	</Dialog.Content>
</Dialog.Root>
