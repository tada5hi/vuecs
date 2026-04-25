// https://nuxt.com/docs/api/nuxt-config

import { defineNuxtConfig } from 'nuxt/config';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineNuxtConfig({
    css: [
        path.join(__dirname, 'assets', 'css', 'tailwind.css'),
        '@fortawesome/fontawesome-free/css/all.css',
    ],
    alias: {
        '@vuecs/countdown': path.join(__dirname, '..', '..', 'packages', 'countdown', 'src'),
        '@vuecs/core': path.join(__dirname, '..', '..', 'packages', 'core', 'src'),
        // design-system is resolved via the workspace symlink so that
        // subpath exports (`@vuecs/design/index.css`) work.
        '@vuecs/form-controls': path.join(__dirname, '..', '..', 'packages', 'form-controls', 'src'),
        '@vuecs/list-controls': path.join(__dirname, '..', '..', 'packages', 'list-controls', 'src'),
        '@vuecs/link': path.join(__dirname, '..', '..', 'packages', 'link', 'src'),
        '@vuecs/navigation': path.join(__dirname, '..', '..', 'packages', 'navigation', 'src'),
        '@vuecs/pagination': path.join(__dirname, '..', '..', 'packages', 'pagination', 'src'),
        '@vuecs/theme-tailwind': path.join(__dirname, '..', '..', 'packages', 'theme-tailwind', 'src'),
        '@vuecs/theme-font-awesome': path.join(__dirname, '..', '..', 'packages', 'theme-font-awesome', 'src'),
        '@vuecs/timeago': path.join(__dirname, '..', '..', 'packages', 'timeago', 'src'),
    },
    modules: [
        path.join(__dirname, '..', '..', 'packages', 'nuxt', 'src', 'module'),
        '@pinia/nuxt',
    ],
    vite: { plugins: [tailwindcss()] },
    vuecs: {
        // Tokens are auto-injected by @vuecs/nuxt; we already import @vuecs/design
        // manually inside assets/css/tailwind.css so @theme sees it in-order.
        injectTokens: false,
    },
});
