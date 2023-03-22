import { cart } from '$lib/client/stores/cart';
import type { CartProductWithQuantity } from '$types';
import toast from 'svelte-french-toast';
import { get } from 'svelte/store';

export const ssr = false;

export const load = async ({ fetch }) => {
	let cartLocalProducts: CartProductWithQuantity[] = [];
	let fetchingStatus = 'loading';

	try {
		const currentCart = get(cart);

		const productIds = currentCart.map((product) => product.id);
		const data = await fetch(`/api/mycart?cart=${productIds.join(',')}`);

		if (!data.ok) {
			throw new Error('Wystąpił błąd podczas pobierania koszyka');
		}

		const result: {
			success: true;
			products: Omit<CartProductWithQuantity, 'quantity'>[];
		} = await data.json();

		console.log('result', result);

		cartLocalProducts = result.products.map((product) => {
			return { ...product, quantity: currentCart.find((p) => p.id === product.id)?.quantity || 1 };
		});

		fetchingStatus = 'success';
		cart.set(cartLocalProducts);

		return {
			fetchingStatus
		};
	} catch (error) {
		let errorMessage = 'Wystąpił błąd podczas pobierania koszyka';
		if (error instanceof Error) {
			errorMessage = error.message;
		}

		toast.error(errorMessage);

		cartLocalProducts = [];

		fetchingStatus = 'error';
		cart.set(cartLocalProducts);

		return {
			fetchingStatus
		};
	}
};
