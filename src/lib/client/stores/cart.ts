import type { Address, Customer } from '$lib/server/db/schemas/products';
import type { CartProductWithQuantity, StoreProduct } from '$types';
import { persisted } from 'svelte-local-storage-store';
import type { DeliveryMethod, PaymentMethod } from '../constants/dbTypes';

type CartStore = {
	products: CartProductWithQuantity[];
	// products: [CartProductWithQuantity, ...CartProductWithQuantity[]];
	status: 'verified' | 'loading' | 'error' | 'not-verified';
	lastVerified: Date | null;
	promoCode?: {
		id?: number;
		code: string;
	};
	deliveryMethod: DeliveryMethod | null;
	paymentMethod: PaymentMethod | null;
	rememberAddress: boolean;
	isAddressValid: boolean;
	isCustomerValid: boolean;
	address: Address;
	customer: Customer;
};

const emptyDeliveryAddress = {
	street: '',
	zipCode: '',
	city: ''
};

const initialCart: Omit<CartStore, 'address'> = {
	products: [],
	status: 'not-verified',
	lastVerified: null,
	promoCode: undefined,
	deliveryMethod: null,
	paymentMethod: null,
	rememberAddress: false,
	isAddressValid: false,
	isCustomerValid: false,
	customer: {
		phone: '',
		email: '',
		fullName: ''
	}
};

export const cart = persisted<CartStore>('cart', {
	...initialCart,
	address: emptyDeliveryAddress
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

export const incrementProduct = (productId: number) => {
	cart.update((cartObj) => {
		const products = cartObj.products.map((product) => {
			if (product.id === productId) {
				return { ...product, quantity: product.quantity + 1 };
			}
			return product;
		});

		return {
			...cartObj,
			status: 'not-verified',
			products
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
				status: 'not-verified',
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
				status: 'not-verified',
				products: [...products, cartProductParser(product, 1)]
			};
		}
	});
};

export const decrementProduct = (productId: number) => {
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

export const removeProduct = (productId: number) => {
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
	// Do not clear address and rememberAddress fields if
	// the rememberAddress property is set to true
	cart.update((oldCart) => {
		return {
			...initialCart,
			status: 'not-verified',
			rememberAddress: oldCart.rememberAddress,
			address: oldCart.rememberAddress ? oldCart.address : emptyDeliveryAddress
		};
	});
};
