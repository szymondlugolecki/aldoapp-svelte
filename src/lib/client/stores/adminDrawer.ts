import type { Product } from '$lib/server/db/schemas/products';
import type { User } from '$types';
import { get, writable } from 'svelte/store';

type AdminDrawerType = 'user' | 'product' | 'promoCode' | 'order';

export type AdminDrawerStore =
	| {
			action: 'preview';
			type: AdminDrawerType;
			id: string | number;
			key: string;
	  }
	| {
			action: 'delete';
			type: AdminDrawerType;
			id: string | number;
	  }
	| {
			action: 'edit';
			type: Exclude<AdminDrawerType, 'user'>;
			id: string | number;
			key: string;
	  }
	| {
			action: 'edit';
			type: 'product';
			id: number;
			key: keyof Product;
	  }
	| {
			action: 'edit';
			type: 'user';
			id: string;
			key: keyof User;
	  }
	| {
			action: 'add';
			type: Exclude<AdminDrawerType, 'order'>;
	  };

export const drawer = writable<AdminDrawerStore | undefined>(undefined);

export const closeDrawer = () => {
	drawer.set(undefined);
};

export const openDrawer = (store: AdminDrawerStore) => {
	drawer.set(store);
};

export const getPropertyKey = () => {
	const currentStore = get(drawer);
	if (currentStore?.action === 'edit' && currentStore?.type === 'user') {
		return currentStore.key;
	}
};
