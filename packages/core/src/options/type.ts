/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { InjectionKeys, MaybeRef, ToMaybeRef } from '../type';

/**
 * THe option value config should be created
 * using buildOptionValueConfig.
 */
export type OptionValueConfig<V> = {
    __vl__isOptionValueConfig: true,
    value: V,
    presets?: Record<string, boolean>
};

export type OptionValueInput<V> = V | OptionValueConfig<V>;
export type ToOptionValueInput<T> = {
    [K in keyof T]: OptionValueInput<T[K]>;
};

export type OptionsInput<T,
    R extends keyof T = never,
    P extends keyof T = never,
    MR extends keyof T = never,
    > =
    Pick<T, R> &
    Partial<Pick<T, P>> &
    ToOptionValueInput<ToMaybeRef<Pick<T, MR>>> &
    Partial<ToOptionValueInput<ToMaybeRef<Pick<T, Exclude<keyof T, R | P | MR>>>>>;

export type OptionValueBuildContext<O, V> = {
    component: string,
    key: O,
    alt?: V,
    value?: OptionValueInput<MaybeRef<V>>,
    injectionKeys?: InjectionKeys
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
