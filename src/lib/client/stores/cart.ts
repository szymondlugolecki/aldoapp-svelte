import type { CartProductWithQuantity, StoreProduct } from '$types';
import { persisted } from 'svelte-local-storage-store';

type CartStore = {
	products: CartProductWithQuantity[];
	status: 'verified' | 'loading' | 'error' | 'not-verified';
	lastVerified: Date | null;
};

export const cart = persisted<CartStore>('cart', {
	products: [],
	status: 'not-verified',
	lastVerified: null
});
// export const cart = writable<StoreProductWithQuantity[]>([]);

const cartProductParser = (product: StoreProduct, quantity: number) => {
	return {
		id: product.id,
		name: product.name,
		symbol: product.symbol,
		price: product.price,
		quantity,
		images: product.images,
		amountLeft: product.amountLeft
	};
};

export const changeCartState = (status: CartStore['status']) => {
	cart.update((cartObj) => {
		return {
			...cartObj,
			status
		};
	});
};

// adding new product to cart changes the state to not-verified
// but removing or decrementing product does not

export const addProduct = (product: StoreProduct) => {
	cart.update((cartObj) => {
		const { products } = cartObj;
		// if already exists, just increment quantity
		if (products.find((p) => p.id === product.id)) {
			return {
				...cartObj,
				verified: false,
				products: products.map((p) => {
					if (p.id === product.id) {
						return cartProductParser(product, p.quantity + 1);
					}
					return p;
				})
			};
		}
		// if not, add to cart
		else {
			return {
				...cartObj,
				verified: false,
				products: [...products, cartProductParser(product, 1)]
			};
		}
	});
};

export const decrementProduct = (productId: string) => {
	cart.update((cartObj) => {
		const { products } = cartObj;
		return {
			...cartObj,
			products: products
				.map((product) => {
					if (product.id === productId) {
						return { ...product, quantity: product.quantity - 1 };
					}
					return product;
				})
				.filter((product) => product.quantity > 0)
		};
	});
};

export const removeProduct = (productId: string) => {
	cart.update((cartObj) => {
		const { products } = cartObj;
		return {
			...cartObj,
			products: products.filter((product) => product.id !== productId)
		};
	});
};

export const clearCart = () => {
	cart.set({
		lastVerified: null,
		status: 'not-verified',
		products: []
	});
};
