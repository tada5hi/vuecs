/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type OptionInputConfigWithPresets<V> = {
    value?: V,
    presets: Record<string, boolean>,
    defaults?: boolean
};

export type OptionInputConfigWithDefaults<V> = {
    value?: V,
    presets?: Record<string, boolean>,
    defaults: boolean
};

export type OptionInputConfig<V> = OptionInputConfigWithPresets<V> | OptionInputConfigWithDefaults<V>;

export type OptionInputValue<V> = V | OptionInputConfig<V>;
export type OptionsInputValue<T> = {
    [K in keyof T]: OptionInputValue<T[K]>;
};

export type OptionsOverride<
    T extends Record<string, any>,
    C extends Record<string, any>,
> = Omit<T, keyof C> & C;

export type OptionBuildContext<K, V> = {
    /**
     * The name of the component.
     */
    component: string,
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
    value: OptionInputValue<V | undefined>,
};
