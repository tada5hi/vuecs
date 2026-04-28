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

/**
 * An icon preset — bundles a set of behavioral defaults that map vuecs's
 * semantic icon-prop slots (e.g. `pagination.prevIcon`) to Iconify icon
 * names (e.g. `'lucide:chevron-left'`). Presets are configuration mappings
 * only; they do not ship runtime icon data. Consumers wire icon delivery
 * via their own tooling (`@nuxt/icon`, `addCollection()`, `unplugin-icons`).
 */
export type Icon = {
    defaults?: Partial<ComponentDefaults>;
};

export type IconsOptions = {
    icons?: Icon[];
};
