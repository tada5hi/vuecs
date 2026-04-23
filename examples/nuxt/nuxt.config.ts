// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { defineNuxtConfig } from 'nuxt/config';
import path from 'node:path';

export default defineNuxtConfig({
    css: [
        '@fortawesome/fontawesome-free/css/all.css',
    ],
    alias: {
        '@vuecs/countdown': path.join(__dirname, '..', '..', 'packages', 'countdown', 'src'),
        '@vuecs/core': path.join(__dirname, '..', '..', 'packages', 'core', 'src'),
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
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
    ],
    tailwindcss: {
        cssPath: path.join(__dirname, 'assets', 'css', 'tailwind.css'),
    },
});
