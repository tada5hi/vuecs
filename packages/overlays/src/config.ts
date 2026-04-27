import type { ConfigManager } from '@vuecs/core';

/**
 * Overlay-specific config keys. Augments the cross-cutting `Config`
 * interface in `@vuecs/core`. Side-effect imported by this package's
 * `index.ts` so the augmentation is loaded whenever consumers depend
 * on `@vuecs/overlays`.
 */
declare module '@vuecs/core' {
    interface Config {
        /**
         * Selector or element that should receive scroll-lock when an
         * overlay opens (modal/popover/dropdown in modal mode).
         * Defaults to `'body'` (registered by overlays' install).
         */
        scrollLockTarget?: string | HTMLElement;
    }
}

/**
 * Register overlay-specific defaults onto a `ConfigManager` instance.
 * Called from `@vuecs/overlays`'s `install(app)` after
 * `installConfigManager`. Consumer-supplied config wins; this only fills
 * in keys the consumer didn't pass.
 */
export function registerOverlayConfigDefaults(manager: ConfigManager): void {
    manager.withDefaults({ scrollLockTarget: 'body' });
}
