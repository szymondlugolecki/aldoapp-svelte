import type { CartProductWithQuantity, StoreProduct } from '$types';
import { persisted } from 'svelte-local-storage-store';

export const cart = persisted<CartProductWithQuantity[]>('cart', []);
// export const cart = writable<StoreProductWithQuantity[]>([]);

const cartProductParser = (product: StoreProduct, quantity: number) => {
	return {
		id: product.id,
		name: product.name,
		symbol: product.symbol,
		price: product.price,
		quantity,
		image: product.images[0].url
	};
};

export const addProduct = (product: StoreProduct) => {
	cart.update((products) => {
		// if already exists, just increment quantity
		if (products.find((p) => p.id === product.id)) {
			return products.map((p) => {
				if (p.id === product.id) {
					return cartProductParser(product, p.quantity + 1);
				}
				return p;
			});
		}
		// if not, add to cart
		else {
			return [...products, cartProductParser(product, 1)];
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

export const clearCart = () => {
	cart.set([]);
};
