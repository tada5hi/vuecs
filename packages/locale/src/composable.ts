import { inject } from '@vuecs/core';
import { LOCALE_MANAGER_SYMBOL } from './constants';
import type { UseLocaleReturn } from './types';

/**
 * Access the locale control surface (`set` / `reset` / `source` /
 * `resolved` / `isAuto`) provided by the `@vuecs/locale` plugin.
 *
 * Use this from any component to apply a backend-saved override
 * (`set('de-DE')`) or hand resolution back to the browser language
 * (`reset()`).
 *
 * To merely *read* the active locale (the common case for component
 * authors), prefer `useLocale()` from `@vuecs/core` — it works without
 * this plugin installed.
 *
 * @throws if the plugin was not installed via `app.use(locale)`.
 */
export function useLocaleManager(): UseLocaleReturn {
    const handles = inject<UseLocaleReturn>(LOCALE_MANAGER_SYMBOL);
    if (!handles) {
        throw new Error(
            '[@vuecs/locale] No locale manager found. Install the plugin via `app.use(locale, { /* options */ })`.',
        );
    }

    return handles;
}
