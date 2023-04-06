import type { Category } from '$types';
import { writable } from 'svelte/store';

export type CategoryChoice = { main: Category | string | null; sub: string | null };
export const selectedCategories = writable<CategoryChoice>({ main: null, sub: null });
