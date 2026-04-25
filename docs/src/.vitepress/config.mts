import { defineConfig } from 'vitepress';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    title: 'vuecs',
    description: 'Themeable Vue 3 component library with design tokens, runtime palette switching, and SSR-safe Nuxt integration.',
    base: '/',
    cleanUrls: true,
    lastUpdated: true,

    head: [
        ['link', {
            rel: 'icon', 
            type: 'image/svg+xml', 
            href: '/logo.svg', 
        }],
        ['meta', { name: 'theme-color', content: '#3b82f6' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:title', content: 'vuecs' }],
        ['meta', { property: 'og:description', content: 'Themeable Vue 3 component library.' }],
        ['meta', { property: 'og:url', content: 'https://vuecs.dev/' }],
    ],

    vite: { plugins: [tailwindcss()] },

    themeConfig: {
        logo: '/logo.svg',

        nav: [
            {
                text: 'Getting Started', 
                link: '/getting-started/', 
                activeMatch: '/getting-started/', 
            },
            {
                text: 'Guide', 
                link: '/guide/', 
                activeMatch: '/guide/', 
            },
            {
                text: 'Components', 
                link: '/components/', 
                activeMatch: '/components/', 
            },
            {
                text: 'Ecosystem',
                items: [
                    { text: 'Themes', link: '/themes/' },
                    { text: 'Nuxt Module', link: '/nuxt/' },
                ],
            },
        ],

        sidebar: {
            '/getting-started/': [
                {
                    text: 'Getting Started',
                    items: [
                        { text: 'Introduction', link: '/getting-started/' },
                        { text: 'Installation', link: '/getting-started/installation' },
                        { text: 'Theming', link: '/getting-started/theming' },
                        { text: 'Dark Mode', link: '/getting-started/dark-mode' },
                    ],
                },
            ],
            '/guide/': [
                {
                    text: 'Concepts',
                    items: [
                        { text: 'Overview', link: '/guide/' },
                        { text: 'Theme System', link: '/guide/theme-system' },
                        { text: 'Variants', link: '/guide/variants' },
                        { text: 'Behavioral Defaults', link: '/guide/behavioral-defaults' },
                        { text: 'Design Tokens', link: '/guide/design-tokens' },
                        { text: 'Navigation Manager', link: '/guide/navigation-manager' },
                    ],
                },
            ],
            '/components/': [
                {
                    text: 'Overview',
                    items: [
                        { text: 'All Components', link: '/components/' },
                    ],
                },
                {
                    text: '@vuecs/countdown',
                    items: [
                        { text: 'Countdown', link: '/components/countdown' },
                    ],
                },
                {
                    text: '@vuecs/form-controls',
                    items: [
                        { text: 'FormInput', link: '/components/form-input' },
                        { text: 'FormTextarea', link: '/components/form-textarea' },
                        { text: 'FormSelect', link: '/components/form-select' },
                        { text: 'FormSelectSearch', link: '/components/form-select-search' },
                        { text: 'FormCheckbox', link: '/components/form-checkbox' },
                        { text: 'FormRangeSlider', link: '/components/form-range-slider' },
                        { text: 'FormSubmit', link: '/components/form-submit' },
                    ],
                },
                {
                    text: '@vuecs/gravatar',
                    items: [
                        { text: 'Gravatar', link: '/components/gravatar' },
                    ],
                },
                {
                    text: '@vuecs/link',
                    items: [
                        { text: 'Link', link: '/components/link' },
                    ],
                },
                {
                    text: '@vuecs/list-controls',
                    items: [
                        { text: 'ListControls', link: '/components/list-controls' },
                    ],
                },
                {
                    text: '@vuecs/navigation',
                    items: [
                        { text: 'Navigation', link: '/components/navigation' },
                    ],
                },
                {
                    text: '@vuecs/pagination',
                    items: [
                        { text: 'Pagination', link: '/components/pagination' },
                    ],
                },
                {
                    text: '@vuecs/timeago',
                    items: [
                        { text: 'Timeago', link: '/components/timeago' },
                    ],
                },
            ],
            '/themes/': [
                {
                    text: 'Themes',
                    items: [
                        { text: 'Overview', link: '/themes/' },
                        { text: 'Tailwind', link: '/themes/tailwind' },
                        { text: 'Bootstrap v5', link: '/themes/bootstrap-v5' },
                        { text: 'Bootstrap v4', link: '/themes/bootstrap-v4' },
                        { text: 'Font Awesome', link: '/themes/font-awesome' },
                    ],
                },
            ],
            '/nuxt/': [
                {
                    text: '@vuecs/nuxt',
                    items: [
                        { text: 'Introduction', link: '/nuxt/' },
                        { text: 'usePalette', link: '/nuxt/use-palette' },
                        { text: 'useColorMode', link: '/nuxt/use-color-mode' },
                    ],
                },
            ],
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/tada5hi/vuecs' },
        ],

        editLink: {
            pattern: 'https://github.com/tada5hi/vuecs/edit/master/docs/src/:path',
            text: 'Edit this page on GitHub',
        },

        search: { provider: 'local' },

        footer: {
            message: 'Released under the Apache 2.0 License.',
            copyright: 'Copyright © 2025-present Peter Placzek',
        },
    },
});
