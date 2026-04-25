import { computed, watch } from 'vue';
import type { ComputedRef, WritableComputedRef } from 'vue';
import { usePreferredDark } from '@vueuse/core';
// @ts-expect-error resolved by Nuxt at build time
import { useCookie, useRuntimeConfig } from '#imports';

export type ColorMode = 'light' | 'dark' | 'system';

export interface UseColorModeReturn {
    /** Selected mode — may be `'system'` to defer to OS preference. */
    mode: WritableComputedRef<ColorMode>;

    /** Effective mode — never `'system'`; resolves to `'light'` or `'dark'`. */
    resolved: ComputedRef<'light' | 'dark'>;

    /**
     * Convenience boolean tracking `resolved.value === 'dark'`.
     * Writable: `isDark.value = true` sets `mode` to `'dark'`,
     * `isDark.value = false` sets it to `'light'`.
     */
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

    const mode = computed<ColorMode>({
        get: () => cookie.value,
        set: (value) => {
            cookie.value = value;
        },
    });

    const isDark = computed<boolean>({
        get: () => resolved.value === 'dark',
        set: (value) => {
            cookie.value = value ? 'dark' : 'light';
        },
    });

    // Sync the resolved mode to the <html> class. Mirrors what the
    // SSR plugin does on the server, so the class set during SSR
    // matches what the client computes.
    if (typeof document !== 'undefined') {
        watch(
            resolved,
            (value) => {
                document.documentElement.classList.toggle('dark', value === 'dark');
                document.documentElement.classList.toggle('light', value === 'light');
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
