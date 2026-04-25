import { computed, watch } from 'vue';
import type { ComputedRef, WritableComputedRef } from 'vue';
import { useDark, usePreferredDark } from '@vueuse/core';
// @ts-expect-error resolved by Nuxt at build time
import { useCookie, useRuntimeConfig } from '#imports';

export type ColorMode = 'light' | 'dark' | 'system';

export interface UseColorModeReturn {
    /** Selected mode — may be `'system'` to defer to OS preference. */
    mode: WritableComputedRef<ColorMode>;

    /** Effective mode — never `'system'`; resolves to `'light'` or `'dark'`. */
    resolved: ComputedRef<'light' | 'dark'>;

    /** Convenience boolean: `resolved.value === 'dark'`. */
    isDark: WritableComputedRef<boolean>;

    /**
     * Flip between light and dark explicitly. Always sets `mode` to
     * `'light'` or `'dark'` — leaves `'system'` if the user re-selects it
     * directly via `mode.value = 'system'`.
     */
    toggle(): void;
}

/**
 * SSR-safe color mode composable. Persists the user's choice in a
 * cookie (set server-side via the Nuxt module's runtime config), so
 * the server can render the correct `html.dark` class on first paint.
 * Client-side reactivity is powered by `@vueuse/core`'s `useDark`.
 *
 * The cookie stores one of `'light' | 'dark' | 'system'`.
 * `'system'` resolves on the client via `prefers-color-scheme` and
 * cannot be resolved during SSR on first visit — in that case the
 * server omits the class and the client applies it at hydration.
 */
export function useColorMode(): UseColorModeReturn {
    const config = useRuntimeConfig();
    const colorModeConfig = config.public.vuecs?.colorMode;

    const cookieName = colorModeConfig?.cookieName || 'vc-color-mode';
    const defaultPreference = (colorModeConfig?.preference || 'system') as ColorMode;

    const cookie = useCookie<ColorMode>(cookieName, {
        default: () => defaultPreference,
        watch: true,
    });

    const preferredDark = usePreferredDark();

    const resolved = computed<'light' | 'dark'>(() => {
        if (cookie.value === 'dark') return 'dark';
        if (cookie.value === 'light') return 'light';
        return preferredDark.value ? 'dark' : 'light';
    });

    // VueUse's useDark handles the client-side DOM class toggle. We pass
    // `onChanged: noop` because we manage the class-flip via the `watch`
    // below (to keep the cookie as the single source of truth — useDark
    // would otherwise write to localStorage).
    const isDark = useDark({
        selector: 'html',
        valueDark: 'dark',
        valueLight: 'light',
        storageKey: null,
        initialValue: () => (resolved.value === 'dark' ? 'dark' : 'light'),
        onChanged: () => { /* handled by watch below */ },
    });

    const mode = computed<ColorMode>({
        get: () => cookie.value,
        set: (value) => {
            cookie.value = value;
        },
    });

    if (typeof document !== 'undefined') {
        watch(
            resolved,
            (value) => {
                document.documentElement.classList.toggle('dark', value === 'dark');
                document.documentElement.classList.toggle('light', value === 'light');
                isDark.value = value === 'dark';
            },
            { immediate: true },
        );
    }

    function toggle(): void {
        cookie.value = resolved.value === 'dark' ? 'light' : 'dark';
    }

    return {
        mode,
        resolved,
        isDark,
        toggle,
    };
}
