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
                    { text: 'Icons', link: '/icons/' },
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
                        { text: 'Icons', link: '/getting-started/icons' },
                        { text: 'Dark Mode', link: '/getting-started/dark-mode' },
                    ],
                },
            ],
            '/guide/': [
                {
                    text: 'Concepts',
                    items: [
                        { text: 'Overview', link: '/guide/' },
                        { text: 'Undesigned Components', link: '/guide/undesigned-components' },
                        { text: 'Theme System', link: '/guide/theme-system' },
                        { text: 'Variants', link: '/guide/variants' },
                        { text: 'Behavioral Defaults', link: '/guide/behavioral-defaults' },
                        { text: 'Design Tokens', link: '/guide/design-tokens' },
                        { text: 'Composables', link: '/guide/composables' },
                    ],
                },
                {
                    text: 'Authoring',
                    items: [
                        { text: 'Build Your Own Themable Component', link: '/guide/build-themable-component' },
                        { text: 'Primitive (as / asChild)', link: '/guide/primitive' },
                        { text: 'Composing Themes', link: '/guide/composing-themes' },
                        { text: 'Bridging CSS Frameworks', link: '/guide/bridging-css-frameworks' },
                    ],
                },
                {
                    text: 'Deep Dives',
                    items: [
                        { text: 'Navigation', link: '/guide/navigation' },
                        { text: 'Validation Feedback', link: '/guide/validation-feedback' },
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
                    text: '@vuecs/button',
                    items: [
                        { text: 'Button', link: '/components/button' },
                    ],
                },
                {
                    text: '@vuecs/elements',
                    items: [
                        { text: 'Alert', link: '/components/alert' },
                        { text: 'AspectRatio', link: '/components/aspect-ratio' },
                        { text: 'Avatar', link: '/components/avatar' },
                        { text: 'Badge', link: '/components/badge' },
                        { text: 'Card', link: '/components/card' },
                        { text: 'Collapse', link: '/components/collapse' },
                        { text: 'Separator', link: '/components/separator' },
                        { text: 'Tag', link: '/components/tag' },
                        { text: 'VisuallyHidden', link: '/components/visually-hidden' },
                    ],
                },
                {
                    text: '@vuecs/forms',
                    items: [
                        { text: 'FormInput', link: '/components/form-input' },
                        { text: 'FormNumber', link: '/components/form-number' },
                        { text: 'FormPin', link: '/components/form-pin' },
                        { text: 'FormTextarea', link: '/components/form-textarea' },
                        { text: 'FormSelect', link: '/components/form-select' },
                        { text: 'FormSelectSearch', link: '/components/form-select-search' },
                        { text: 'FormCheckbox', link: '/components/form-checkbox' },
                        { text: 'FormSwitch', link: '/components/form-switch' },
                        { text: 'FormRadio', link: '/components/form-radio' },
                        { text: 'FormSlider', link: '/components/form-slider' },
                        { text: 'FormTags', link: '/components/form-tags' },
                    ],
                },
                {
                    text: '@vuecs/gravatar',
                    items: [
                        { text: 'Gravatar', link: '/components/gravatar' },
                    ],
                },
                {
                    text: '@vuecs/icon',
                    items: [
                        { text: 'Icon', link: '/components/icon' },
                    ],
                },
                {
                    text: '@vuecs/link',
                    items: [
                        { text: 'Link', link: '/components/link' },
                    ],
                },
                {
                    text: '@vuecs/list',
                    items: [
                        { text: 'List', link: '/components/list' },
                    ],
                },
                {
                    text: '@vuecs/locale',
                    items: [
                        { text: 'Locale', link: '/components/locale' },
                    ],
                },
                {
                    text: '@vuecs/navigation',
                    items: [
                        { text: 'Breadcrumb', link: '/components/breadcrumb' },
                        { text: 'Navigation', link: '/components/navigation' },
                        { text: 'Stepper', link: '/components/stepper' },
                    ],
                },
                {
                    text: '@vuecs/overlays',
                    items: [
                        { text: 'Modal', link: '/components/modal' },
                        { text: 'Popover', link: '/components/popover' },
                        { text: 'HoverCard', link: '/components/hover-card' },
                        { text: 'Tooltip', link: '/components/tooltip' },
                        { text: 'Toast', link: '/components/toast' },
                        { text: 'DropdownMenu', link: '/components/dropdown-menu' },
                        { text: 'ContextMenu', link: '/components/context-menu' },
                    ],
                },
                {
                    text: '@vuecs/pagination',
                    items: [
                        { text: 'Pagination', link: '/components/pagination' },
                    ],
                },
                {
                    text: '@vuecs/placeholder',
                    items: [
                        { text: 'Placeholder', link: '/components/placeholder' },
                    ],
                },
                {
                    text: '@vuecs/table',
                    items: [
                        { text: 'Table', link: '/components/table' },
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
                        { text: 'Bootstrap', link: '/themes/bootstrap' },
                        { text: 'Bulma', link: '/themes/bulma' },
                    ],
                },
            ],
            '/icons/': [
                {
                    text: 'Icons',
                    items: [
                        { text: 'Overview', link: '/icons/' },
                        { text: 'Lucide', link: '/icons/lucide' },
                        { text: 'Font Awesome', link: '/icons/font-awesome' },
                    ],
                },
            ],
            '/nuxt/': [
                {
                    text: 'Nuxt integration',
                    items: [
                        { text: 'Introduction', link: '/nuxt/' },
                    ],
                },
                {
                    text: '@vuecs/nuxt',
                    items: [
                        { text: 'useColorMode', link: '/nuxt/use-color-mode' },
                        { text: 'useColorPalette', link: '/nuxt/use-palette' },
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
