/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			screens: {
				bsm: { max: '639px' },
				bmd: { max: '767px' },
				blg: { max: '1023px' },
				bxl: { max: '1279px' },
				b2xl: { max: '1535px' }
			}
		}
	},
	plugins: [
		require('@tailwindcss/forms'),
		...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()
	]
};
