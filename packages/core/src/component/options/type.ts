/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { MaybeRef, ToMaybeRef } from '../../type';

export type ComponentOptionConfigWithPresets<V> = {
    value?: V,
    presets: Record<string, boolean>,
    defaults?: boolean
};

export type ComponentOptionConfigWithDefaults<V> = {
    value?: V,
    presets?: Record<string, boolean>,
    defaults: boolean
};

export type ComponentOptionConfigWithValue<V> = {
    value: V,
    presets?: Record<string, boolean>,
    defaults?: boolean
};

export type ComponentOptionConfig<V> = ComponentOptionConfigWithPresets<V> |
ComponentOptionConfigWithDefaults<V> |
ComponentOptionConfigWithValue<V>;

export type ComponentOptionInput<V> = V | ComponentOptionConfig<V>;

export type ToComponentOptionInput<T> = {
    [K in keyof T]: ComponentOptionInput<T[K]>;
};

// todo: remove type and deps
export type OptionsInput<
    T,
    R extends keyof T = never,
    P extends keyof T = never,
    MR extends keyof T = never,
    > =
    Pick<T, R> & // unchanged
    Partial<Pick<T, P>> & // partial
    ToComponentOptionInput<ToMaybeRef<Pick<T, MR>>> & // unchanged + maybeRef
    Partial<ToComponentOptionInput<ToMaybeRef<Pick<T, Exclude<keyof T, R | P | MR>>>>>; // partial + maybeRef

export type ComponentOptionBuildContext<K, V> = {
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
    value?: ComponentOptionInput<MaybeRef<V>>
};

export type ComponentOptionBuilder<
    O extends Record<string, any>,
    > = {
        build: <K extends keyof O>(
            context: Omit<ComponentOptionBuildContext<K, O[K]>, 'component'>,
        ) => O[K] | undefined,
        buildOrFail: <K extends keyof O>(
            context: Omit<ComponentOptionBuildContext<K, O[K]>, 'component'>,
        ) => O[K],

    };
