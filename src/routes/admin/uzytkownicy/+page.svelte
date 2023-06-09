<script lang="ts">
	import { Row, h } from 'gridjs';
	import Grid from 'gridjs-svelte';
	import NewUser from '$components/Modals/User/NewUser.svelte';

	import { dateParser, getRoleRank, textCrusher } from '$lib/client/functions';
	import { roleNames } from '$lib/client/constants';
	import type { AdminUsersTableColumn, GridTableColumn, User, UserFilter } from '$types';
	import { page } from '$app/stores';
	import Drawer from '$components/AdminDrawer.svelte';
	import { drawer, getPropertyKey, openDrawer } from '$lib/client/stores/adminDrawer';
	import EditUser from '$components/Modals/User/EditUser.svelte';
	import { userRoles, type UserRole } from '$lib/client/constants/dbTypes.js';

	import plPL from '$lib/client/constants/gridLocalePL';
	import type { TCell } from 'gridjs/dist/src/types.js';

	export let data;

	const filter: {
		roles: {
			[key in UserRole]: boolean;
		};
		createdSince: Date | null;
		createdUntil: Date | null;
	} = {
		roles: {
			customer: true,
			adviser: true,
			driver: true,
			admin: true
		},
		createdSince: null,
		createdUntil: null
	};

	$: parsedUsers = data.users
		.reduce<AdminUsersTableColumn[]>((prev, acc) => {
			if (!prev) {
				prev = [];
			}

			prev.push({
				...acc.user,
				adviser: acc.adviser
			});

			return prev;
		}, [])
		.filter((user) => {
			if (filter.createdSince) {
				if (user.createdAt.getTime() < new Date(filter.createdSince).getTime()) {
					return false;
				}
			}

			if (filter.createdUntil) {
				if (user.createdAt.getTime() >= new Date(filter.createdUntil).getTime()) {
					return false;
				}
			}

			const disabledRoles = Object.keys(filter.roles).filter(
				(role) => filter.roles[role as UserRole] === false
			) as UserRole[];

			if (disabledRoles.includes(user.role)) {
				return false;
			}

			return true;
		});

	$: drawerUser =
		$drawer &&
		$drawer.action === 'edit' &&
		$drawer.type === 'user' &&
		parsedUsers.find((user) => $drawer?.action === 'edit' && user.id === $drawer.id);

	const columnHelper = (cell: TCell, row: Row, cellType: string | string[]) => {
		const id = row.cells[0].data;
		const fullName = row.cells[2].data;
		const role = row.cells[4].data;

		if (typeof cellType === 'string' && cellType !== typeof cell) {
			return { id: null, fullName: null, errorText: '⚠️', role: null };
		}
		if (Array.isArray(cellType) && !cellType.includes(typeof cell)) {
			return { id: null, fullName: null, errorText: '⚠️', role: null };
		}
		if (typeof id !== 'string' || typeof fullName !== 'string') {
			return { id: null, fullName: null, errorText: '🛑', role: null };
		}
		if (typeof role !== 'string' || !Object.keys(roleNames).includes(role)) {
			return { id: null, fullName: null, errorText: '🛑', role: null };
		}

		return { id, fullName, errorText: null, role: role as UserRole };
	};

	const columns: GridTableColumn[] = [
		{
			name: 'Id',
			hidden: true
		},
		{
			name: 'Profil',
			formatter: (cell, row) => {
				return h(
					'a',
					{ href: `/uzytkownik/${row.cells[0].data}`, class: 'text-primary', target: '_blank' },
					'Sprawdź'
				);
			},
			sort: false
		},
		{
			name: 'Imię i nazwisko',
			sort: true,
			formatter: (cell, row) => {
				const { id, errorText } = columnHelper(cell, row, 'string');
				if (errorText !== null) {
					return errorText;
				}

				return h(
					'button',
					{
						class: 'hover:text-primary duration-150',
						onClick: () =>
							openDrawer({
								type: 'user',
								action: 'edit',
								id,
								key: 'fullName'
							})
					},
					cell
				);
			}
		},
		{
			name: 'Email',
			sort: true,
			formatter: (cell, row) => {
				const { id, fullName, errorText } = columnHelper(cell, row, 'string');
				if (errorText !== null) {
					return errorText;
				}

				return h(
					'button',
					{
						class: 'hover:text-primary duration-150',
						// 'email', cell, 'Adres email', { key: 'email' }, id
						onClick: () =>
							openDrawer({
								type: 'user',
								action: 'edit',
								id,
								key: 'email'
							})
					},
					cell
				);
			}
		},
		{
			name: 'Rola',
			formatter: (cell, row) => {
				const { id, fullName, errorText, role } = columnHelper(cell, row, 'string');
				const moderator = $page.data.user;

				if (errorText !== null) {
					return errorText;
				}

				if (!moderator) {
					return 'Błąd ⚠️';
				}

				if (!userRoles.includes(cell as UserRole)) return '⚠️';
				if (getRoleRank(role) < getRoleRank(moderator.role) || moderator.id === id) {
					return h(
						'button',
						{
							class: 'hover:text-primary duration-150',
							onClick: () =>
								openDrawer({
									type: 'user',
									action: 'edit',
									id,
									key: 'role'
								})
						},
						roleNames[cell as UserRole]
					);
				} else {
					return h('span', {}, roleNames[cell as UserRole]);
				}
			},
			sort: true
		},
		{
			name: 'Telefon',
			formatter: (cell, row) => {
				const { id, fullName, errorText } = columnHelper(cell, row, 'string');
				if (errorText !== null) {
					return errorText;
				}

				return h(
					'button',
					{
						class: 'hover:text-primary duration-150',
						onClick: () =>
							openDrawer({
								type: 'user',
								action: 'edit',
								id,
								key: 'phone'
							})
					},
					cell
				);
			},
			sort: false
		},
		{
			name: 'Przypisany doradca',
			formatter: (adviser, row) => {
				const { id, fullName, errorText, role } = columnHelper(adviser, row, ['null', 'object']);
				if (errorText !== null) {
					return errorText;
				}

				// @ts-expect-error
				let adviserLabel = (typeof adviser === 'object' && adviser?.fullName) || 'Nieznany';

				if (role === 'customer') {
					return h(
						'button',
						{
							class: 'hover:text-primary duration-150',
							onClick: () =>
								openDrawer({
									type: 'user',
									action: 'edit',
									id,
									key: 'assignedAdviser'
								})
						},
						adviser ? adviserLabel : 'Brak'
					);
				} else {
					return h('span', {}, '-');
				}
			},
			sort: false
		},
		{
			name: 'Dostęp',
			formatter: (access, row) => {
				const { id, fullName, errorText, role } = columnHelper(access, row, 'boolean');
				const moderator = $page.data.user;

				if (errorText !== null) {
					return errorText;
				}

				if (!moderator) {
					return 'Błąd ⚠️';
				}

				// editing user with role lower than them or themself
				if (getRoleRank(role) < getRoleRank(moderator.role) || moderator.id === id) {
					return h(
						'button',
						{
							class: 'hover:text-primary duration-150',
							onClick: () =>
								openDrawer({
									type: 'user',
									action: 'edit',
									id,
									key: 'access'
								})
						},
						access ? '🟢' : '🔴'
					);
				} else {
					return h('span', {}, access ? '🟢' : '🔴');
				}
			},
			sort: true
		},
		{
			name: 'Dodano',
			formatter: (cell) => {
				if (!(cell instanceof Date)) return '⚠️';
				return dateParser(new Date(cell), 'medium');
			},
			sort: true
		}
	];
