<script lang="ts">
	import { phoneParser } from '$lib/client/functions';
	import type { User } from '$types';
	import type { CellContext } from '@tanstack/svelte-table';
	import * as Avatar from '$shadcn/avatar';

	export let info: CellContext<User, unknown>;

	const user = info.table.options.data.find(
		(u) => u.id === info.row._getAllCellsByColumnId().id.getValue()
	) as User;

	const { id, fullName, email, phone } = user;

	const userInitials = `${fullName.split(' ')[0].charAt(0)}${fullName
		.split(' ')[1]
		.charAt(0)}`.toUpperCase();
</script>

<div class="flex items-center gap-x-2">
	<a href="/uzytkownik/{id}">
		<Avatar.Root>
			<Avatar.Fallback>{userInitials}</Avatar.Fallback>
		</Avatar.Root>
	</a>
	<div>
		<p>{fullName}</p>
		<p>{email}</p>
		<p>{phoneParser(phone) || 'Brak'}</p>
	</div>
</div>
