import type { DrawerStore } from '$types';
import { writable } from 'svelte/store';

export const drawer = writable<DrawerStore | undefined>(undefined);
