import type { StoreManager } from '../store-manager';

export type ComponentOptionInputConfigWithPresets<V> = {
    value?: V,
    presets: Record<string, boolean>,
    defaults?: boolean
};

export type ComponentOptionInputConfigWithDefaults<V> = {
    value?: V,
    presets?: Record<string, boolean>,
    defaults: boolean
};

export type ComponentOptionInputConfig<V> = ComponentOptionInputConfigWithPresets<V> | ComponentOptionInputConfigWithDefaults<V>;

export type ComponentOptionInputValue<V> = V | ComponentOptionInputConfig<V>;
export type ComponentOptionsInputValue<T> = {
    [K in keyof T]: ComponentOptionInputValue<T[K]>;
};

export type ComponentOptionsOverride<
    T extends Record<string, any>,
    C extends Record<string, any>,
> = Omit<T, keyof C> & C;

export type ComponentOptionBuildContext<K, V> = {
    /**
     * The options key of the component.
     */
    key: K,
    /**
     * Alternative value if it is not defined or
     * provided by a preset.
     */
    alt?: V,
    /**
     * Value with or without configuration for
     * presets.
     */
    value: ComponentOptionInputValue<V | undefined>
};

export type ComponentOptions = Record<string, any>;
export type ComponentsOptions = Record<string, ComponentOptions>;

export type ComponentOptionsManagerContext = {
    /**
     * Name of the component.
     */
    name: string,
    /**
     * Store manager key.
     *
     * default: 'default'
     */
    storeManagerKey?: string

    /**
     * Store manager
     */
    storeManager?: StoreManager
};
