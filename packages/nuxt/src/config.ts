// Anchor import so TypeScript can resolve `@vuecs/core` for the
// declaration-merging augmentation below. Type-only — no runtime cost.
import type {} from '@vuecs/core';

/**
 * Nuxt-module config keys. Augments the cross-cutting `Config`
 * interface in `@vuecs/core`. Side-effect imported by the runtime
 * composables / SSR plugins that read `useConfig('nonce')`, so the
 * augmentation is loaded transitively from any Nuxt build that
 * depends on `@vuecs/nuxt`.
 *
 * Identical augmentation to `@vuecs/theme-tailwind/src/config.ts` and
 * `@vuecs/theme-bulma/src/config.ts` — TypeScript's interface
 * declaration merging is additive, so multiple identical augmentations
 * compose harmlessly. This file ensures the key is reachable even
 * when neither theme is installed (e.g. a custom-theme Nuxt app).
 */
declare module '@vuecs/core' {
    interface Config {
        /**
         * CSP nonce written onto inline `<style>` tags created at
         * runtime — used by `@vuecs/nuxt`'s palette SSR plugin and
         * the cookie-backed `useColorPalette()` composable. When
         * unset, no `nonce` attribute is added (works in non-CSP
         * environments and in CSP environments that allow
         * unsafe-inline for styles).
         */
        nonce?: string;
    }
}

export {};
