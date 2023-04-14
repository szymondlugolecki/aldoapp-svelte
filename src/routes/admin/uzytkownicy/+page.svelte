<script lang="ts">
	import { CheckCircle, ExternalLink, XCircle, Edit } from 'lucide-svelte';
	import NewUser from '$components/Modals/User/NewUser.svelte';
	import EditUserModal from '$components/Modals/User/EditUser.svelte';
	import TableHeader from '$components/Table/TableHeader.svelte';

	import { applyUserFilters, textCrusher } from '$lib/client/functions';
	import { roleNames } from '$lib/client/constants';
	import type { UserFilter } from '$types';
	import UserFilterModal from '$components/Modals/User/FilterUsers.svelte';
	import { page } from '$app/stores';
	import Table from '$components/Table/Table.svelte';
	import Drawer from '$components/AdminDrawer.svelte';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import EditUser from '$components/Modals/User/EditUser.svelte';
	import FilterUsers from '$components/Modals/User/FilterUsers.svelte';

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
</script>

<svelte:head>
	<title>Użytkownicy • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista użytkowników zarejestrowanych w Twoje ALDO. Dodaj, edytuj lub zablokuj."
	/>
</svelte:head>

<section class="w-full h-full p-2 space-y-3">
	<TableHeader type="user" bind:searchInput />

	<Table
		type="users"
		userHeaders={['user', 'role', 'action', 'access', 'joined', 'profile']}
		items={users}
		isLoading={false}
	/>

	<Drawer>
		{#if $drawer && $drawer.type === 'user'}
			{#if $drawer.action === 'add'}
				<NewUser advisers={data.advisers} />
			{:else if $drawer.action === 'edit'}
				<EditUser user={getUserFromDrawer()} />
			{:else if $drawer.action === 'filter'}
				<FilterUsers bind:filter />
			{/if}
		{/if}
	</Drawer>
</section>
