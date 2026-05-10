import { useConfig } from '@vuecs/core';
import {
    COLOR_PALETTE_STYLE_ELEMENT_ID,
    THEME_RUNTIME_MANAGER_SYMBOL,
    renderColorPaletteFromThemes,
} from '@vuecs/design';
import { renderColorPaletteStyles } from '@vuecs/theme-tailwind';
import type { ColorPaletteConfig } from '@vuecs/theme-tailwind';
import { inject } from 'vue';
// @ts-expect-error resolved by Nuxt at build time
// eslint-disable-next-line @stylistic/exp-list-style
import { defineNuxtPlugin, useCookie, useHead, useRuntimeConfig } from '#imports';

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
 * client-side `useColorPalette()` dispatcher. When no ThemeManager is
 * installed (e.g. consumers using `@vuecs/theme-tailwind-nuxt`
 * standalone, or unusual plugin-ordering edge cases), falls back to
 * `renderColorPaletteStyles` from `@vuecs/theme-tailwind` directly so
 * Tailwind palette CSS still flows.
 *
 * Reads the `vc-color-palette` cookie first (so returning visitors get
 * their persisted palette on first paint, with no FOUC on hydration);
 * falls back to `runtimeConfig.public.vuecsTailwind.colorPalette` (the
 * `nuxt.config.ts` default) when the cookie is absent.
 *
 * `enforce: 'post'` ensures this runs after user-defined plugins
 * register vuecs (`app.use(vuecs, { themes })`) so the ThemeManager
 * is reachable via inject.
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
            .runWithContext(() => inject(THEME_RUNTIME_MANAGER_SYMBOL, undefined));

        /*
         * Resolve the CSP nonce from the cross-cutting Config registry.
         * `useConfig` returns a ComputedRef; on the server we read once
         * at head-emit time. Consumers wire the nonce per-request via
         * `app.use(vuecs, { config: { nonce } })` or
         * `<VCConfigProvider :config="{ nonce }">`. When unset, no
         * `nonce` attribute is added.
         */
        const nonce = nuxtApp.vueApp
            .runWithContext(() => useConfig('nonce').value);

        /*
         * Prefer the theme-runtime dispatch when a manager is
         * installed; fall back to Tailwind's own renderer when not. The
         * fallback preserves the pre-plan-021 behaviour for consumers
         * using `@vuecs/theme-tailwind-nuxt` standalone (without
         * `@vuecs/core`) so removing this module doesn't silently break
         * their first-paint palette.
         */
        let css = manager ?
            renderColorPaletteFromThemes(manager.themes, colorPalette as Record<string, string>) :
            renderColorPaletteStyles(colorPalette);

        if (!css) return;

        /*
         * Reject CSS containing `</style` to defang any malformed theme
         * renderer (or attacker-controlled cookie) that could break out
         * of the `<style>` element and inject HTML. The palette source
         * includes the `vc-color-palette` cookie, which is
         * client-controlled, so the surface needs hardening even though
         * `useHead` itself doesn't escape the value below.
         */
        if (/<\/style/i.test(css)) {
            css = '';
        }
        if (!css) return;

        /*
         * `children` (textContent) instead of `innerHTML` for the head
         * style block: textContent is the safe path that avoids the
         * `</style>` HTML-injection surface entirely. unhead's
         * type-validated `children` field maps to textContent.
         */
        useHead({
            style: [{
                id: COLOR_PALETTE_STYLE_ELEMENT_ID,
                children: css,
                ...(nonce ? { nonce } : {}),
            }],
        });
    },
});
