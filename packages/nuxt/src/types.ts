import type { ColorPaletteName, SemanticScaleName } from '@vuecs/design';

/**
 * Subset of Nuxt `useCookie`'s options that we forward verbatim. Kept
 * intentionally narrow — additional fields can be added on demand
 * without breaking consumers.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public name and declaration merging.
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



// eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public name and declaration merging.
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
     * Mirrors `colorPalette.value` — both options describe "initial
     * value when no persisted state exists" with the same key name.
     *
     * @default 'system'
     */
    value?: 'light' | 'dark' | 'system';
}



// eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public name and declaration merging.
export interface ColorPaletteOptions {
    /**
     * Name of the cookie used to persist the selected palette. The
     * cookie is the SSR transport — read on the server so first paint
     * matches the user's persisted palette.
     *
     * @default 'vc-color-palette'
     */
    cookieName?: string;

    /**
     * Initial palette applied before first paint. Each semantic scale
     * (`primary`, `neutral`, `success`, `warning`, `error`, `info`)
     * may be assigned a catalog palette name. Pass `{}` to keep the
     * theme's default mapping.
     *
     * Typing widens automatically when community themes augment
     * `ExtraColorPaletteNames` in `@vuecs/design`.
     *
     * @example { primary: 'green', neutral: 'zinc' }
     * @default {}
     */
    value?: Partial<Record<SemanticScaleName, ColorPaletteName>>;
}



// eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public name and declaration merging.
export interface LocaleOptions {
    /**
     * Name of the cookie used to persist the selected locale source. The
     * cookie is the SSR transport — read on the server so first paint
     * matches the user's persisted locale (no hydration mismatch for a
     * concrete saved locale).
     *
     * @default 'vc-locale'
     */
    cookieName?: string;

    /**
     * Initial locale source when no cookie is present. A BCP-47 tag, or
     * `'auto'` to detect the browser language (the server resolves
     * `'auto'` from the request's `Accept-Language` header; the client
     * from `navigator.language`).
     *
     * @default 'auto'
     */
    value?: string;

    /**
     * Concrete fallback used when the source is `'auto'` but no browser
     * language can be determined (no `Accept-Language` header on the
     * server, unsupported navigator on the client).
     *
     * @default 'en-US'
     */
    fallback?: string;
}



// eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public name and declaration merging.
export interface ModuleOptions {
    /**
     * Auto-import `@vuecs/design/index.css` as part of the Nuxt
     * CSS stack. Disable if you want to import it manually (e.g. to
     * control load order relative to your own base CSS).
     *
     * @default true
     */
    injectTokens?: boolean;

    /**
     * Theme packages to install. Each entry is a module name; the
     * module is imported at runtime via a generated plugin that calls
     * its default factory and installs the result via
     * `app.use(vuecs, { themes: [...] })`. The generated plugin runs
     * before this module's SSR plugins so the ThemeManager is
     * registered by the time `enforce: 'post'` plugins look it up.
     *
     * Themes are imported as default-export no-arg factories. Themes
     * that need options (e.g. `acmeTheme({ variant: 'dark' })`) skip
     * this option and install themselves via a user-authored plugin
     * file under `plugins/`.
     *
     * @example ['@vuecs/theme-tailwind']
     * @default undefined  // no auto-install; consumer's user-plugin owns it
     */
    themes?: string[];

    /**
     * Dark-mode integration. When enabled (default), this module
     * registers an SSR-safe `useColorMode()` composable built on
     * `@vueuse/core`'s `useDark`, with cookie-based persistence so
     * the server can render the correct `html.dark` / `html.light`
     * class on first paint.
     *
     * Set to `false` to skip — useful if you wire color mode yourself
     * (e.g. via `@nuxtjs/color-mode`). Pass an object to tweak the
     * cookie name or initial value.
     *
     * @default true
     */
    colorMode?: boolean | ColorModeOptions;

    /**
     * Palette switching. When enabled (default), this module registers
     * an SSR-safe `useColorPalette()` composable backed by a Nuxt
     * cookie, plus a server plugin that emits the
     * `<style id="vc-color-palette">` block before first paint.
     *
     * The runtime dispatches through every installed theme's
     * `palette.handle` hook (plan 021 slice 6b), so the same composable
     * drives Tailwind, Bulma, and any future palette-aware theme
     * without per-theme Nuxt modules.
     *
     * Set to `false` to skip entirely. Pass an object to set the
     * initial palette or override the cookie name.
     *
     * @default true
     */
    colorPalette?: boolean | ColorPaletteOptions;

    /**
     * Cookie attributes applied to the **color-mode** cookie. Useful
     * when deploying across subdomains (`domain: '.example.com'`),
     * behind a same-origin SSO flow (`sameSite: 'none', secure: true`),
     * or with custom retention requirements.
     *
     * Power users can wire their own composables via `bindColorMode()`
     * from `@vuecs/design` if they need divergent semantics.
     */
    cookie?: CookieOptions;

    /**
     * Cookie attributes applied to the **palette** cookie. When unset,
     * the palette cookie inherits attributes from `cookie` (the
     * color-mode cookie config) — most apps want the same retention /
     * domain / SameSite for both UI-state cookies. Set this slot
     * explicitly to diverge (e.g. shorter palette retention).
     */
    paletteCookie?: CookieOptions;

    /**
     * Locale integration. When enabled (default), this module registers
     * an SSR-safe, cookie-backed locale source. It bridges the resolved
     * locale into `@vuecs/core`'s `Config['locale']` (so `useLocale()`
     * and locale-aware components — e.g. `@vuecs/timeago` — resolve
     * correctly during SSR) and emits `<html lang>` on first paint.
     *
     * Auto-imports `useLocale()` (read) and `useLocaleManager()`
     * (`set` / `reset` control).
     *
     * Set to `false` to skip — useful if your i18n library (e.g. ilingo,
     * vue-i18n) already owns the active locale; in that case feed its
     * locale ref to `app.use(vuecs, { config: { locale } })` directly.
     * Pass an object to tweak the cookie name, initial value, or fallback.
     *
     * @default true
     */
    locale?: boolean | LocaleOptions;

    /**
     * Cookie attributes applied to the **locale** cookie. When unset,
     * inherits from `cookie`. Set explicitly to diverge.
     */
    localeCookie?: CookieOptions;
}
