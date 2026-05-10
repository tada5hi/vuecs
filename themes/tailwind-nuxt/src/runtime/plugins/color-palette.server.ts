import { COLOR_PALETTE_STYLE_ELEMENT_ID, renderColorPaletteFromThemes } from '@vuecs/design';
import type { ThemeRuntimeManager } from '@vuecs/design';
import type { ColorPaletteConfig } from '@vuecs/theme-tailwind';
import { inject } from 'vue';
// @ts-expect-error resolved by Nuxt at build time
// eslint-disable-next-line @stylistic/exp-list-style
import { defineNuxtPlugin, useCookie, useHead, useRuntimeConfig } from '#imports';

const THEME_MANAGER_SYMBOL = Symbol.for('VCThemeManager');

type NuxtAppLike = {
    vueApp: {
        runWithContext: <T>(fn: () => T) => T;
    };
};

/**
 * SSR-only plugin that emits the palette `<style>` block into the
 * document head before first paint.
 *
 * Plan 021 slice 3: walks every installed theme's `palette.render`
 * hook (via `renderColorPaletteFromThemes()` in `@vuecs/design`) and
 * concatenates the outputs — same theme-agnostic semantic as the
 * client-side `useColorPalette()` dispatcher. theme-tailwind declares
 * its renderer at the theme level, so this plugin no longer imports
 * `renderColorPaletteStyles` directly.
 *
 * Reads the `vc-color-palette` cookie first (so returning visitors get
 * their persisted palette on first paint, with no FOUC on hydration);
 * falls back to `runtimeConfig.public.vuecsTailwind.colorPalette` (the
 * `nuxt.config.ts` default) when the cookie is absent.
 *
 * `enforce: 'post'` ensures this runs after user-defined plugins
 * register vuecs (`app.use(vuecs, { themes })`) so the ThemeManager
 * is reachable via inject. Without it, no palette dispatch happens
 * (graceful no-op).
 */
export default defineNuxtPlugin({
    name: 'vuecs-tailwind-color-palette-server',
    enforce: 'post',
    setup(nuxtApp: NuxtAppLike) {
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

        const manager = nuxtApp.vueApp
            .runWithContext(() => inject<ThemeRuntimeManager | undefined>(THEME_MANAGER_SYMBOL, undefined));

        if (!manager) return;

        const css = renderColorPaletteFromThemes(
            manager.themes,
            colorPalette as Record<string, string>,
        );
        if (!css) return;

        useHead({ style: [{ id: COLOR_PALETTE_STYLE_ELEMENT_ID, innerHTML: css }] });
    },
});
