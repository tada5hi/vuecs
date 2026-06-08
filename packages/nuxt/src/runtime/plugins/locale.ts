import { installLocale } from '@vuecs/locale';
import type { LocaleSource } from '@vuecs/locale';
import { useNavigatorLanguage } from '@vueuse/core';
import { ref } from 'vue';
import type { App } from 'vue';
// @ts-expect-error resolved by Nuxt at build time
// eslint-disable-next-line @stylistic/exp-list-style
import { defineNuxtPlugin, useCookie, useHead, useRequestHeaders, useRuntimeConfig } from '#imports';

type NuxtAppLike = { vueApp: App };

/**
 * Resolve the most-preferred tag from an `Accept-Language` header,
 * honoring `q=` weights (default `q=1`). `*` is ignored.
 */
function parseAcceptLanguage(header?: string | null): string | undefined {
    if (!header) return undefined;

    const ranked = header
        .split(',')
        .map((part) => {
            const [tag, ...params] = part.trim().split(';');
            const qParam = params.find((p) => p.trim().startsWith('q='));
            const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
            return { tag: tag.trim(), q: Number.isNaN(q) ? 0 : q };
        })
        .filter((entry) => entry.tag.length > 0 && entry.tag !== '*')
        // Stable sort preserves header order for equal weights.
        .sort((a, b) => b.q - a.q);

    return ranked.length > 0 ? ranked[0].tag : undefined;
}

/**
 * Universal plugin (server + client) that wires the SSR-safe locale.
 *
 * The cookie is the SSR transport: a concrete saved locale is read
 * identically on server and client, so first paint matches with no
 * hydration mismatch (the canonical backend-saved-preference flow). When
 * the source is `'auto'`, the server resolves it from the request's
 * `Accept-Language` header and the client from `navigator.language` — a
 * residual one-frame mismatch is only possible in that no-preference case
 * (same class of caveat as color-mode's `'system'`).
 *
 * Bridges the resolved locale into `@vuecs/core`'s `Config['locale']` (so
 * `useLocale()` and locale-aware components resolve correctly during SSR)
 * and emits `<html lang>` into the head before first paint.
 *
 * `enforce: 'post'` so it runs after the user's `app.use(vuecs)` (and the
 * auto-generated themes plugin) — `installConfigManager` merges into the
 * already-registered manager.
 */
export default defineNuxtPlugin({
    name: 'vuecs-locale',
    enforce: 'post',
    setup(nuxtApp: NuxtAppLike) {
        const config = useRuntimeConfig();
        const localeConfig = config.public.vuecs?.locale;
        if (!localeConfig?.enabled) return;

        const cookieName = localeConfig.cookieName || 'vc-locale';
        const initial = (localeConfig.value || 'auto') as LocaleSource;
        const fallback = localeConfig.fallback || 'en-US';

        // Locale cookie attributes — populated by the module from
        // `vuecs.localeCookie` (falling back to `vuecs.cookie`).
        const cookieOptions = (config.public.vuecs?.localeCookie ||
            config.public.vuecs?.cookie ||
            {}) as Record<string, unknown>;

        const cookie = useCookie<LocaleSource>(cookieName, {
            default: () => initial,
            ...cookieOptions,
            // `watch: true` last — installLocale depends on a reactive ref.
            watch: true,
        });

        // `import.meta.server` is replaced by Nuxt at build time; the cast
        // keeps the literal member-expression intact (for that replacement)
        // while satisfying the d.ts emit pass, which lacks Nuxt's
        // `ImportMeta` augmentation.
        const isServer = (import.meta as unknown as { server?: boolean }).server === true;

        const navigatorLanguage = isServer ?
            ref(parseAcceptLanguage(useRequestHeaders(['accept-language'])['accept-language'])) :
            useNavigatorLanguage().language;

        const handles = installLocale(nuxtApp.vueApp, {
            source: cookie,
            initial,
            fallback,
            navigatorLanguage,
        });

        if (isServer) {
            useHead({ htmlAttrs: { lang: handles.resolved.value } });
        }
    },
});