</script>

<svelte:head>
	<title>Użytkownicy • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista użytkowników zarejestrowanych w Twoje ALDO. Dodaj, edytuj lub zablokuj."
	/>
</svelte:head>

<section class="w-full h-full p-2 space-y-3">
	<div class="collapse border border-base-300 rounded-box">
		<input type="checkbox" />
		<div class="collapse-title text-xl font-medium">Filtrowanie</div>
		<div class="collapse-content">
			<div class="space-y-0.5">
				<span class="block label">Rola</span>

				<div class="grid grid-cols-2 sm:grid-cols-4">
					<label class="cursor-pointer label justify-start space-x-2">
						<input
							type="checkbox"
							bind:checked={filter.roles.customer}
							class="checkbox checkbox-info"
						/>
						<span class="label-text">Klient</span>
					</label>
					<label class="cursor-pointer label justify-start space-x-2">
						<input
							type="checkbox"
							bind:checked={filter.roles.driver}
							class="checkbox checkbox-success"
						/>
						<span class="label-text">Kierowca</span>
					</label>
					<label class="cursor-pointer label justify-start space-x-2">
						<input
							type="checkbox"
							bind:checked={filter.roles.adviser}
							class="checkbox checkbox-success"
						/>
						<span class="label-text">Doradca</span>
					</label>
					<label class="cursor-pointer label justify-start space-x-2">
						<input
							type="checkbox"
							bind:checked={filter.roles.admin}
							class="checkbox checkbox-error"
						/>
						<span class="label-text">Admin</span>
					</label>
				</div>
				<!-- Created date -->

				<span class="block label">Data utworzenia</span>

				<div class="grid grid-cols-1 xs:grid-cols-3 gap-2">
					<div class="w-full">
						<label for="joined-date-from" class="block text-sm text-base-content">Od</label>
						<input
							class="w-full sm:w-auto p-2 rounded-md"
							type="date"
							name="joined-date-from"
							bind:value={filter.createdSince}
						/>
					</div>
					<div class="w-full">
						<label for="joined-date-to" class="block text-sm text-base-content">Do</label>
						<input
							type="date"
							name="joined-date-to"
							class="w-full sm:w-auto p-2 rounded-md"
							bind:value={filter.createdUntil}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="">
		<button
			class="btn btn-primary"
			on:click={() => {
				openDrawer({
					action: 'add',
					type: 'user'
				});
			}}>Dodaj nowego użytkownika</button
		>
	</div>

	<Grid
		{columns}
		language={plPL}
		search
		fixedHeader
		className={{
			td: 'text-base-content',
			sort: 'text-base-content bg-base-content'
		}}
		data={parsedUsers.map((user) => {
			const { id, createdAt, email, fullName, role, access, phone, adviser } = user;
			const parsedUser = {
				id,
				profile: null,
				fullName,
				email,
				role,
				phone,
				adviser,
				access,
				createdAt
			};
			return Object.values(parsedUser);
		})}
	/>

	<!-- <AdminModal advisers={parsedUsers.filter(({ role }) => role === 'adviser')} /> -->

	<!-- <NewTable data={data.users} {columns} tableType="users" /> -->

	<Drawer>
		{#if $drawer && $drawer.type === 'user'}
			{#if $drawer.action === 'add'}
				<NewUser advisers={parsedUsers.filter(({ role }) => role === 'adviser')} />
			{:else if $drawer.action === 'edit' && drawerUser}
				<EditUser user={drawerUser} />
			{/if}
		{/if}
	</Drawer>
</section>

<style>
	:global(.gridjs-wrapper:nth-last-of-type(2)) {
		border-bottom: 0;
	}

	:global(th.gridjs-th) {
		background-color: hsl(var(--b1) / var(--tw-bg-opacity)) !important;
		color: hsl(var(--bc)) !important;
	}

	:global(td.gridjs-td) {
		background-color: hsl(var(--b1) / var(--tw-bg-opacity)) !important;
	}

	:global(.gridjs-search > input) {
		background-color: hsl(var(--b1) / var(--tw-bg-opacity)) !important;
		color: hsl(var(--bc)) !important;
	}
</style>
