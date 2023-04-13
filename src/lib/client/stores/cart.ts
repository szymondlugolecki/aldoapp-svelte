import type { Address } from '$lib/server/db/schemas/products';
import type { CartProductWithQuantity, StoreProduct } from '$types';
import { persisted } from 'svelte-local-storage-store';
import type { DeliveryMethod, PaymentMethod } from '../constants/dbTypes';

export type CartStore = {
	productsQuantity: CartProductWithQuantity[];
	lastVerified: Date | null;
	promoCodeId?: number;
	deliveryMethod: DeliveryMethod;
	paymentMethod: PaymentMethod | null;
	rememberAddress: boolean;
	isAddressValid: boolean;
	address: Address;
	isAddressDifferent: boolean;
};

const emptyDeliveryAddress = {
	street: '',
	zipCode: '',
	city: ''
};

const initialCart: Omit<CartStore, 'address'> = {
	productsQuantity: [],
	lastVerified: null,
	promoCodeId: undefined,
	deliveryMethod: 'personal-delivery',
	paymentMethod: null,

	rememberAddress: false,
	isAddressValid: false,
	isAddressDifferent: false
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

export const incrementProduct = (productId: number) => {
	cart.update((cartObj) => {
		const productsQuantity = cartObj.productsQuantity.map((product) => {
			if (product.id === productId) {
				return { ...product, quantity: product.quantity + 1 };
			}
			return product;
		});

		return {
			...cartObj,
			productsQuantity
		};
	});
};

export const addProduct = (product: StoreProduct) => {
	cart.update((cartObj) => {
		const { productsQuantity } = cartObj;
		// if already exists, just increment quantity
		if (productsQuantity.find((p) => p.id === product.id)) {
			return {
				...cartObj,
				products: productsQuantity.map((p) => {
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
				productsQuantity: [...productsQuantity, cartProductParser(product, 1)]
			};
		}
	});
};

export const decrementProduct = (productId: number) => {
	cart.update((cartObj) => {
		const productsQuantity = cartObj.productsQuantity
			.map((product) => {
				if (product.id === productId) {
					return { ...product, quantity: product.quantity - 1 };
				}
				return product;
			})
			.filter((product) => product.quantity > 0);

		return {
			...cartObj,
			productsQuantity
		};
	});
};

export const removeProduct = (productId: number) => {
	cart.update((cartObj) => {
		const productsQuantity = cartObj.productsQuantity.filter((product) => product.id !== productId);
		return {
			...cartObj,
			productsQuantity
		};
	});
};

export const clearCart = () => {
	// Do not clear address and rememberAddress fields if
	// the rememberAddress property is set to true
	cart.update((oldCart) => {
		return {
			...initialCart,
			rememberAddress: oldCart.rememberAddress,
			address: oldCart.rememberAddress ? oldCart.address : emptyDeliveryAddress
		};
	});
};
