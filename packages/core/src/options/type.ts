/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { InjectionKeys, MaybeRef, ToMaybeRef } from '../type';

export type OptionValueConfig<V> = {
    value: V,
    presets: Record<string, boolean>
};

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
