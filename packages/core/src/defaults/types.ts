import type { MaybeRef } from 'vue';

/**
 * Augmentable interface for registering per-component default shapes.
 *
 * Each component package extends this via TypeScript declaration merging
 * to register its component name and typed behavioral defaults.
 *
 * Values may be `MaybeRef` to support reactive sources (e.g. i18n `computed()`).
 */
export interface ComponentDefaults {}

export type ComponentDefaultValues<T> = {
    [K in keyof T]?: MaybeRef<T[K] | undefined>;
};

export type DefaultsManagerOptions = {
    defaults?: Partial<ComponentDefaults>;
};
