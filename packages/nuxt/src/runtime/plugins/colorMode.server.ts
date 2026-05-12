import { THEME_RUNTIME_MANAGER_SYMBOL, captureColorModeAttrs } from '@vuecs/design';
import { inject } from 'vue';
// @ts-expect-error resolved by Nuxt at build time
// eslint-disable-next-line @stylistic/exp-list-style
import { defineNuxtPlugin, useCookie, useHead, useRuntimeConfig } from '#imports';

/**
 * Server-only plugin that applies `.dark` / `.light` to the `<html>`
 * element during SSR based on the persisted cookie (or the configured
 * `colorMode.value` fallback). This ensures first paint matches the
 * user's selected mode — no flash during hydration.
 *
 * On first visit with `colorMode.value: 'system'` and no cookie, the
 * server omits the class; the client then resolves `prefers-color-scheme`
 * and applies the class reactively. A brief flash is possible in that
 * narrow case.
 *
 * Plan 021 slice 3: also dispatches each installed theme's
 * `colorMode.handle` against a synthetic Document and plumbs the captured
 * attributes (e.g. `data-bs-theme` from theme-bootstrap, `data-theme`
 * from theme-bulma) into `useHead({ htmlAttrs })` so framework chrome
 * flips alongside `.dark` on first paint, not just after hydration.
 *
 * `enforce: 'post'` ensures this plugin runs after user-defined
 * plugins that install vuecs (`app.use(vuecs, { themes })`), so the
 * ThemeManager is already provided when we look it up.
 */
type NuxtAppLike = {
    vueApp: {
        runWithContext: <T>(fn: () => T) => T;
    };
};

export default defineNuxtPlugin({
    name: 'vuecs-color-mode-server',
    enforce: 'post',
    setup(nuxtApp: NuxtAppLike) {
        const config = useRuntimeConfig();
        const colorModeConfig = config.public.vuecs?.colorMode;
        if (!colorModeConfig?.enabled) return;

        const cookieName = colorModeConfig.cookieName || 'vc-color-mode';
        const cookie = useCookie<'light' | 'dark' | 'system' | undefined>(
            cookieName,
            { default: () => undefined },
        );

        const stored = cookie.value;
        let effective: 'light' | 'dark' | undefined;
        if (stored === 'light' || stored === 'dark') {
            effective = stored;
        } else if (colorModeConfig.value === 'light' || colorModeConfig.value === 'dark') {
            effective = colorModeConfig.value;
        }

        if (!effective) return;

        const htmlAttrs: Record<string, string> = { class: effective };

        /*
         * Look up the ThemeManager via Vue's inject in the Nuxt app's
         * context. Themes were registered when the user's plugin called
         * `app.use(vuecs, { themes })`. With `enforce: 'post'` that
         * plugin has already run.
         */
        const manager = nuxtApp.vueApp
            .runWithContext(() => inject(THEME_RUNTIME_MANAGER_SYMBOL, undefined));

        if (manager) {
            const captured = captureColorModeAttrs(manager.themes, effective);
            Object.assign(htmlAttrs, captured);
        }

        useHead({ htmlAttrs });
    },
});
