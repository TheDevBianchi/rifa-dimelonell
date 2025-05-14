// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}'
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			// Fondo principal: blanco suave con tinte cálido
  			principal: {
  				'50': '#ffffff',
  				'100': '#f7f7ff',
  				'200': '#efeefe', 
  				'300': '#e5e4f9',
  				'400': '#d8d6f5',
  				'500': '#c9c6f0',
  				'600': '#b5b1e8',
  				'700': '#9f9ade',
  				'800': '#8683d4',
  				'900': '#6c69c9',
  				DEFAULT: '#efeefe',
  			},
  			// Texto/Elementos estructurales: negro
  			secondary: {
  				'50': '#F2F2F2',
  				'100': '#E6E6E6',
  				'200': '#CCCCCC',
  				'300': '#B3B3B3',
  				'400': '#999999',
  				'500': '#808080',
  				'600': '#666666',
  				'700': '#4D4D4D',
  				'800': '#333333',
  				'900': '#1A1A1A',
  				DEFAULT: '#1A1A1A',
  			},
  			// Color de acento: rojo vinotinto
  			accent: {
  				'50': '#FFEBEE',
  				'100': '#FFCDD2',
  				'200': '#EF9A9A',
  				'300': '#E57373',
  				'400': '#EF5350',
  				'500': '#8B0000', // Vinotinto base
  				'600': '#770000',
  				'700': '#630000',
  				'800': '#4F0000',
  				'900': '#3B0000',
  				DEFAULT: '#8B0000',
  			},
  			// Conservamos otros colores del sistema
  			primary: {
  				'50': '#E2FFE9',
  				'100': '#C3FFD3',
  				'200': '#85FFAA',
  				'300': '#47FF82',
  				'400': '#1FFF66',
  				'500': '#00FF4C',
  				'600': '#00CC3D',
  				'700': '#00992E',
  				'800': '#00661F',
  				'900': '#003310',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			dark: {
  				background: '#0A0B14',
  				foreground: '#F8FAFC',
  				card: '#151823',
  				cardHover: '#1E2235',
  				border: '#2D3348',
  				input: '#151823',
  				ring: '#6366F1'
  			},
  			success: {
  				light: '#22C55E',
  				dark: '#16A34A'
  			},
  			warning: {
  				light: '#FBBF24',
  				dark: '#F59E0B'
  			},
  			error: {
  				light: '#F43F5E',
  				dark: '#E11D48'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-sans)',
                    ...fontFamily.sans
                ]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		backgroundImage: {
  			'footer-gradient': 'linear-gradient(135deg, #000000 2%, #490505 63%, #06145D 100%)'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')]
}
