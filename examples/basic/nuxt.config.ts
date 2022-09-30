// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { defineNuxtConfig } from 'nuxt/config';
import path from 'path';

export default defineNuxtConfig({
    css: [
        '@fortawesome/fontawesome-free/css/all.css',
        'bootstrap/dist/css/bootstrap.css',
        '@/assets/css/basic.css',
        '@/assets/css/root.css',
        '@/assets/css/core/header.css',
        '@/assets/css/core/navbar.css',
        '@/assets/css/core/body.css',
        '@/assets/css/core/sidebar.css',
        '@/assets/css/core/footer.css',
        '@/assets/css/domain.css',
        '@/assets/css/root.css',
        '@/assets/css/form.css',
        '@/assets/css/generics.css',
        '@/assets/css/bootstrap-override.css',
    ],
    alias: {
        '@vue-layout/basic': path.join(__dirname, '..', '..', 'packages', 'basic', 'src'),
        '@vue-layout/core': path.join(__dirname, '..', '..', 'packages', 'core', 'src'),
        '@vue-layout/hyperscript': path.join(__dirname, '..', '..', 'packages', 'hyperscript', 'src'),
    },
    modules: [
        '@pinia/nuxt',
    ],
});
