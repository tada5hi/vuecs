import { DEFAULT_LOCALE } from '@vuecs/core';
import { useNavigatorLanguage } from '@vueuse/core';
import { computed, watch } from 'vue';
import type { Ref } from 'vue';
import { AUTO_LOCALE } from './constants';
import type { BindLocaleOptions, LocaleSource, UseLocaleReturn } from './types';

/**
 * Wire any reactive `Ref<LocaleSource>` into a resolved locale: resolve
 * an explicit override directly, otherwise defer to the browser's
 * navigator language (via `@vueuse/core`'s `useNavigatorLanguage`),
 * falling back to a concrete tag when the navigator is unavailable.
 *
 * Building block — parallels `@vuecs/design`'s `bindColorMode`. The
 * install plugin composes this with storage + the config bridge; pass a
 * cookie-backed ref here directly for SSR-aware (Nuxt) persistence.
 *
 * `set()` writes an explicit override; `reset()` returns the source to
 * `options.initial` (default `'auto'`), handing resolution back to the
 * browser language — the "reset to default locale" path for an app that
 * applied a backend-saved user preference via `set()`.
 */
export function bindLocale(
    source: Ref<LocaleSource>,
    options: BindLocaleOptions = {},
): UseLocaleReturn {
    const {
        initial = AUTO_LOCALE,
        fallback = DEFAULT_LOCALE,
        syncLang = true,
        navigatorLanguage,
    } = options;

    // Resolve the "browser language" source. SSR layers inject a
    // (e.g. Accept-Language-derived) ref so `'auto'` resolves on the
    // server — and so the client-only `languagechange` listener inside
    // `useNavigatorLanguage` is never registered during SSR.
    const language = navigatorLanguage ?? useNavigatorLanguage().language;

    const resolved = computed<string>(() => {
        const { value } = source;
        if (value && value !== AUTO_LOCALE) {
            return value;
        }
        return language.value || fallback;
    });

    const isAuto = computed<boolean>(() => !source.value || source.value === AUTO_LOCALE);

    if (syncLang && typeof document !== 'undefined') {
        watch(
            resolved,
            (value) => {
                document.documentElement.lang = value;
            },
            { immediate: true },
        );
    }

    function set(locale: string): void {
        source.value = locale;
    }

    function reset(): void {
        source.value = initial;
    }

    return {
        source,
        resolved,
        isAuto,
        set,
        reset,
    };
}
