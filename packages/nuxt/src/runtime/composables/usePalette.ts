import { bindPalette } from '@vuecs/design';
import type { PaletteConfig, UsePaletteReturn } from '@vuecs/design';
// @ts-expect-error resolved by Nuxt at build time
import { useCookie, useRuntimeConfig } from '#imports';

/**
 * SSR-safe palette composable. Backed by a Nuxt cookie so the server
 * can render the correct `<style id="vc-palette">` block on first
 * paint via the bundled SSR plugin.
 *
 * Falls back to `runtimeConfig.public.vuecs.palette` (set by the Nuxt
 * module from the user's config) when no cookie exists. Delegates all
 * apply-on-watch logic to `@vuecs/design`'s `bindPalette()` — both the
 * default composable and this one expose the same
 * `{ current, set, extend }` shape.
 */
export function usePalette(): UsePaletteReturn {
    const config = useRuntimeConfig();
    const initial = (config.public.vuecs?.palette || {}) as PaletteConfig;

    const cookie = useCookie<PaletteConfig>('vc-palette', {
        default: () => ({ ...initial }),
        watch: true,
        // Match the documented contract — a returning visitor sees
        // their persisted palette before any client JS runs. Without
        // explicit `maxAge`, Nuxt produces a session cookie that
        // doesn't survive browser restart.
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
    });

    return bindPalette(cookie);
}

export type { UsePaletteReturn } from '@vuecs/design';
