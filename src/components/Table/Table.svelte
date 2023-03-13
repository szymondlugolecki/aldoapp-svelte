<script lang="ts">
	import { productTable, userTable } from '$lib/client/constants';
	import type { ProductRowType, ProductWithAuthorAndImage, UserRowType } from '$types';
	import type { User } from '@prisma/client';
	import ProductCell from './ProductCell.svelte';
	import UserCell from './UserCell.svelte';

	export let type: 'products' | 'users';
	export let productHeaders: ProductRowType[] | undefined = undefined;
	export let userHeaders: UserRowType[] | undefined = undefined;

	function openEditDrawer(id: string) {
		return;
	}

	function openRemoveDrawer(id: string) {
		return;
	}

	export let items: ProductWithAuthorAndImage[] | User[];

	const isProductItem = (
		varType: typeof type,
		varItem: (typeof items)[number]
	): varItem is ProductWithAuthorAndImage => {
		if (varType === 'products') {
			return true;
		}
		return false;
	};

	const isUserItem = (varType: typeof type, varItem: (typeof items)[number]): varItem is User => {
		if (varType === 'users') {
			return true;
		}
		return false;
	};
</script>

<div class="overflow-x-auto w-full">
	<table class="table w-full">
		<!-- head -->
		<thead>
			<tr>
				{#if productHeaders}
					{#each productHeaders as header}
						<th>{productTable[header]}</th>
					{/each}
				{:else if userHeaders}
					{#each userHeaders as header}
						<th>{userTable[header]}</th>
					{/each}
				{/if}
			</tr>
		</thead>
		<tbody>
			{#if items}
				{#each items as item, i}
					{#if isProductItem(type, item) && productHeaders}
						{#each productHeaders as header}
							<td>
								<ProductCell product={item} rowType={productHeaders[i]} />
							</td>
						{/each}
					{:else if isUserItem(type, item) && userHeaders}
						{#each userHeaders as header}
							<td>
								<UserCell user={item} rowType={header} />
							</td>
						{/each}
					{/if}
				{/each}
			{/if}
		</tbody>
		<!-- foot -->
		{#if items && items.length > 1}
			<tfoot>
				<tr>
					{#if productHeaders}
						{#each productHeaders as header}
							<th>{productTable[header]}</th>
						{/each}
					{:else if userHeaders}
						{#each userHeaders as header}
							<th>{userTable[header]}</th>
						{/each}
					{/if}
				</tr>
			</tfoot>
		{/if}
	</table>
	{#if items && !items.length}
		<div class="w-full h-20 flex justify-center items-center text-center">
			<span class="text-3xl">Brak wyników... 🧐</span>
		</div>
	{/if}
</div>
