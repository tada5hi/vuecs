// Anchor import so TypeScript can resolve `@vuecs/core` for the
// declaration-merging augmentation below. Type-only — no runtime cost.
import type {} from '@vuecs/core';

/**
 * Design-system config keys. Augments the cross-cutting `Config`
 * interface in `@vuecs/core`. Side-effect imported by this package's
 * `index.ts` so the augmentation is loaded whenever consumers depend
 * on `@vuecs/design`.
 *
 * No `withDefaults` registration here — `nonce` has no sensible
 * framework default; it must come from the consumer's CSP setup.
 * `setPalette` reads it via `useConfig('nonce')` (returns `undefined`
 * when unset).
 */
declare module '@vuecs/core' {
    interface Config {
        /**
         * CSP nonce written onto inline `<style>` tags created at
         * runtime — used by `setPalette`'s `<style id="vc-palette">`
         * block. When unset, no `nonce` attribute is added (works in
         * non-CSP environments and in CSP environments that allow
         * unsafe-inline for styles).
         */
        nonce?: string;
    }
}

export {};
