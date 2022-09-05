/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Ref } from 'vue';
import { ProviderInterface } from './provider';
import { StateType } from './store';

export type MaybeRef<T> = T | Ref<T>;
export type ToMaybeRef<T> = {
    [K in keyof T]: MaybeRef<T[K]>;
};

export type Options = {
    provider: ProviderInterface,
    state: StateType
};

export type Component = {
    id?: string | number,
    tier?: number,
    name?: string,

    url?: string,
    urlTarget?: '_self' | '_blank' | '_parent' | '_top' | string,

    default?: boolean,
    type?: 'separator' | 'link',

    icon?: string,

    display?: boolean,
    displayChildren?: boolean,

    rootLink?: boolean,
    components?: Component[],

    [key: string]: any
};
