import type { ComputedRef, Ref } from 'vue';

/**
 * The locale "source" value the user controls.
 *
 * Either an explicit BCP-47 tag (an override — e.g. a backend-saved user
 * preference) or the `'auto'` sentinel (the analog of color-mode's
 * `'system'`), which defers resolution to the browser's navigator
 * language and falls back to {@link BindLocaleOptions.fallback}.
 */
// `string & {}` keeps the `'auto'` sentinel visible in autocomplete while
// still accepting any BCP-47 tag — a bare `string | 'auto'` collapses to
// `string` and loses the hint.
export type LocaleSource = (string & {}) | 'auto';

export type BindLocaleOptions = {
    /**
     * Initial source value — also the target {@link UseLocaleReturn.reset}
     * returns to. `'auto'` (default) detects the browser language.
     * @default 'auto'
     */
    initial?: LocaleSource;
    /**
     * Concrete fallback used when the source is `'auto'` but no browser
     * language is available (SSR without an `Accept-Language` header,
     * unsupported navigator).
     * @default 'en-US' (re-uses `@vuecs/core`'s `DEFAULT_LOCALE`)
     */
    fallback?: string;
    /**
     * Mirror the resolved locale onto `<html lang>`.
     * @default true
     */
    syncLang?: boolean;
    /**
     * Reactive source for the "browser language" used to resolve the
     * `'auto'` sentinel. Defaults to `@vueuse/core`'s
     * `useNavigatorLanguage().language`.
     *
     * SSR layers inject an `Accept-Language`-derived ref here so `'auto'`
     * resolves on the server without a `navigator` — and so the
     * client-only `languagechange` listener is never registered during
     * server rendering. See `@vuecs/nuxt`'s locale plugin.
     */
    navigatorLanguage?: Ref<string | undefined>;
};

export type LocaleOptions = BindLocaleOptions & {
    /**
     * Persist the source to localStorage so a reload restores the last
     * override (or `'auto'`) before any backend round-trip. Ignored when
     * {@link LocaleOptions.source} is provided.
     * @default true
     */
    persist?: boolean;
    /**
     * localStorage key used when `persist` is true.
     * @default 'vc-locale'
     */
    storageKey?: string;
    /**
     * Inject a custom source ref instead of the built-in localStorage /
     * in-memory source. Use for SSR-aware persistence — e.g. a Nuxt
     * cookie ref. When set, `persist` / `storageKey` are ignored.
     */
    source?: Ref<LocaleSource>;
};

export type UseLocaleReturn = {
    /** The writable source — a BCP-47 tag or `'auto'`. */
    source: Ref<LocaleSource>;
    /** Resolved concrete BCP-47 tag: override → navigator → fallback. */
    resolved: ComputedRef<string>;
    /** Whether the source currently defers to the browser language. */
    isAuto: ComputedRef<boolean>;
    /** Apply an explicit override (e.g. a backend-saved preference). */
    set: (locale: string) => void;
    /** Reset to the configured default (`initial`, usually `'auto'`). */
    reset: () => void;
};
