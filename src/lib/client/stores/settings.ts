import { persisted } from 'svelte-local-storage-store';
// import { browser } from '$app/environment';
import { get } from 'svelte/store';

type Theme = (typeof themes)[number];

const themes = ['light', 'dark'] as const;
export const themeNames = {
	light: 'Jasny 🌞',
	dark: 'Ciemny 🌜'
} as const;

type Settings = {
	theme: Theme;
};

export const settings = persisted<Settings>('preferences', {
	theme: 'light'
});

export const nextTheme = () => {
	const currentTheme = get(settings).theme;
	let themeIndex = themes.indexOf(currentTheme);

	// If last theme, go back to first theme
	if (themeIndex === themes.length - 1) {
		themeIndex = 0;
	} else {
		themeIndex++;
	}

	settings.update((oldSettings) => ({
		...oldSettings,
		theme: themes[themeIndex]
	}));
};
