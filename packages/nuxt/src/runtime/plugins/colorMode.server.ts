// @ts-expect-error resolved by Nuxt at build time
// eslint-disable-next-line @stylistic/exp-list-style
import { defineNuxtPlugin, useCookie, useHead, useRuntimeConfig } from '#imports';

/**
 * Server-only plugin that applies `.dark` / `.light` to the `<html>`
 * element during SSR based on the persisted cookie (or the configured
 * fallback `preference`). This ensures first paint matches the user's
 * selected mode — no flash during hydration.
 *
 * On first visit with `preference: 'system'` and no cookie, the server
 * omits the class; the client then resolves `prefers-color-scheme` and
 * applies the class reactively. A brief flash is possible in that
 * narrow case.
 */
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const colorModeConfig = config.public.vuecs?.colorMode;
    if (!colorModeConfig?.enabled) return;

    // Default mirrors the composable's fallback (vc-color-mode) so the
    // two stay in sync if runtimeConfig is incomplete for any reason.
    const cookieName = colorModeConfig.cookieName || 'vc-color-mode';
    const cookie = useCookie<'light' | 'dark' | 'system' | undefined>(
        cookieName,
        { default: () => undefined },
    );

    const stored = cookie.value;
    let effective: string | undefined;
    if (stored && stored !== 'system') {
        effective = stored;
    } else if (colorModeConfig.preference !== 'system') {
        effective = colorModeConfig.preference;
    }

    if (!effective) return;

    useHead({ htmlAttrs: { class: effective } });
});
