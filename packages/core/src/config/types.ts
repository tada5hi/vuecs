import type { MaybeRef } from 'vue';

export type Direction = 'ltr' | 'rtl';

/**
 * Cross-cutting configuration shared by overlay components and any consumer
 * that needs reading direction, locale, CSP nonce, or a non-default scroll
 * lock target. Mirrors reka-ui's `ConfigProvider` shape but is installed
 * via vuecs's plugin API instead of a wrapper component.
 */
export type Config = {
    /** Reading direction. Used by `useArrowNavigation` and overlay positioning. */
    dir: Direction;
    /** BCP-47 locale tag. Reserved for future date / number / RTL-aware components. */
    locale: string;
    /** CSP nonce written onto inline `<style>` tags created at runtime (palette switcher, etc.). */
    nonce?: string;
    /** Selector or element that should receive scroll-lock when an overlay opens. Defaults to `<body>`. */
    scrollLockTarget?: string | HTMLElement;
};

export type ConfigManagerOptions = {
    config?: Partial<{
        [K in keyof Config]: MaybeRef<Config[K] | undefined>;
    }>;
};
