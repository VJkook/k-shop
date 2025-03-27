const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

const primary = '#496FFF'
const text = '#292F51'
const border = '#EAEBEE'

module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
	important: '#__next',
	theme: {
		fontFamily: {
			gilroy: ['Gilroy'],
		},
		colors: {
			primary,
			text,
			black: colors.black,
			white: colors.white,
			transparent: colors.transparent,
			yellow: {
				700: '#f5c521',
			},
			gray: {
				border: border,
				500: '#999aa5',
				600: '#66676e',
				700: '#39393f',
				800: '#242529',
				900: '#191b1f',
				950: '#101215',
			},
		},
		extend: {
			spacing: {
				0.5: '0.12rem',
				layout: '2.75rem',
			},
			fontSize: {
				'2lg': '1.38rem',
			},
			borderRadius: {
				image: '0.5rem',
				layout: '0.8rem',
			},
			transitionTimingFunction: {
				DEFAULT: 'ease',
			},
			transitionDuration: {
				DEFAULT: '500ms',
			},
			zIndex: {
				1: '1',
				2: '2',
				3: '3',
			},
			gap: {
				10: '10px',
			},
			keyframes: {
				fade: {
					from: { opacity: 0.2 },
					to: { opacity: 1 },
				},
				scaleIn: {
					'0%': {
						opacity: 0,
						transform: 'scale(0.9)',
					},
					'50%': {
						opacity: 0.3,
					},
					'100%': {
						opacity: 1,
						transform: 'scale(1)',
					},
				},
			},
			animation: {
				fade: 'fade .5s ease',
				scaleIn: 'scaleIn .35s ease',
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
		plugin(({ addComponents, theme, addUtilities }) => {
			addComponents({
				'.btn-primary': {
					backgroundColor: primary,
					border: '2px solid transparent',
					color: '#fff',
					borderRadius: '12px',
					transition: '.5s ease',
					'&:hover': {
						border: `2px solid ${primary}`,
						backgroundColor: 'white',
						color: primary,
					},
				},
				'.text-link': {
					textUnderlineOffset: 4,
					color: primary,
					fontSize: '16px',
					fontWeight: 500,
					transition: 'text-decoration-color .3s ease',
					textDecorationLine: 'rgba(255, 255, 255, 0.2)',
					'&:hover': {
						textDecorationColor: 'rgba(255, 255, 255, 0.9)',
					},
				},
				'.air-block': {
					filter: 'drop-shadow(0px 4px 64px rgba(41, 47, 81, 0.08))',
				},
			})
			addUtilities({
				'.text-shadow': {
					textShadow: '1px 1px rgba(0,0,0,0.4)',
				},
				'.outline-border-none': {
					outline: 'none',
					border: 'none',
				},
				'.flex-center-between': {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				},
				'.image-like-bg': {
					objectPosition: 'center',
					objectFit: 'cover',
					pointerEvents: 'none',
				},
			})
		}),
	],
}
