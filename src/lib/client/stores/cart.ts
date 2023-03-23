import type { CartProductWithQuantity, StoreProduct } from '$types';
import { persisted } from 'svelte-local-storage-store';

type CartStore = {
	products: CartProductWithQuantity[];
	status: 'verified' | 'loading' | 'error' | 'not-verified';
	lastVerified: Date | null;
	promoCode: string | null;
};

export const cart = persisted<CartStore>('cart', {
	products: [],
	status: 'not-verified',
	lastVerified: null,
	promoCode: null
});

// when a new product is added to the cart/cart is cleared, change status to not-verified
// when a product is removed/its quantity is decremented, check if cart is empty
// if it is empty, change status to not-verified, else leave it as it is

const cartProductParser = (product: StoreProduct, quantity: number) => {
	return {
		id: product.id,
		name: product.name,
		symbol: product.symbol,
		price: product.price,
		quantity,
		images: product.images,
		amountLeft: product.amountLeft,
		encodedURL: product.encodedURL
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

export const addProduct = (product: StoreProduct) => {
	cart.update((cartObj) => {
		const { products } = cartObj;
		// if already exists, just increment quantity
		if (products.find((p) => p.id === product.id)) {
			return {
				...cartObj,
				// status: 'not-verified',
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
				// status: 'not-verified',
				products: [...products, cartProductParser(product, 1)]
			};
		}
	});
};

export const incrementProduct = (productId: string) => {
	cart.update((cartObj) => {
		const products = cartObj.products.map((product) => {
			if (product.id === productId) {
				return { ...product, quantity: product.quantity + 1 };
			}
			return product;
		});

		return {
			...cartObj,
			// status: 'not-verified',
			products
		};
	});
};

export const decrementProduct = (productId: string) => {
	cart.update((cartObj) => {
		const products = cartObj.products
			.map((product) => {
				if (product.id === productId) {
					return { ...product, quantity: product.quantity - 1 };
				}
				return product;
			})
			.filter((product) => product.quantity > 0);

		return {
			...cartObj,
			// status: products.length ? cartObj.status : 'not-verified',
			products
		};
	});
};

export const removeProduct = (productId: string) => {
	cart.update((cartObj) => {
		const products = cartObj.products.filter((product) => product.id !== productId);
		return {
			...cartObj,
			// status: products.length ? cartObj.status : 'not-verified',
			products
		};
	});
};

export const clearCart = () => {
	cart.set({
		lastVerified: null,
		status: 'not-verified',
		products: [],
		promoCode: null
	});
};
