<script lang="ts">
	import type { GridTableColumn, User } from '$types';
	import Grid from 'gridjs-svelte';
	import plPL from '$lib/client/constants/gridLocalePL';
	import { h } from 'gridjs';

	let adviserId: string | undefined;

	const columns: GridTableColumn[] = [
		{
			name: 'Imię i nazwisko',
			hidden: true
		},
		{
			name: 'Email',
			hidden: true
		},
		{
			name: 'Imię i nazwisko',
			formatter: (cell) => {
				if (!cell || !Array.isArray(cell)) return 'Błąd ⚠️';

				return h('div', { class: 'flex flex-col' }, [
					h('span', { class: 'text-base-content' }, cell[0]),
					h('span', { class: 'text-xs text-gray-500' }, cell[1])
				]);
			}
		},
		{
			name: 'Akcja',
			sort: false,
			formatter: (cell, row) => {
				const id = cell?.toString();
				if (!id) return 'Błąd ⚠️';

				return h(
					'button',
					{
						class: 'btn btn-sm btn-secondary duration-150',
						onClick: () => {
							adviserId = id;
						},
						'adviser-id': id
					},
					'Wybierz'
				);
			}
		}
	];

	type Adviser = Pick<User, 'id' | 'fullName' | 'email'>;
</script>

<Grid
	language={plPL}
	search={{
		ignoreHiddenColumns: false
	}}
	sort
	{columns}
	server={{
		url: '/api/advisers',
		then: (data) =>
			data.advisers.map((adviser) => [
				adviser.fullName,
				adviser.email,
				[adviser.fullName, adviser.email],
				adviser.id
			])
	}}
/>

<input hidden bind:value={adviserId} name="assignedAdviser" />
