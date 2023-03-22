<script lang="ts">
	import { page } from '$app/stores';
	import { roleNames, salesmenMenu } from '$lib/client/constants';
	import { ArrowRight, LogOut } from 'lucide-svelte';
	import type { CartProductWithQuantity, Role, SessionUser } from '../../../types';
	import { fade, slide } from 'svelte/transition';
	import { cart, removeProduct } from '$lib/client/stores/cart';
	import { onMount } from 'svelte';
	import wretch from 'wretch';
	import toast from 'svelte-french-toast';
	import { error } from '@sveltejs/kit';
	import type { Product } from '@prisma/client';

	let cartLocalProducts: CartProductWithQuantity[] = $cart.products || [];
</script>

<svelte:head>
	<title>Koszyk {$cart.products ? `(${$cart.products.length}) ` : ''}• Twoje ALDO</title>
</svelte:head>

<div class="text-left container h-full flex flex-col p-2 space-y-4">
	<h1 class="text-3xl font-bold">Poggers 🛒</h1>
</div>
