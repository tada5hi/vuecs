import { URL, fileURLToPath } from 'node:url';
import path from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@vue-layout/navigation': path.join(__dirname, '..', '..', 'packages', 'navigation', 'src'),
        },
    },
});
