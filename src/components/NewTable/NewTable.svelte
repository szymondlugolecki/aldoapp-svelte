<script lang="ts">
	import Alert from '$components/Alerts/Alert.svelte';
	import type { GridTableColumn } from '$types';
	import { ColumnsIcon } from 'lucide-svelte';
	import TableCell from './TableCell.svelte';
	import type { ComponentType } from 'svelte';

	type ObjectWithRenamedKey<T, K1 extends keyof T, K2 extends string> = Omit<T, K1> &
		Record<K2, T[K1]>;

	function renameKey<T, K1 extends keyof T, K2 extends string>(
		obj: T,
		oldKey: K1,
		newKey: K2
	): ObjectWithRenamedKey<T, K1, K2> {
		const { [oldKey]: old, ...rest } = obj;
		return {
			...rest,
			[newKey]: old
		} as ObjectWithRenamedKey<T, K1, K2>;
	}

	export let pagination = false;
	export let data: Record<string, unknown>[];
	export let columns: GridTableColumn[];
	export let tableName: 'users' | 'orders' | 'promocodes' | 'products' | 'categories';
	let extendedRow: string | null = null;

	console.log('table data', data);

	const columnNameSubstitutes: Record<string, string> = {};

	// Column names are taken from the first array element
	columns.forEach((column) => {
		if (column.key) columnNameSubstitutes[column.key] = column.label || column.key;
	});

	const extendRow = (id: string) => {
		extendedRow = extendedRow === id ? null : id;
	};

	// Prepare data for rendering
	$: modifiedData = data.map((user) => {
		console.log('user 0', user);

		// Handle columns order
		user = Object.fromEntries(
			columns.map((column) => {
				const value = user[column.key];
				return [column.key, value];
			})
		);

		console.log('user 1', user);

		// Handle hidden columns
		// user = Object.fromEntries(
		// 	Object.entries(user).reduce((acc, [key, value]) => {
		// 		const column = columns.find((column) => column.key === key);
		// 		console.log('column', column, '!column.hidden', !column?.hidden);
		// 		if (column && !column.hidden) {
		// 			acc.push([key, value as string]);
		// 		}
		// 		return acc;
		// 	}, [] as [string, string][])
		// );

		console.log('user 2', user);

		// Handle formatters
		// columns.forEach((column) => {
		// 	if (column.formatter) {
		// 		const value = user[column.key];
		// 		user[column.key] = column.formatter(value);
		// 	}
		// });

		return user;
	}) as Record<string, string>[];

	$: columnHeaders = Object.keys(modifiedData[0]).reduce<
		{
			name: string;
			hidden: boolean;
		}[]
	>((acc, key) => {
		const column = columns.find((column) => column.key === key);
		if (column && !column.hidden) {
			acc.push({
				name: column.label || column.key,
				hidden: !!column.hidden
			});
		}
		return acc;
	}, []);

	$: hiddenColumns = columns.filter((column) => column.hidden).map((column) => column.key);
	$: console.log('extendedRow', extendedRow);
</script>

<article class="w-full relative">
	<!-- content -->
	<div class="flex flex-col">
		<!-- Head -->
		<div class="py-3">
			<div class="relative max-w-xs">
				<label for="table-search" class="sr-only">Szukaj</label>
				<input
					type="text"
					name="table-search"
					id="table-search"
					class="p-3 pl-10 block w-full rounded-md text-sm border-red-500 focus:border-red-500 focus:ring-red-500 active:border-red-500 active:ring-red-500"
					placeholder="Szukaj..."
				/>
				<div class="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
					<svg
						class="h-3.5 w-3.5 text-base"
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
						/>
					</svg>
				</div>
			</div>
		</div>
		<!-- Table Content -->
		<div class="-m-1.5 overflow-x-auto">
			<div class="p-1.5 min-w-full inline-block align-middle">
				<div
					class="border rounded-lg divide-y divide-gray-200 dark:border-gray-700 dark:divide-gray-700"
				>
					<!-- Content -->
					<div class="overflow-hidden">
						<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<thead class="">
								{#each columnHeaders as column}
									<!-- Object.keys(modifiedData[0]).map((objKey) => columnNameSubstitutes[objKey]) as column -->
									{#if !column.hidden}
										<th
											scope="col"
											class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
											>{column.name}</th
										>
									{/if}
								{/each}
							</thead>
							<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
								{#each modifiedData as row}
									<tr class="" class:h-48={row.id === extendedRow}>
										{#each Object.entries(row) as [key, cell]}
											<!-- {console.log('cell', cell)} -->

											{#if typeof cell !== 'string' || !hiddenColumns.includes(key)}
												<TableCell
													isExtended={row.id === extendedRow}
													id={typeof row.id === 'string' ? row.id : undefined}
													column={columns.find((column) => column.key === key)}
													{extendRow}
													{cell}
													{tableName}
												/>
											{/if}
											<!-- {console.log('row', row)} -->
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<!-- Pagination -->
		{#if pagination}
			<div class="py-1 mt-2">
				<nav class="flex items-center space-x-2">
					<a
						class="hover:text-primary p-4 inline-flex items-center gap-2 font-medium rounded-md"
						href="/#"
					>
						<span aria-hidden="true">«</span>
						<span class="sr-only">Previous</span>
					</a>
					<a
						class="w-10 h-10 text-white bg-primary hover:bg-primary-focus p-4 inline-flex items-center text-sm font-medium rounded-full"
						href="/#"
						aria-current="page">1</a
					>
					<a
						class="w-10 h-10 hover:text-primary p-4 inline-flex items-center text-sm font-medium rounded-full"
						href="/#">2</a
					>
					<a
						class="w-10 h-10 hover:text-primary p-4 inline-flex items-center text-sm font-medium rounded-full"
						href="/#">3</a
					>
					<a
						class="hover:text-primary p-4 inline-flex items-center gap-2 font-medium rounded-md"
						href="/#"
					>
						<span class="sr-only">Next</span>
						<span aria-hidden="true">»</span>
					</a>
				</nav>
			</div>
		{/if}
	</div>

	<!-- <table class="table-auto border-collapse border border-base-300 w-full rounded-lg">
			<thead class="rounded-lg">
				{#each Object.keys(data[0]).map((objKey) => columnNameSubstitutes[objKey]) as column}
					<th class="px-4 py-2 border border-base-300">{column}</th>
				{/each}
			</thead>
			<tbody>
				{#each data as row}
					<tr>
						{#each Object.values(row) as cell}
							<td class="px-4 py-2 border border-base-300">{cell}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table> -->
</article>
