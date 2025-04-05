
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
				monster: {
					red: '#FF6B6B',
					blue: '#4D96FF',
					green: '#6BCB77',
					purple: '#9B5DE5',
					yellow: '#F9C74F'
				},
				fun: {
					purple: '#9b87f5',
					magenta: '#D946EF',
					orange: '#F97316',
					blue: '#0EA5E9',
					green: '#4ade80',
					yellow: '#facc15'
				},
				oni: {
					red: 'hsl(var(--oni-red))',
					blue: 'hsl(var(--oni-blue))',
					purple: 'hsl(var(--oni-purple))',
					cyan: 'hsl(var(--oni-cyan))',
					orange: 'hsl(var(--oni-orange))',
					ember: 'hsl(var(--oni-ember))',
					gold: 'hsl(var(--oni-gold))',
					black: 'hsl(var(--oni-black))',
					white: 'hsl(var(--oni-white))'
				},
				// New anime-inspired theme colors
				demon: {
					red: '#FF2D55',
					orange: '#FF9500',
					indigo: '#5E17EB',
					teal: '#00FFDD',
					black: '#121212',
					ember: '#FF7700',
					blood: '#CB0000',
					gold: '#FFD700',
					white: '#FFFFFF',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.85' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'progress-fill': {
					'0%': { width: '0%' },
					'100%': { width: 'var(--progress-width)' }
				},
				'monster-damage': {
					'0%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-15px)' },
					'50%': { transform: 'translateX(10px)' },
					'75%': { transform: 'translateX(-5px)' },
					'100%': { transform: 'translateX(0)' }
				},
				'sword-draw': {
					'0%': { transform: 'translateX(-100%) rotate(-30deg)', filter: 'brightness(2)' },
					'80%': { transform: 'translateX(10%) rotate(0deg)', filter: 'brightness(2)' },
					'100%': { transform: 'translateX(0) rotate(0deg)', filter: 'brightness(1)' }
				},
				'sword-slash': {
					'0%': { transform: 'translateX(-100%) rotate(-30deg)', opacity: '0' },
					'10%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
					'40%': { transform: 'translateX(100%) rotate(30deg)', opacity: '0' },
					'100%': { transform: 'translateX(100%) rotate(30deg)', opacity: '0' }
				},
				// New anime-inspired animations
				'breath-pulse': {
					'0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
					'50%': { transform: 'scale(1.1)', opacity: '1' }
				},
				'energy-flow': {
					'0%': { backgroundPosition: '0% 50%' },
					'100%': { backgroundPosition: '100% 50%' }
				},
				'aura-glow': {
					'0%': { boxShadow: '0 0 10px 2px rgba(255, 45, 85, 0.5)' },
					'50%': { boxShadow: '0 0 20px 5px rgba(255, 45, 85, 0.8)' },
					'100%': { boxShadow: '0 0 10px 2px rgba(255, 45, 85, 0.5)' }
				},
				'slash': {
					'0%': { transform: 'scaleX(0)', transformOrigin: 'left', opacity: '1' },
					'50%': { transform: 'scaleX(1)', transformOrigin: 'left', opacity: '1' },
					'51%': { transformOrigin: 'right' },
					'100%': { transform: 'scaleX(0)', transformOrigin: 'right', opacity: '0' }
				},
				'floating-card': {
					'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
					'25%': { transform: 'translateY(-5px) rotate(1deg)' },
					'75%': { transform: 'translateY(5px) rotate(-1deg)' }
				},
				'kanji-appear': {
					'0%': { transform: 'scale(2)', opacity: '0', filter: 'blur(8px)' },
					'100%': { transform: 'scale(1)', opacity: '1', filter: 'blur(0)' }
				},
				'paper-unfold': {
					'0%': { transform: 'scaleY(0)', opacity: '0' },
					'100%': { transform: 'scaleY(1)', opacity: '1' }
				},
				'ink-spread': {
					'0%': { transform: 'scale(0)', opacity: '0.8' },
					'100%': { transform: 'scale(1.5)', opacity: '0' }
				},
				'flame-flicker': {
					'0%, 100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
					'25%': { opacity: '0.8', transform: 'translateY(-2px) scale(1.02)' },
					'50%': { opacity: '1', transform: 'translateY(-1px) scale(1.01)' },
					'75%': { opacity: '0.9', transform: 'translateY(-3px) scale(1.03)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-out': 'fade-out 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'pulse-subtle': 'pulse-subtle 3s infinite ease-in-out',
				'float': 'float 6s infinite ease-in-out',
				'progress-fill': 'progress-fill 1s ease-out forwards',
				'monster-damage': 'monster-damage 0.5s ease-in-out',
				'sword-draw': 'sword-draw 0.7s ease-out forwards',
				'sword-slash': 'sword-slash 0.7s ease-out forwards',
				// New anime-inspired animation classes
				'breath-pulse': 'breath-pulse 3s infinite ease-in-out',
				'energy-flow': 'energy-flow 2s infinite linear',
				'aura-glow': 'aura-glow 2s infinite ease-in-out',
				'slash': 'slash 0.6s ease-in-out',
				'floating-card': 'floating-card 6s infinite ease-in-out',
				'kanji-appear': 'kanji-appear 0.8s forwards',
				'paper-unfold': 'paper-unfold 0.5s ease-out forwards',
				'ink-spread': 'ink-spread 1.2s ease-out forwards',
				'flame-flicker': 'flame-flicker 3s infinite'
			},
			boxShadow: {
				'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
				'neo': '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff',
				'oni': '0 0 15px rgba(255, 0, 0, 0.3)',
				// New anime-inspired shadows
				'demon-aura': '0 0 20px rgba(255, 45, 85, 0.6)',
				'water-breathing': '0 0 20px rgba(0, 255, 221, 0.6)',
				'thunder-breathing': '0 0 20px rgba(94, 23, 235, 0.6)',
				'flame-breathing': '0 0 20px rgba(255, 119, 0, 0.6)',
				'legendary': '0 0 30px rgba(255, 215, 0, 0.7)'
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
			},
			backgroundImage: {
				'oni-gradient': 'linear-gradient(to right, hsl(var(--oni-red)), hsl(var(--oni-orange)))',
				'dark-gradient': 'linear-gradient(to bottom right, rgba(0,0,0,0.8), rgba(20,20,30,0.8))',
				// New anime-inspired gradients
				'demon-gradient': 'linear-gradient(to right, #FF2D55, #FF9500)',
				'water-gradient': 'linear-gradient(to right, #00FFDD, #0EA5E9)',
				'thunder-gradient': 'linear-gradient(to right, #5E17EB, #9B5DE5)',
				'wind-gradient': 'linear-gradient(to right, #00EC97, #4ade80)',
				'flame-gradient': 'linear-gradient(to right, #FF2D55, #FF7700, #FF9500)',
				'night-sky': 'linear-gradient(to bottom, #121212, #1f1f3a)',
				'misty-mountains': 'linear-gradient(180deg, rgba(31,31,58,0.8) 0%, rgba(46,49,65,0.8) 100%)',
				'shrine-glow': 'radial-gradient(circle at center, rgba(255,215,0,0.3) 0%, rgba(0,0,0,0) 70%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
