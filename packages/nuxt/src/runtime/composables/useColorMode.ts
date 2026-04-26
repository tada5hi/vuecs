import { bindColorMode } from '@vuecs/design';
import type { ColorMode, UseColorModeReturn } from '@vuecs/design';
// @ts-expect-error resolved by Nuxt at build time
import { useCookie, useRuntimeConfig } from '#imports';

/**
 * SSR-safe color-mode composable. Persists the user's choice via a
 * Nuxt cookie so the server-side `colorMode.server` plugin renders
 * `html.dark` / `html.light` on first paint — no FOUC.
 *
 * The cookie stores `'light' | 'dark' | 'system'`. `'system'` resolves
 * via `prefers-color-scheme` on the client and cannot be resolved
 * during SSR on first visit (cookie absent) — in that case the server
 * omits the class and the client applies it during hydration.
 *
 * Delegates the resolved/isDark/toggle/class-sync logic to
 * `@vuecs/design`'s `bindColorMode()`.
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

    return bindColorMode(cookie);
}

export type { ColorMode, UseColorModeReturn } from '@vuecs/design';
