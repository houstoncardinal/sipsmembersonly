import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			sans: [
  				'Raleway',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif',
  				'Apple Color Emoji',
  				'Segoe UI Emoji',
  				'Segoe UI Symbol',
  				'Noto Color Emoji'
  			],
  			serif: [
  				'Playfair Display',
  				'ui-serif',
  				'Georgia',
  				'Cambria',
  				'Times New Roman',
  				'Times',
  				'serif'
  			],
  			mono: [
  				'ui-monospace',
  				'SFMono-Regular',
  				'Menlo',
  				'Monaco',
  				'Consolas',
  				'Liberation Mono',
  				'Courier New',
  				'monospace'
  			]
  		},
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
  			},
  			glow: 'hsl(var(--glow-primary))',
  			gold: 'hsl(var(--gold))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
  			'pulse-glow': {
  				'0%, 100%': {
  					boxShadow: '0 0 20px hsl(280 100% 70% / 0.25), 0 0 50px hsl(308 80% 68% / 0.1)'
  				},
  				'50%': {
  					boxShadow: '0 0 40px hsl(280 100% 70% / 0.55), 0 0 80px hsl(308 80% 68% / 0.25)'
  				}
  			},
  			float: {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-10px)' }
  			},
  			shimmer: {
  				'0%': { backgroundPosition: '-200% 0' },
  				'100%': { backgroundPosition: '200% 0' }
  			},
  			'syrup-drip': {
  				'0%': { height: '0', opacity: '0.9' },
  				'60%': { height: 'var(--drip-h, 80px)', opacity: '1' },
  				'78%': { height: 'calc(var(--drip-h, 80px) + 22px)', opacity: '1' },
  				'92%': { height: 'calc(var(--drip-h, 80px) + 18px)', opacity: '0.95' },
  				'100%': { height: 'var(--drip-h, 80px)', opacity: '0.9' }
  			},
  			'drip-fall': {
  				'0%, 52%': { transform: 'scale(1, 0.1) translateY(0)', opacity: '0' },
  				'65%': { transform: 'scale(1.4, 0.7) translateY(0)', opacity: '1' },
  				'80%': { transform: 'scale(0.9, 1.5) translateY(0)', opacity: '1' },
  				'100%': { transform: 'scale(0.7, 2.4) translateY(40px)', opacity: '0' }
  			},
  			'purple-breathe': {
  				'0%, 100%': {
  					boxShadow: '0 0 25px hsl(280 100% 70% / 0.25), 0 0 60px hsl(280 100% 70% / 0.1)'
  				},
  				'50%': {
  					boxShadow: '0 0 50px hsl(280 100% 70% / 0.55), 0 0 100px hsl(280 100% 70% / 0.25), 0 0 140px hsl(308 80% 65% / 0.15)'
  				}
  			},
  			'syrup-shine': {
  				'0%': { left: '-60%', opacity: '0' },
  				'20%': { opacity: '1' },
  				'60%': { opacity: '1' },
  				'100%': { left: '130%', opacity: '0' }
  			},
  			'pool-pulse': {
  				'0%, 100%': { transform: 'scale(1, 1)', opacity: '0.85' },
  				'50%': { transform: 'scale(1.04, 1.02)', opacity: '1' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
  			float: 'float 3s ease-in-out infinite',
  			shimmer: 'shimmer 2s linear infinite',
  			'syrup-drip': 'syrup-drip var(--drip-dur, 4s) ease-in-out infinite',
  			'drip-fall': 'drip-fall var(--drip-dur, 4s) ease-in-out infinite',
  			'purple-breathe': 'purple-breathe 3s ease-in-out infinite',
  			'syrup-shine': 'syrup-shine 3s ease-in-out infinite',
  			'pool-pulse': 'pool-pulse 4s ease-in-out infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
