/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/app.html', './src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				opensans: ["'Open Sans'", 'sans-serif']
			},
			scale: {
				115: '1.15'
			}
		},
		fontFamily: {
			opensans: ["'Open Sans'", 'sans-serif']
		},
		screens: {
			xxs: '330px',
			// => @media (min-width: 330px) { ... }

			ss: '370px',
			// => @media (min-width: 370px) { ... }

			xs: '550px',
			// => @media (min-width: 550px) { ... }

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
		},
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		}
	},
	plugins: [require('daisyui'), require('tailwindcss-animate')],
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
