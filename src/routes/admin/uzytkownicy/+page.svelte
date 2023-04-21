<script lang="ts">
	import { html } from 'gridjs';
	import Grid from 'gridjs-svelte';
	import { SvelteWrapper } from 'gridjs-svelte/plugins';
	import { CheckCircle, ExternalLink, XCircle, Edit, X } from 'lucide-svelte';
	import NewUser from '$components/Modals/User/NewUser.svelte';
	import EditUserModal from '$components/Modals/User/EditUser.svelte';
	import TableHeader from '$components/Table/TableHeader.svelte';

	import { applyUserFilters, dateParser, textCrusher } from '$lib/client/functions';
	import { roleNames } from '$lib/client/constants';
	import type { GridTableColumn, UserFilter } from '$types';
	import UserFilterModal from '$components/Modals/User/FilterUsers.svelte';
	import { page } from '$app/stores';
	import Table from '$components/Table/Table.svelte';
	import Drawer from '$components/AdminDrawer.svelte';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import EditUser from '$components/Modals/User/EditUser.svelte';
	import FilterUsers from '$components/Modals/User/FilterUsers.svelte';
	import type { UserRole } from '$lib/client/constants/dbTypes.js';

	import plPL from '$lib/client/constants/gridLocalePL';
	import NewTable from '$components/NewTable/NewTable.svelte';
	import EditCell from '$components/NewTable/EditCell.svelte';

	export let data;

	let searchInput = '';

	let filter: UserFilter = {
		blocked: true,
		nonblocked: true,
		roles: {
			admin: true,
			driver: true,
			adviser: true,
			customer: true
		},
		since: null,
		until: new Date(new Date().setHours(23, 59, 59, 999))
			.toLocaleDateString()
			.split('.')
			.reverse()
			.join('-')
	};

	$: users = applyUserFilters(
		data.users.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
		filter
	).filter(
		(user) =>
			textCrusher(user.email).includes(textCrusher(searchInput)) ||
			textCrusher(user.fullName).includes(textCrusher(searchInput)) ||
			textCrusher(user.phone).includes(textCrusher(searchInput))
	);

	let editDrawerUserId: string;

	$: editUserModal = users.find((user) => user.id === editDrawerUserId);

	const getUserFromDrawer = () => {
		const drawerS = $drawer;
		if (drawerS && drawerS.action === 'edit' && drawerS.type === 'user') {
			const user = users.find((user) => user.id === drawerS.id);
			return user;
		}
	};

	interface UserColumnType extends GridTableColumn {
		key: keyof (typeof data.users)[0] | 'action';
	}

	const columns: UserColumnType[] = [
		{
			key: 'id',
			label: 'Id',
			hidden: true
		},
		// {
		// 	key: null,
		// 	label: 'Profil',
		// 	formatter: (cell: string, row: any) => {
		// 		return 'siema'; // html(`<a class="p-2" href="/uzytkownik/${row.cells[0].data}"><span>🔗</span></a>`);
		// 	},
		// 	sort: false
		// },
		{
			key: 'action',
			label: 'Rozwiń',
			sort: false,
			component: EditCell
		},
		{
			key: 'fullName',
			label: 'Imię i nazwisko',
			sort: true,
			editableType: 'text'
		},
		{
			key: 'email',
			label: 'Email',
			sort: true,
			editableType: 'text'
		},
		{
			key: 'role',
			label: 'Rola',
			formatter: (cell: UserRole) => {
				return roleNames[cell];
			},
			sort: true,
			editableType: 'role'
		},
		{
			key: 'phone',
			label: 'Telefon',
			sort: false,
			editableType: 'text'
		},
		{
			key: 'assignedAdviser',
			label: 'Przypisany doradca',
			formatter: (adviser: string) => {
				console.log('adviser', adviser);
				if (!adviser) return 'Brak';
				return adviser;
			},
			sort: true,
			editableType: 'user'
		},
		{
			key: 'access',
			label: 'Dostęp',
			formatter: (access: boolean) => {
				console.log('access', access);
				if (access) return '🟢';
				return '🔴';
			},
			sort: true,
			editableType: 'access'
		},
		{
			key: 'createdAt',
			label: 'Dodano',
			formatter: (cell: string) => {
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
	<!-- <TableHeader type="user" bind:searchInput />

	<Table
		type="users"
		userHeaders={['user', 'role', 'action', 'access', 'joined', 'profile']}
		items={users}
		isLoading={false}
	/> -->

	<!-- <Grid
		{columns}
		language={plPL}
		search
		fixedHeader
		data={data.users.map((user) => {
			const { id, createdAt, email, fullName, role, access, phone, assignedAdviser } = user;
			const parsedUser = {
				id,
				profile: null,
				fullName,
				email,
				role,
				phone,
				assignedAdviser,
				access,
				createdAt
			};
			return Object.values(parsedUser);
		})}
	/> -->

	<NewTable data={data.users} {columns} />

	<Drawer>
		{#if $drawer && $drawer.type === 'user'}
			{#if $drawer.action === 'add'}
				<NewUser advisers={data.users.filter(({ role }) => role === 'adviser')} />
			{:else if $drawer.action === 'edit'}
				<EditUser user={getUserFromDrawer()} />
			{:else if $drawer.action === 'filter'}
				<FilterUsers bind:filter />
			{/if}
		{/if}
	</Drawer>
</section>
