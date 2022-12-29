import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

const config = defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});

export default config;
