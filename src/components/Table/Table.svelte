<script lang="ts">
	import { productTable, userTable, orderTable } from '$lib/client/constants';
	import type {
		ProductRowType,
		ProductWithAuthorAndImage,
		User,
		UserRowType,
		OrderRowType,
		OrderWithCustomer
	} from '$types';
	import OrderCell from './OrderCell.svelte';
	import ProductCell from './ProductCell.svelte';
	import UserCell from './UserCell.svelte';

	export let type: 'products' | 'users' | 'orders';
	export let productHeaders: ProductRowType[] | undefined = undefined;
	export let userHeaders: UserRowType[] | undefined = undefined;
	export let orderHeaders: OrderRowType[] | undefined = undefined;

	export let items: ProductWithAuthorAndImage[] | User[] | OrderWithCustomer[];

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

	const isOrderItem = (
		varType: typeof type,
		varItem: (typeof items)[number]
	): varItem is OrderWithCustomer => {
		if (varType === 'orders') {
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
				{:else if orderHeaders}
					{#each orderHeaders as header}
						<th>{orderTable[header]}</th>
					{/each}
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each items as item (item.id)}
				<tr class="hover">
					{#if isProductItem(type, item) && productHeaders}
						{#each productHeaders as header}
							<td>
								<ProductCell product={item} rowType={header} />
							</td>
						{/each}
					{:else if isUserItem(type, item) && userHeaders}
						{#each userHeaders as header}
							<td>
								<UserCell user={item} rowType={header} />
							</td>
						{/each}
					{:else if isOrderItem(type, item) && orderHeaders}
						{#each orderHeaders as header}
							<td>
								<OrderCell order={item} rowType={header} />
							</td>
						{/each}
					{/if}
				</tr>
			{/each}
		</tbody>
		<!-- foot -->
		{#if items && items.length > 4}
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
</div>
{#if items && !items.length}
	<div class="w-full h-20 flex justify-center items-center text-center mb-8">
		<span class="text-2xl sm:text-3xl">Brak wyników... 🧐</span>
	</div>
{/if}

<style>
	.table th:first-child {
		position: static;
	}
</style>
