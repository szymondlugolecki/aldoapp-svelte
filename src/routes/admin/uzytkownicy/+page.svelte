<script lang="ts">
	import { Table, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { CheckCircle, ExternalLink, XCircle, Edit } from 'lucide-svelte';
	import NewUserModal from '$components/Modals/User/NewUserModal.svelte';
	import EditUserModal from '$components/Modals/User/EditUserModal.svelte';
	import TableHeader from '$components/UserTableHeader.svelte';

	import { applyUserFilters, textCrusher } from '$lib/client/functions';
	import { roleNames } from '$lib/client/constants';
	import type { UserFilter } from '$types';
	import UserFilterModal from '$components/Modals/User/UserFilterModal.svelte';
	import { page } from '$app/stores';

	let searchInput = '';

	let filter: UserFilter = {
		blocked: true,
		nonblocked: true,
		roles: {
			admin: true,
			moderator: true,
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
			textCrusher(user.fullName).includes(textCrusher(searchInput))
	);

	let newUserModalOpen = false;
	let editUserModalOpen = false;
	let filterUserModalOpen = false;

	let editModalUserId: string;

	const openEditModal = (id: string) => {
		editModalUserId = id;
		editUserModalOpen = true;
	};

	$: editUserModal = users.find((user) => user.id === editModalUserId);

	export let data: import('./$types').PageData;
</script>

<section class="w-full h-full p-2 space-y-3">
	<TableHeader bind:searchInput bind:newUserModalOpen bind:filterUserModalOpen />
	<NewUserModal bind:newUserModalOpen />
	<EditUserModal bind:editUserModalOpen bind:editUserModal />
	<UserFilterModal bind:filter bind:filterUserModalOpen />

	<Table>
		<TableHead>
			<TableHeadCell>Użytkownik</TableHeadCell>
			<TableHeadCell>Rola</TableHeadCell>
			<TableHeadCell>Akcja</TableHeadCell>
			<TableHeadCell>Dostęp</TableHeadCell>
			<TableHeadCell>Dołączył(a)</TableHeadCell>
			<TableHeadCell>Profil</TableHeadCell>
		</TableHead>
		<tbody class="divide-y">
			{#each users as user}
				<TableBodyRow>
					<TableBodyCell>
						<span class="block">{user.fullName}</span>
						<span class="block">{user.email}</span>
					</TableBodyCell>
					<TableBodyCell>
						<span
							class={`${user.role === 'admin' ? 'text-red-400' : ''} ${
								user.role === 'moderator' ? 'text-green-400' : ''
							} ${user.role === 'customer' ? 'text-blue-400' : ''}`}>{roleNames[user.role]}</span
						>
					</TableBodyCell>
					<TableBodyCell>
						{#if user.role !== 'admin' || user.id === $page.data.user?.id}
							<button
								on:click={() => openEditModal(user.id)}
								type="button"
								class="font-medium hover:text-blue-600 dark:hover:text-blue-500 flex items-center"
							>
								<Edit class="mr-2" /> Edytuj</button
							>
						{:else}
							<span>🚫</span>
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						{#if user.banned}
							<XCircle color="red" aria-label="Zablokowany" />
						{:else}
							<CheckCircle color="green" aria-label="Brak blokady" />
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						<div class="relative">
							<span class="peer">
								{user.createdAt.toLocaleDateString('pl-PL', {
									month: 'short',
									day: 'numeric',
									year: 'numeric'
								})}
							</span>
							<div
								role="tooltip"
								class="top-[-40px] left-[-40px] invisible peer-hover:visible inline-block absolute z-50 px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700"
							>
								{user.createdAt.toLocaleDateString('pl-PL', {
									month: 'long',
									day: 'numeric',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									second: '2-digit'
								})}
								<div class="tooltip-arrow" />
							</div>
						</div>
					</TableBodyCell>
					<TableBodyCell>
						<a
							rel="noreferrer"
							class="hover:text-blue-700"
							target="_blank"
							href={`/uzytkownik/${user.id}`}><ExternalLink /></a
						>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</tbody>
	</Table>
	{#if users.length === 0}
		<div class="w-full h-20 flex justify-center items-center text-center">
			<span class="text-3xl">Brak wyników... 🧐</span>
		</div>
	{/if}
</section>
