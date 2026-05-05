import {
    addImports,
    addPlugin,
    createResolver,
    defineNuxtModule,
} from '@nuxt/kit';
import type { ColorPaletteConfig } from '@vuecs/theme-tailwind';

/**
 * Subset of Nuxt `useCookie`'s options forwarded verbatim. Mirrors
 * `@vuecs/nuxt`'s `CookieOptions` shape so consumers can reason about
 * both modules' cookie behavior with one mental model.
 */
export interface CookieOptions {
    /**
     * Cookie lifetime in seconds.
     *
     * @default 60 * 60 * 24 * 365 // 1 year
     */
    maxAge?: number;

    /**
     * SameSite attribute. Use `'none'` (with `secure: true`) for
     * cross-subdomain SSO scenarios.
     *
     * @default 'lax'
     */
    sameSite?: 'lax' | 'strict' | 'none' | boolean;

    /**
     * Cookie Domain attribute. Useful for sharing across subdomains
     * (e.g. `'.example.com'`). Omitted by default — browser scopes
     * the cookie to the exact host.
     */
    domain?: string;

    /**
     * Add the `Secure` flag. Required when `sameSite: 'none'`. In
     * production, you almost always want this.
     *
     * @default false
     */
    secure?: boolean;

    /**
     * Cookie Path attribute.
     *
     * @default '/'
     */
    path?: string;
}

export interface ModuleOptions {
    /**
     * Initial palette applied before first paint. Values map each
     * semantic scale (`primary`, `neutral`, `success`, ...) to a
     * Tailwind v4 palette name.
     *
     * Pass `false` to skip palette setup entirely. The module still
     * registers the `useColorPalette` composable so consumers can wire
     * their own logic, but the SSR plugin and runtime config are
     * bypassed.
     *
     * @example { primary: 'green', neutral: 'zinc' }
     * @default {}
     */
    colorPalette?: false | ColorPaletteConfig;

    /**
     * Cookie attributes for `vc-color-palette` (the persistence cookie).
     */
    cookie?: CookieOptions;
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: '@vuecs/theme-tailwind-nuxt',
        configKey: 'vuecsTailwind',
    },
    defaults: { colorPalette: {} },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        const colorPaletteEnabled = options.colorPalette !== false;
        const colorPaletteValue: ColorPaletteConfig = colorPaletteEnabled ?
            (options.colorPalette as ColorPaletteConfig | undefined) || {} :
            {};

        // Documented defaults match `@vuecs/nuxt`'s cookie defaults.
        const cookieOptions: CookieOptions = {
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'lax',
            path: '/',
            ...(options.cookie || {}),
        };

        // Merge into existing public.vuecsTailwind config (set by user
        // or another module).
        const existingPublic = (nuxt.options.runtimeConfig.public || {}) as Record<string, any>;
        const existingVuecsTailwind = (existingPublic.vuecsTailwind || {}) as Record<string, any>;
        nuxt.options.runtimeConfig.public = {
            ...existingPublic,
            vuecsTailwind: {
                ...existingVuecsTailwind,
                colorPalette: colorPaletteValue,
                cookie: cookieOptions,
            },
        };

        if (colorPaletteEnabled) {
            addPlugin({
                src: resolver.resolve('./runtime/plugins/color-palette.server'),
                mode: 'server',
            });
        }

        addImports({
            name: 'useColorPalette',
            from: resolver.resolve('./runtime/composables/useColorPalette'),
        });
    },
});
