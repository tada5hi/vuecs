/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Ref, VNodeProps } from 'vue';

export type MaybeRef<T> = T | Ref<T>;
export type ToMaybeRef<T> = {
    [K in keyof T]: MaybeRef<T[K]>;
};

export type VNodeClass = string | string[] | Record<string, boolean> | VNodeClass[];
export type VNodeProperties = VNodeProps & {
    class?: VNodeClass,
    [key: string]: any
};

export type InjectionKeys = {
    components: string,
    presets: string
};
