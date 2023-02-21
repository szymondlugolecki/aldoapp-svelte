<script lang="ts">
	import '../app.css';
	import { ToastContainer } from 'svelte-toasts';

	import { XCircle, CheckCircle, AlertTriangle, Info } from 'lucide-svelte';

	import Navbar from '../components/Layout/Navbar.svelte';
	import Footer from '../components/Layout/Footer.svelte';

	// import { toasts, ToastContainer, FlatToast, BootstrapToast } from 'svelte-toasts';
	// https://github.com/mzohaibqc/svelte-toasts
</script>

<div class="min-h-screen flex flex-col justify-between">
	<div class="flex flex-col w-full h-full">
		<Navbar userRole="admin" loggedIn={true} />
		<main class="h-[calc(100vh-164px)] sm:h-[calc(100vh-140px)] flex flex-col px-3 py-2">
			<slot />
		</main>
		<ToastContainer placement="bottom-right" let:data>
			<!-- <FlatToast {data} /> -->
			<div class="flex bg-zinc-900 p-2 rounded-md min-w-[320px] bg-opacity-95">
				<div class="flex p-1">
					{#if data.type === 'error'}
						<XCircle class="text-red-500" />
					{:else if data.type === 'success'}
						<CheckCircle class="text-green-500" />
					{:else if data.type === 'info'}
						<Info class="text-blue-500" />
					{:else if data.type === 'warning'}
						<AlertTriangle class="text-yellow-500" />
					{/if}
				</div>
				<div class="flex flex-col justify-start items-start px-1">
					<span class="text-lg font-semibold">{data.title}</span>
					<span class="text-sm whitespace-pre-line">{data.description}</span>
				</div>
			</div>
		</ToastContainer>
	</div>
	<Footer />
</div>
