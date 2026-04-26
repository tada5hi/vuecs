import {
    addImports,
    addPlugin,
    createResolver,
    defineNuxtModule,
} from '@nuxt/kit';
import type { PaletteConfig } from '@vuecs/design';

/**
 * Subset of Nuxt `useCookie`'s options that we forward verbatim. Kept
 * intentionally narrow — additional fields can be added on demand
 * without breaking consumers.
 */
export interface CookieOptions {
    /**
     * Cookie lifetime in seconds. Without this, Nuxt produces a
     * session cookie that expires when the browser closes — so
     * returning visitors lose their persisted choice.
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

export interface ColorModeOptions {
    /**
     * Name of the cookie used to persist the selected mode. The cookie
     * is the SSR transport — read on the server so first paint matches
     * the user's preference, avoiding FOUC.
     *
     * @default 'vc-color-mode'
     */
    cookieName?: string;

    /**
     * Initial mode when no cookie is present.
     * `'system'` defers to the client's `prefers-color-scheme` on first
     * paint; the server renders without a class in that case (accept a
     * possible one-frame flash on cold loads) unless a cookie is set.
     *
     * @default 'system'
     */
    preference?: 'light' | 'dark' | 'system';
}

export interface ModuleOptions {
    /**
     * Runtime palette override applied before first paint. Values map each
     * semantic scale (`primary`, `neutral`, `success`, ...) to a Tailwind
     * v4 palette name. Matches the shape accepted by `setPalette()` from
     * `@vuecs/design`.
     *
     * @example { primary: 'green', neutral: 'zinc' }
     */
    palette?: PaletteConfig;

    /**
     * Auto-import `@vuecs/design/index.css` as part of the Nuxt
     * CSS stack. Disable if you want to import it manually (e.g. to
     * control load order relative to your own base CSS).
     *
     * @default true
     */
    injectTokens?: boolean;

    /**
     * Dark-mode integration. When enabled (default), this module
     * registers an SSR-safe `useColorMode()` composable built on
     * `@vueuse/core`'s `useDark`, with cookie-based persistence so
     * the server can render the correct `html.dark` / `html.light`
     * class on first paint.
     *
     * Set to `false` to skip — useful if you wire color mode yourself
     * (e.g. via `@nuxtjs/color-mode`). Pass an object to tweak the
     * cookie name or default preference.
     *
     * @default true
     */
    colorMode?: boolean | ColorModeOptions;

    /**
     * Shared cookie attributes applied to BOTH the palette
     * (`vc-palette` by default) and the color-mode cookie. Useful when
     * deploying across subdomains (`domain: '.example.com'`), behind
     * a same-origin SSO flow (`sameSite: 'none', secure: true`), or
     * with custom retention requirements.
     *
     * Both cookies use the same options today — splitting per-cookie
     * is feature creep. Power users can wire their own composables
     * via `bindPalette()` / `bindColorMode()` from `@vuecs/design` if
     * they need divergent semantics.
     */
    cookie?: CookieOptions;
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: '@vuecs/nuxt',
        configKey: 'vuecs',
    },
    defaults: {
        palette: {},
        injectTokens: true,
        colorMode: true,
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
            preference: 'system',
            ...(typeof options.colorMode === 'object' && options.colorMode !== null ?
                options.colorMode :
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

        // Merge into any existing public.vuecs config (set by the user
        // in nuxt.config or by another module) instead of overwriting,
        // so we don't clobber unrelated keys.
        const existingPublic = (nuxt.options.runtimeConfig.public || {}) as Record<string, any>;
        const existingVuecs = (existingPublic.vuecs || {}) as Record<string, any>;
        nuxt.options.runtimeConfig.public = {
            ...existingPublic,
            vuecs: {
                ...existingVuecs,
                palette: options.palette || {},
                colorMode: {
                    enabled: colorModeEnabled,
                    cookieName: colorModeOptions.cookieName,
                    preference: colorModeOptions.preference,
                },
                cookie: cookieOptions,
            },
        };

        addPlugin({
            src: resolver.resolve('./runtime/plugins/palette.server'),
            mode: 'server',
        });

        addImports({
            name: 'usePalette',
            from: resolver.resolve('./runtime/composables/usePalette'),
        });

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
    },
});
