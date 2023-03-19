import type { StoreProduct } from '$types';
import { writable } from 'svelte/store';

type StoreProductWithQuantity = StoreProduct & {
	quantity: number;
};

export const cart = writable<StoreProductWithQuantity[]>([]);

export const addProduct = (product: StoreProduct) => {
	cart.update((products) => {
		if (products.find((p) => p.id === product.id)) {
			return products.map((p) => {
				if (p.id === product.id) {
					return { ...p, quantity: p.quantity + 1 };
				}
				return p;
			});
		} else {
			return [...products, { ...product, quantity: 1 }];
		}
	});
};

export const decrementProduct = (productId: string) => {
	cart.update((products) => {
		return products
			.map((product) => {
				if (product.id === productId) {
					return { ...product, quantity: product.quantity - 1 };
				}
				return product;
			})
			.filter((product) => product.quantity > 0);
	});
};

export const removeProduct = (productId: string) => {
	cart.update((products) => {
		return products.filter((product) => product.id !== productId);
	});
};
