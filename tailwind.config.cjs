/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/app.html', './src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {},
		fontFamily: {
			opensans: ["'Open Sans'", 'sans-serif']
		},
		screens: {
			xxs: '330px',

			xs: '550px',
			// => @media (min-width: 640px) { ... }

			sm: '640px',
			// => @media (min-width: 640px) { ... }

			md: '768px',
			// => @media (min-width: 768px) { ... }

			lg: '1024px',
			// => @media (min-width: 1024px) { ... }

			xl: '1280px',
			// => @media (min-width: 1280px) { ... }

			'2xl': '1536px'
			// => @media (min-width: 1536px) { ... }
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
					primary: '#1d4ed8',
					secondary: '#0284c7',
					accent: '#f43f5e',
					'accent-content': '#ffffff',
					neutral: '#1c1917',
					'base-100': '#f8f9fa'
				}
			}
		]
	}
};
