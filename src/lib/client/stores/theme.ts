import { persisted } from 'svelte-local-storage-store';
import { browser } from '$app/environment';
import { get } from 'svelte/store';

type Theme = (typeof themes)[number];

const themes = ['light', 'dark'] as const;

const defaultValue: Theme = 'light';
const initialValue = browser
	? ((window.localStorage.getItem('theme') ?? defaultValue) as Theme)
	: (defaultValue as Theme);

export const theme = persisted('preferences', initialValue);

export const nextTheme = () => {
	const currentTheme = get(theme);
	let themeIndex = themes.indexOf(currentTheme);

	// If last theme, go back to first theme
	if (themeIndex === themes.length - 1) {
		themeIndex = 0;
	} else {
		themeIndex++;
	}

	theme.set(themes[themeIndex]);
};
