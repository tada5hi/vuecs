import { bindColorPalette } from '@vuecs/design';
import type { UseColorPaletteReturn } from '@vuecs/design';
import { renderColorPaletteStyles } from '@vuecs/theme-tailwind';
import type { ColorPaletteConfig } from '@vuecs/theme-tailwind';
// @ts-expect-error resolved by Nuxt at build time
import { useCookie, useRuntimeConfig } from '#imports';

/**
 * SSR-safe palette composable. Backed by a Nuxt cookie so the server
 * can render the correct `<style id="vc-color-palette">` block on first
 * paint via the bundled SSR plugin.
 *
 * Falls back to `runtimeConfig.public.vuecsTailwind.colorPalette` (set by
 * the Nuxt module from the user's config) when no cookie exists.
 * Delegates apply-on-watch logic to `@vuecs/design`'s generic
 * `bindColorPalette()` with this theme's `renderColorPaletteStyles` as the
 * renderer — both the default (`@vuecs/theme-tailwind`'s
 * localStorage-backed) `useColorPalette()` and this one expose the same
 * `{ current, set, extend }` shape.
 */
export function useColorPalette(): UseColorPaletteReturn<ColorPaletteConfig> {
    const config = useRuntimeConfig();
    const initial = (config.public.vuecsTailwind?.colorPalette || {}) as ColorPaletteConfig;

    // Cookie options are populated by the Nuxt module from
    // `vuecsTailwind.cookie` in `nuxt.config.ts`, with documented defaults.
    const cookieOptions = (config.public.vuecsTailwind?.cookie || {}) as Record<string, unknown>;

    const cookie = useCookie<ColorPaletteConfig>('vc-color-palette', {
        default: () => ({ ...initial }),
        watch: true,
        ...cookieOptions,
    });

    return bindColorPalette(cookie, renderColorPaletteStyles);
}

export type { UseColorPaletteReturn } from '@vuecs/design';
