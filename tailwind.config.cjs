/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/app.html',
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {},
		fontFamily: {
			opensans: ["'Open Sans'", 'sans-serif']
		}
	},
	plugins: [require('flowbite/plugin')],
	darkMode: 'class'
};
