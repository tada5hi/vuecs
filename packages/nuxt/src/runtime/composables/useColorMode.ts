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
    const defaultValue = (colorModeConfig?.value || 'system') as ColorMode;

    // Shared cookie options come from the Nuxt module (set in
    // `nuxt.config.ts` under `vuecs.cookie`); documented defaults
    // (1y, lax, path=/) are applied module-side.
    const cookieOptions = (config.public.vuecs?.cookie || {}) as Record<string, unknown>;

    const cookie = useCookie<ColorMode>(cookieName, {
        default: () => defaultValue,
        ...cookieOptions,
        // `watch: true` must come last — bindColorMode depends on the
        // ref being reactive, and we don't want consumer-supplied
        // cookieOptions to silently disable that.
        watch: true,
    });

    return bindColorMode(cookie);
}

export type { ColorMode, UseColorModeReturn } from '@vuecs/design';
