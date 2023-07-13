import { persisted } from 'svelte-local-storage-store';

type Theme = (typeof themes)[number];
const themes = ['light', 'dark'] as const;

type Settings = {
	theme: Theme;
};

export const settings = persisted<Settings>('preferences', {
	theme: 'light'
});
