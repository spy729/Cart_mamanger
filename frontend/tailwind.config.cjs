/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./index.html',
		'./src/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				bg: '#0b1220',
				panel: '#0f1a2b',
				muted: '#9aa6b2',
				text: '#e6eef6',
				accent: '#06b6d4',
				accent2: '#7c3aed',
				danger: '#ff6b6b',
				glass: 'rgba(255,255,255,0.03)'
			},
			boxShadow: {
				vibe: '0 6px 24px rgba(2,6,23,0.6)'
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui']
			}
		}
	},
	plugins: [],
}
