<script lang="ts">
	import '../app.css';

	import Navbar from '../components/Layout/Navbar.svelte';
	import Footer from '../components/Layout/Footer.svelte';

	// import { toasts, ToastContainer, FlatToast, BootstrapToast } from 'svelte-toasts';
	// https://github.com/mzohaibqc/svelte-toasts
</script>

<Navbar userRole="admin" loggedIn={true} />
<main class="h-full flex flex-col">
	<slot />
</main>
<Footer />
