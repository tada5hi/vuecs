/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { MaybeRef, ToMaybeRef } from '../../type';

type OptionValueConfigWithPresets<V> = {
    value?: V,
    presets: Record<string, boolean>,
    defaults?: boolean
};

type OptionValueConfigWithDefaults<V> = {
    value?: V,
    presets?: Record<string, boolean>,
    defaults: boolean
};
export type OptionValueConfig<V> = OptionValueConfigWithPresets<V> | OptionValueConfigWithDefaults<V>;

export type OptionValueInput<V> = V | OptionValueConfig<V>;

export type ToOptionValueInput<T> = {
    [K in keyof T]: OptionValueInput<T[K]>;
};

export type OptionsInput<
    T,
    R extends keyof T = never,
    P extends keyof T = never,
    MR extends keyof T = never,
    > =
    Pick<T, R> & // unchanged
    Partial<Pick<T, P>> & // partial
    ToOptionValueInput<ToMaybeRef<Pick<T, MR>>> & // unchanged + maybeRef
    Partial<ToOptionValueInput<ToMaybeRef<Pick<T, Exclude<keyof T, R | P | MR>>>>>; // partial + maybeRef

export type OptionValueBuildContext<K, V> = {
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
    value?: OptionValueInput<MaybeRef<V>>
};

export type OptionValueBuilder<
    O extends Record<string, any>,
    > = {
        build: <K extends keyof O>(
            context: Omit<OptionValueBuildContext<K, O[K]>, 'component'>,
        ) => O[K] | undefined,
        buildOrFail: <K extends keyof O>(
            context: Omit<OptionValueBuildContext<K, O[K]>, 'component'>,
        ) => O[K],

    };
