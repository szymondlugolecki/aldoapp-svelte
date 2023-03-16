/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/app.html', './src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {},
		fontFamily: {
			opensans: ["'Open Sans'", 'sans-serif']
		}
	},
	plugins: [require('daisyui')],
	darkMode: 'class',
	daisyui: {
		themes: [
			{
				dark: {
					...require('daisyui/src/colors/themes')['[data-theme=dark]'],
					primary: '#1d4ed8',
					secondary: '#0284c7',
					accent: '#f43f5e',
					neutral: '#1c1917',
					'base-100': '#121212'
				}
			},
			{
				light: {
					...require('daisyui/src/colors/themes')['[data-theme=light]'],
					primary: '#51cf66',
					secondary: '#94d82d',
					accent: '#fab005',
					neutral: '#1c1917',
					'base-100': '#f8f9fa'
				}
			}
		]
	}
};
