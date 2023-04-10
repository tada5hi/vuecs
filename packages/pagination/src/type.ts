/*
 * Copyright (c) 2022-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { OptionsInput, PluginBaseOptions, VNodeClass } from '@vue-layout/core';
import type { VNodeArrayChildren } from 'vue';

export type PaginationMeta = {
    busy?: boolean,
    total: number,
    limit: number,
    offset: number,
    page: number
};

export type PaginationOptions = {
    limit: number,
    offset: number,
    total: number,
    load: (meta: PaginationMeta) => (Promise<any> | any),
    busy: boolean,

    tag: string,
    class: VNodeClass,

    itemTag: string,
    itemClass: VNodeClass,

    linkClass: VNodeClass,
    linkActiveClass: VNodeClass,

    prevType: string,
    prevClass?: VNodeClass,
    prevContent?: VNodeArrayChildren,

    nextType: string,
    nextClass?: VNodeClass,
    nextContent?: VNodeArrayChildren
};

export type PaginationOptionsInput = OptionsInput<
PaginationOptions,
'limit' | 'offset' | 'total' | 'load'
>;

type Options = PluginBaseOptions;

export type {
    Options,
    PluginBaseOptions,
};
