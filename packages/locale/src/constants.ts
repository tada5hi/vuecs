/**
 * Sentinel source value — the locale analog of color-mode's `'system'`.
 * When the source is `'auto'`, resolution defers to the browser's
 * navigator language, falling back to the configured fallback.
 */
export const AUTO_LOCALE = 'auto';

/** Default localStorage key for the persisted locale source. */
export const DEFAULT_STORAGE_KEY = 'vc-locale';

/** Injection key for the per-app locale manager handles. */
export const LOCALE_MANAGER_SYMBOL = Symbol.for('VCLocaleManager');
