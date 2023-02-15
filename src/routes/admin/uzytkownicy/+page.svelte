<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		Button,
		Modal,
		Label,
		Input,
		Table,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Tooltip
	} from 'flowbite-svelte';
	import { ExternalLink } from 'lucide-svelte';
	import NewUserModal from '$components/Modals/NewUserModal.svelte';
	import EditUserModal from '$components/Modals/EditUserModal.svelte';
	import TableHeader from '$components/TableHeader.svelte';

	import { textCrusher } from '$lib/client/functions';
	import { roleNames } from '$lib/client/constants';

	let searchInput: string;

	let usersList: typeof data.users;
	$: users = data.users.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
	$: usersList = searchInput
		? users.filter(
				(user) =>
					textCrusher(user.email).includes(textCrusher(searchInput)) ||
					textCrusher(user.fullName).includes(textCrusher(searchInput))
		  )
		: users;

	let newUserModalOpen = false;
	let editUserModalOpen = false;

	let editModalUserId: string;

	const openEditModal = (id: string) => {
		editModalUserId = id;
		editUserModalOpen = true;
	};

	$: editUserModal = usersList.find((user) => user.id === editModalUserId);

	export let data: import('./$types').PageData;
</script>

<section class="w-full h-full p-2 space-y-3">
	<TableHeader bind:searchInput bind:newUserModalOpen />
	<NewUserModal bind:newUserModalOpen />
	<EditUserModal bind:editUserModalOpen bind:editUserModal />

	<Table>
		<TableHead>
			<TableHeadCell>Użytkownik</TableHeadCell>
			<TableHeadCell>Rola</TableHeadCell>
			<TableHeadCell>Akcja</TableHeadCell>
			<TableHeadCell>Dołączył</TableHeadCell>
			<TableHeadCell>Profil</TableHeadCell>
		</TableHead>
		<tbody class="divide-y">
			{#each usersList as user}
				<TableBodyRow>
					<TableBodyCell>
						<span class="block">{user.fullName}</span>
						<span class="block">{user.email}</span>
					</TableBodyCell>
					<TableBodyCell>
						<span
							class={`${user.role === 'admin' ? 'text-red-400' : ''} ${
								user.role === 'moderator' ? 'text-green-300' : ''
							} ${user.role === 'customer' ? 'text-blue-400' : ''}`}>{roleNames[user.role]}</span
						>
					</TableBodyCell>
					<TableBodyCell>
						<button
							on:click={() => openEditModal(user.id)}
							type="button"
							class="font-medium hover:text-blue-600 dark:hover:text-blue-500">Edytuj</button
						>
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
	{#if usersList.length === 0}
		<div class="w-full h-20 flex justify-center items-center text-center">
			<span class="text-3xl">Brak wyników... 🧐</span>
		</div>
	{/if}
</section>
