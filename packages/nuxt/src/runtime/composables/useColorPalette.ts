import { useConfig } from '@vuecs/core';
import { useColorPaletteUnshared } from '@vuecs/design';
import type {
    ColorPaletteName,
    SemanticScaleName,
    UseColorPaletteReturn,
} from '@vuecs/design';
// Side-effect import: loads the `Config['nonce']` augmentation.
import '../../config';
// @ts-expect-error resolved by Nuxt at build time
import { useCookie, useRuntimeConfig } from '#imports';

/**
 * Generic palette config typed against the design-system catalog.
 *
 * Widens automatically when community themes augment
 * `ExtraColorPaletteNames` in `@vuecs/design` — consumers installing
 * such a theme keep autocomplete on its extra names without any
 * Nuxt-side wiring.
 */
export type NuxtColorPaletteConfig = Partial<Record<SemanticScaleName, ColorPaletteName>>;

/**
 * SSR-safe palette composable. Backed by a Nuxt cookie so the server
 * can render the correct `<style id="vc-color-palette">` block on first
 * paint via the bundled SSR plugin.
 *
 * Theme-agnostic: dispatch flows through the generic
 * `useColorPaletteUnshared` in `@vuecs/design`, which walks every
 * installed theme's `palette.handle` hook and concatenates outputs.
 * The Tailwind / Bulma split that previously lived in per-theme Nuxt
 * sub-modules collapsed into this single composable in plan 025.
 *
 * Initial value falls back to `runtimeConfig.public.vuecs.colorPalette`
 * (set by the Nuxt module from `nuxt.config.ts`) when the cookie is
 * absent.
 */
export function useColorPalette(): UseColorPaletteReturn<NuxtColorPaletteConfig> {
    const config = useRuntimeConfig();
    const colorPaletteConfig = config.public.vuecs?.colorPalette;

    const cookieName = colorPaletteConfig?.cookieName || 'vc-color-palette';
    const initial = (colorPaletteConfig?.value || {}) as NuxtColorPaletteConfig;

    // Palette cookie attributes — populated by the Nuxt module from
    // `vuecs.paletteCookie` (falling back to `vuecs.cookie`).
    const cookieOptions = (config.public.vuecs?.paletteCookie ||
        config.public.vuecs?.cookie ||
        {}) as Record<string, unknown>;

    const cookie = useCookie<NuxtColorPaletteConfig>(cookieName, {
        default: () => ({ ...initial }),
        ...cookieOptions,
        // `watch: true` must come last — useColorPaletteUnshared depends
        // on the ref being reactive, and we don't want consumer-supplied
        // cookieOptions to silently disable that.
        watch: true,
    });

    /*
     * CSP nonce: read via the cross-cutting Config registry (themes
     * augment `Config['nonce']` to expose `nonce?: string`). Passed as a
     * getter so the bound watcher re-reads on every `<style>` re-apply
     * — matches the per-request nonce the SSR plugin wires via
     * `useHead({ style: [{ ..., nonce }] })` so the client-side bind
     * doesn't strip the SSR-emitted nonce on hydration.
     */
    const nonce = useConfig('nonce');

    return useColorPaletteUnshared<NuxtColorPaletteConfig>({
        source: cookie,
        nonce: () => nonce.value,
    });
}

export type { UseColorPaletteReturn } from '@vuecs/design';
