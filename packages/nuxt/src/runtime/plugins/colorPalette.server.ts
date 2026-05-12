import { useConfig } from '@vuecs/core';
import {
    COLOR_PALETTE_STYLE_ELEMENT_ID,
    THEME_RUNTIME_MANAGER_SYMBOL,
    renderColorPaletteFromThemes,
} from '@vuecs/design';
import { inject } from 'vue';
// Side-effect import: loads the `Config['nonce']` augmentation.
import '../../config';
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
 * Theme-agnostic dispatch (plan 025): walks every installed theme's
 * `palette.handle` hook via `renderColorPaletteFromThemes()` from
 * `@vuecs/design` and concatenates the outputs. The pre-collapse
 * Tailwind-specific fallback path is gone — when no ThemeManager is
 * reachable via inject (e.g. user-plugin didn't run, plugin ordering
 * issue), this plugin silently no-ops. The auto-generated themes
 * plugin from `vuecs.themes: [...]` covers the common failure mode
 * by installing themes before this plugin runs.
 *
 * Reads the configured palette cookie first (so returning visitors get
 * their persisted palette on first paint, with no FOUC on hydration);
 * falls back to `runtimeConfig.public.vuecs.colorPalette.value` when
 * the cookie is absent.
 *
 * `enforce: 'post'` ensures this runs after user-defined plugins (and
 * the auto-generated themes plugin) that register vuecs so the
 * ThemeManager is reachable via inject.
 */
export default defineNuxtPlugin({
    name: 'vuecs-color-palette-server',
    enforce: 'post',
    setup(nuxtApp: NuxtAppLike) {
        const config = useRuntimeConfig();
        const colorPaletteConfig = config.public.vuecs?.colorPalette;
        if (!colorPaletteConfig?.enabled) return;

        const cookieName = colorPaletteConfig.cookieName || 'vc-color-palette';
        const fallback = (colorPaletteConfig.value || {}) as Record<string, string>;

        const cookie = useCookie<Record<string, string> | undefined>(
            cookieName,
            { default: () => undefined },
        );

        const palette = cookie.value || fallback;

        if (!palette || Object.keys(palette).length === 0) {
            return;
        }

        const manager = nuxtApp.vueApp
            .runWithContext(() => inject(THEME_RUNTIME_MANAGER_SYMBOL, undefined));

        /*
         * No-manager → no-op. Consumers who configure `colorPalette`
         * but don't install vuecs (no `themes:` config and no user
         * plugin calling `app.use(vuecs, { themes })`) get no
         * first-paint palette — same semantic as the client-side
         * dispatcher already follows.
         */
        if (!manager) return;

        const nonce = nuxtApp.vueApp
            .runWithContext(() => useConfig('nonce').value);

        let css = renderColorPaletteFromThemes(manager.themes, palette);

        if (!css) return;

        /*
         * Reject CSS containing `</style` to defang any malformed theme
         * renderer (or attacker-controlled cookie) that could break out
         * of the `<style>` element and inject HTML. The palette source
         * includes the cookie, which is client-controlled, so the
         * surface needs hardening even though `useHead` itself doesn't
         * escape the value below.
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
