import type { MaybeRef } from 'vue';

export type Direction = 'ltr' | 'rtl';

/**
 * Cross-cutting configuration. Augmentable interface — child packages
 * register their own keys via TypeScript declaration merging, mirroring
 * the `ThemeElements` and `ComponentDefaults` pattern.
 *
 * Core declares only the truly cross-cutting keys (`dir`, `locale`).
 * Child packages declare the rest:
 *
 *   - `@vuecs/design` augments with `nonce` (CSP nonce for `setPalette`'s
 *     injected `<style id="vc-palette">` block).
 *   - `@vuecs/overlays` augments with `scrollLockTarget` (selector / element
 *     that should receive scroll-lock when an overlay opens).
 *
 * Adding a new key: declaration-merge into this interface from your package
 * AND ship a side-effect import (e.g. `import '@vuecs/yourpkg/config'`) so
 * the augmentation file is loaded.
 */
export interface Config {
    /** Reading direction. Used by `useArrowNavigation` and overlay positioning. */
    dir?: Direction;
    /** BCP-47 locale tag. Reserved for future date / number / RTL-aware components. */
    locale?: string;
}

export type ConfigManagerOptions = {
    config?: Partial<{
        [K in keyof Config]: MaybeRef<Config[K] | undefined>;
    }>;
};
