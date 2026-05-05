import { COLOR_PALETTE_STYLE_ELEMENT_ID } from '@vuecs/design';
import { renderColorPaletteStyles } from '@vuecs/theme-tailwind';
import type { ColorPaletteConfig } from '@vuecs/theme-tailwind';
// @ts-expect-error resolved by Nuxt at build time
import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#imports';

/**
 * SSR-only plugin that emits the palette `<style>` block into the
 * document head before first paint. The client picks up the same
 * element (by id) on hydration, so no FOUC during palette switches
 * driven by the cookie state.
 */
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const colorPalette = (config.public.vuecsTailwind?.colorPalette || {}) as ColorPaletteConfig;

    if (Object.keys(colorPalette).length === 0) {
        return;
    }

    const css = renderColorPaletteStyles(colorPalette);
    useHead({ style: [{ id: COLOR_PALETTE_STYLE_ELEMENT_ID, innerHTML: css }] });
});
