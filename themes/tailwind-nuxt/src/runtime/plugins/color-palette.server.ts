import { COLOR_PALETTE_STYLE_ELEMENT_ID } from '@vuecs/design';
import { renderColorPaletteStyles } from '@vuecs/theme-tailwind';
import type { ColorPaletteConfig } from '@vuecs/theme-tailwind';
// @ts-expect-error resolved by Nuxt at build time
// eslint-disable-next-line @stylistic/exp-list-style
import { defineNuxtPlugin, useCookie, useHead, useRuntimeConfig } from '#imports';

/**
 * SSR-only plugin that emits the palette `<style>` block into the
 * document head before first paint.
 *
 * Reads the `vc-color-palette` cookie first (so returning visitors get
 * their persisted palette on first paint, with no FOUC on hydration);
 * falls back to `runtimeConfig.public.vuecsTailwind.colorPalette` (the
 * `nuxt.config.ts` default) when the cookie is absent. Mirrors the
 * pattern used by `@vuecs/nuxt`'s color-mode SSR plugin.
 *
 * `renderColorPaletteStyles()` itself filters unknown scales + palette
 * names, so a tampered cookie can never produce broken CSS.
 */
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const fallback = (config.public.vuecsTailwind?.colorPalette || {}) as ColorPaletteConfig;

    const cookie = useCookie<ColorPaletteConfig | undefined>(
        'vc-color-palette',
        { default: () => undefined },
    );

    const colorPalette = cookie.value || fallback;

    if (!colorPalette || Object.keys(colorPalette).length === 0) {
        return;
    }

    const css = renderColorPaletteStyles(colorPalette);
    if (!css) {
        return;
    }

    useHead({ style: [{ id: COLOR_PALETTE_STYLE_ELEMENT_ID, innerHTML: css }] });
});
