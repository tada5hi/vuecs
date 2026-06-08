import type { ComputedRef } from 'vue';
import { useConfig } from './composable';

/**
 * Canonical fallback locale. Mirrors the `locale` default registered by
 * `CORE_DEFAULTS` in the {@link ConfigManager}, so `useLocale()` resolves
 * to the same value whether or not a manager is installed.
 */
export const DEFAULT_LOCALE = 'en-US';

/**
 * Read-side accessor for the active BCP-47 locale.
 *
 * Thin convenience wrapper over `useConfig('locale')` — the locale lives
 * in the cross-cutting {@link Config} so a single
 * `app.use(vuecs, { config: { locale } })` (or `<VCConfigProvider>`) drives
 * every locale-aware component (timeago, future date / number formatters).
 *
 * The *source* of the value is intentionally not this package's concern:
 * `Config['locale']` accepts a `MaybeRef`, so consumers feed it a static
 * string, a `vue-i18n` locale ref, or `@vuecs/locale`'s navigator-backed,
 * resettable source. This composable only reads whatever resolved value
 * lands in config.
 *
 * @param fallback - returned when no consumer config and no registered
 *   default provide a value. Defaults to {@link DEFAULT_LOCALE}.
 * @returns a `ComputedRef<string>` that recomputes when the config locale
 *   changes (including reactive sources unwrapped from `Config['locale']`).
 */
export function useLocale(fallback: string = DEFAULT_LOCALE): ComputedRef<string> {
    return useConfig('locale', fallback);
}
