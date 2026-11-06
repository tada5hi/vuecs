import type {
    ColorModeOptions,
    ColorPaletteOptions,
    CookieOptions,
    LocaleOptions,
    ModuleOptions,
} from './types';
import {
    addImports,
    addPlugin,
    addTemplate,
    createResolver,
    defineNuxtModule,
} from '@nuxt/kit';


export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: '@vuecs/nuxt',
        configKey: 'vuecs',
    },
    defaults: {
        injectTokens: true,
        colorMode: true,
        colorPalette: true,
        locale: true,
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        if (options.injectTokens) {
            nuxt.options.css = nuxt.options.css || [];

            if (!nuxt.options.css.includes('@vuecs/design/index.css')) {
                nuxt.options.css.unshift('@vuecs/design/index.css');
            }
        }

        const colorModeEnabled = options.colorMode !== false;
        const colorModeOptions: Required<ColorModeOptions> = {
            cookieName: 'vc-color-mode',
            value: 'system',
            ...(typeof options.colorMode === 'object' && options.colorMode !== null ?
                options.colorMode :
                {}),
        };

        const colorPaletteEnabled = options.colorPalette !== false;
        const colorPaletteOptions: Required<ColorPaletteOptions> = {
            cookieName: 'vc-color-palette',
            value: {},
            ...(typeof options.colorPalette === 'object' && options.colorPalette !== null ?
                options.colorPalette :
                {}),
        };

        const localeEnabled = options.locale !== false;
        const localeOptions: Required<LocaleOptions> = {
            cookieName: 'vc-locale',
            value: 'auto',
            fallback: 'en-US',
            ...(typeof options.locale === 'object' && options.locale !== null ?
                options.locale :
                {}),
        };

        // Documented defaults match the doc-site claim of 1y / lax. Spread
        // the user-provided cookie options on top so they win per-key.
        const cookieOptions: CookieOptions = {
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'lax',
            path: '/',
            ...(options.cookie || {}),
        };

        /*
         * Palette cookie attributes default to the color-mode cookie's
         * attributes (apps typically want consistent retention across
         * UI-state cookies). Override per-key via `paletteCookie`.
         */
        const paletteCookieOptions: CookieOptions = {
            ...cookieOptions,
            ...(options.paletteCookie || {}),
        };

        /*
         * Locale cookie attributes default to the color-mode cookie's
         * attributes (consistent retention across UI-state cookies).
         * Override per-key via `localeCookie`.
         */
        const localeCookieOptions: CookieOptions = {
            ...cookieOptions,
            ...(options.localeCookie || {}),
        };

        // Merge into any existing public.vuecs config (set by the user
        // in nuxt.config or by another module) instead of overwriting,
        // so we don't clobber unrelated keys.
        const existingPublic = (nuxt.options.runtimeConfig.public || {}) as Record<string, any>;
        const existingVuecs = (existingPublic.vuecs || {}) as Record<string, any>;

        nuxt.options.runtimeConfig.public = {
            ...existingPublic,
            vuecs: {
                ...existingVuecs,
                colorMode: {
                    enabled: colorModeEnabled,
                    cookieName: colorModeOptions.cookieName,
                    value: colorModeOptions.value,
                },
                colorPalette: {
                    enabled: colorPaletteEnabled,
                    cookieName: colorPaletteOptions.cookieName,
                    value: colorPaletteOptions.value,
                },
                locale: {
                    enabled: localeEnabled,
                    cookieName: localeOptions.cookieName,
                    value: localeOptions.value,
                    fallback: localeOptions.fallback,
                },
                cookie: cookieOptions,
                paletteCookie: paletteCookieOptions,
                localeCookie: localeCookieOptions,
            },
        };

        /*
         * Auto-install themes from the `themes:` option. Generates a
         * thin plugin that imports each module's default factory and
         * installs via `app.use(vuecs, { themes: [...] })`. The SSR
         * plugins below use `enforce: 'post'` so they always run after
         * this one, regardless of plugin registration order.
         *
         * Themes that need factory args skip this option and install
         * via a user-authored plugin file under `plugins/`.
         */
        const themes = (options.themes || []).filter((name) => typeof name === 'string' && name.length > 0);

        if (themes.length > 0) {
            // JSON.stringify guards against names containing quotes or
            // template-literal metacharacters. Theme names come from the
            // user's nuxt.config.ts (build-time, not runtime input), so
            // this is robustness rather than a security boundary.
            const importLines = themes
                .map((name, idx) => `import t${idx} from ${JSON.stringify(name)};`)
                .join('\n');
            const installArgs = themes
                .map((_, idx) => `t${idx}()`)
                .join(', ');

            const template = addTemplate({
                filename: 'vuecs-themes.plugin.mjs',
                getContents: () => `${importLines}
import vuecs from '@vuecs/core';
import { defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin({
    name: 'vuecs-themes',
    setup(nuxtApp) {
        nuxtApp.vueApp.use(vuecs, { themes: [${installArgs}] });
    },
});
`,
                write: true,
            });

            addPlugin({ src: template.dst });
        }

        if (colorModeEnabled) {
            addPlugin({
                src: resolver.resolve('./runtime/plugins/colorMode.server'),
                mode: 'server',
            });

            addImports({
                name: 'useColorMode',
                from: resolver.resolve('./runtime/composables/useColorMode'),
            });
        }

        if (colorPaletteEnabled) {
            addPlugin({
                src: resolver.resolve('./runtime/plugins/colorPalette.server'),
                mode: 'server',
            });

            addImports({
                name: 'useColorPalette',
                from: resolver.resolve('./runtime/composables/useColorPalette'),
            });
        }

        if (!localeEnabled) {
            return;
        }

        // Universal plugin (server + client): the Config bridge must
        // exist even when the consumer never calls useLocaleManager(),
        // because locale-aware components read `useLocale()` directly.
        addPlugin({ src: resolver.resolve('./runtime/plugins/locale') });

        addImports([
            {
                name: 'useLocale',
                from: resolver.resolve('./runtime/composables/locale'),
            },
            {
                name: 'useLocaleManager',
                from: resolver.resolve('./runtime/composables/locale'),
            },
        ]);
    },
});

// eslint-disable-next-line @tada5hi/no-reexport-shims -- module.ts is the published Nuxt entry point; preserve its named option types.
export type {
    ColorModeOptions,
    ColorPaletteOptions,
    CookieOptions,
    LocaleOptions,
    ModuleOptions,
} from './types';
