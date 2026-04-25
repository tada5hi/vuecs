import { PALETTE_STYLE_ELEMENT_ID, renderPaletteStyles } from '@vuecs/design';
import type { PaletteConfig } from '@vuecs/design';
// @ts-expect-error resolved by Nuxt at build time
import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#imports';

/**
 * SSR-only plugin that emits the palette `<style>` block into the
 * document head before first paint. The client picks up the same
 * element (by id) on hydration, so no FOUC during palette switches
 * driven by `appConfig`.
 */
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const palette = (config.public.vuecs?.palette || {}) as PaletteConfig;

    if (Object.keys(palette).length === 0) {
        return;
    }

    const css = renderPaletteStyles(palette);
    useHead({ style: [{ id: PALETTE_STYLE_ELEMENT_ID, innerHTML: css }] });
});
