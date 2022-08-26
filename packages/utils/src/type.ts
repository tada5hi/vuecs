/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Ref, VNodeProps } from 'vue';

export type NonBoolean<T> = T extends boolean ? never : T;
export type MaybeRef<T> = T | Ref<T>;
export type ToMaybeRef<T> = {
    [K in keyof T]: MaybeRef<T[K]>;
};

export type VNodeClass = string | string[] | Record<string, boolean> | VNodeClass[];
export type VNodeProperties = VNodeProps & {
    class?: VNodeClass,
    [key: string]: any
};

export type PrefixProperty<T, P extends string> = T extends string ?
    `${P}${Capitalize<T>}` :
    never;

export type PrefixProperties<T extends Record<string, any>, P extends string> = {
    [K in keyof T as K extends string ? PrefixProperty<K, P> : never]: T[K]
};
