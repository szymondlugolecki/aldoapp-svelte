<script lang="ts">
	export let data;

	import DataTable from './data-table.svelte';
</script>

<div class="container px-0 py-10 mx-auto sm:px-8">
	<DataTable data={data.orders} count={data.count[0]['count']} pageLimit={data.pageLimit} />
</div>
