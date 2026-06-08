// https://nuxt.com/docs/api/nuxt-config

import { defineNuxtConfig } from 'nuxt/config';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineNuxtConfig({
    css: [
        path.join(__dirname, 'assets', 'css', 'tailwind.css'),
    ],
    alias: {
        '@vuecs/button': path.join(__dirname, '..', '..', 'packages', 'button', 'src'),
        '@vuecs/countdown': path.join(__dirname, '..', '..', 'packages', 'countdown', 'src'),
        '@vuecs/core': path.join(__dirname, '..', '..', 'packages', 'core', 'src'),
        // design-system is resolved via the workspace symlink so that
        // subpath exports (`@vuecs/design/index.css`) work.
        '@vuecs/elements': path.join(__dirname, '..', '..', 'packages', 'elements', 'src'),
        '@vuecs/forms': path.join(__dirname, '..', '..', 'packages', 'forms', 'src'),
        '@vuecs/gravatar': path.join(__dirname, '..', '..', 'packages', 'gravatar', 'src'),
        '@vuecs/icon': path.join(__dirname, '..', '..', 'packages', 'icon', 'src'),
        '@vuecs/list': path.join(__dirname, '..', '..', 'packages', 'list', 'src'),
        '@vuecs/link': path.join(__dirname, '..', '..', 'packages', 'link', 'src'),
        '@vuecs/locale': path.join(__dirname, '..', '..', 'packages', 'locale', 'src'),
        '@vuecs/navigation': path.join(__dirname, '..', '..', 'packages', 'navigation', 'src'),
        '@vuecs/overlays': path.join(__dirname, '..', '..', 'packages', 'overlays', 'src'),
        '@vuecs/pagination': path.join(__dirname, '..', '..', 'packages', 'pagination', 'src'),
        '@vuecs/placeholder': path.join(__dirname, '..', '..', 'packages', 'placeholder', 'src'),
        '@vuecs/table': path.join(__dirname, '..', '..', 'packages', 'table', 'src'),
        '@vuecs/theme-tailwind': path.join(__dirname, '..', '..', 'themes', 'tailwind', 'src'),
        '@vuecs/icons-font-awesome': path.join(__dirname, '..', '..', 'icons', 'font-awesome', 'src'),
        '@vuecs/icons-lucide': path.join(__dirname, '..', '..', 'icons', 'lucide', 'src'),
        '@vuecs/timeago': path.join(__dirname, '..', '..', 'packages', 'timeago', 'src'),
    },
    modules: [
        path.join(__dirname, '..', '..', 'packages', 'nuxt', 'src', 'module'),
    ],
    vite: { plugins: [tailwindcss()] },
    vuecs: {
        // Tokens are auto-injected by @vuecs/nuxt; we already import @vuecs/design
        // manually inside assets/css/tailwind.css so @theme sees it in-order.
        injectTokens: false,
    },
});
